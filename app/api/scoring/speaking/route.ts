import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { db } from "@/lib/drizzle"
import { speakingAttempts } from "@/lib/drizzle/schema"
import { checkRateLimit } from "@/lib/redis"

const scoringSchema = z.object({
  overallScore: z.number().min(0).max(90).describe("Overall score out of 90"),
  content: z.number().min(0).max(90).describe("Content score"),
  fluency: z.number().min(0).max(90).describe("Fluency score"),
  pronunciation: z.number().min(0).max(90).describe("Pronunciation score"),
  wordsPerMinute: z.number().describe("Speaking rate in words per minute"),
  fillerWordCount: z.number().describe("Number of filler words like um, uh, etc"),
  feedback: z.object({
    strengths: z.array(z.string()).describe("What the speaker did well"),
    improvements: z.array(z.string()).describe("Areas for improvement"),
    suggestions: z.array(z.string()).describe("Specific suggestions"),
  }),
  transcriptAnalysis: z
    .object({
      correctWords: z.number(),
      totalWords: z.number(),
      missedWords: z.array(z.string()),
    })
    .optional(),
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting scoring request...")
    const body = await request.json()
    const { userId, questionId, transcript, audioUrl, questionText, durationMs } = body

    console.log("[v0] Scoring for user:", userId, "question:", questionId)

    let rateLimitRemaining = 50
    try {
      const rateLimit = await checkRateLimit(userId, 50, 3600)
      if (!rateLimit.success) {
        console.warn("[v0] Rate limit exceeded for user:", userId)
        return NextResponse.json(
          {
            error: "Rate limit exceeded. Please try again later.",
            remaining: rateLimit.remaining,
          },
          { status: 429 },
        )
      }
      rateLimitRemaining = rateLimit.remaining
      console.log("[v0] Rate limit check passed, remaining:", rateLimitRemaining)
    } catch (redisError) {
      console.warn("[v0] Redis rate limit check failed, continuing without rate limit:", redisError)
    }

    if (!process.env.VERCEL_AI_GATEWAY_API_KEY) {
      console.error("[v0] VERCEL_AI_GATEWAY_API_KEY is not set")
      return NextResponse.json(
        {
          error: "AI Gateway not configured",
          message: "Please add VERCEL_AI_GATEWAY_API_KEY to environment variables",
        },
        { status: 500 },
      )
    }

    console.log("[v0] Calling AI Gateway for scoring...")
    const { object: scores } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: scoringSchema,
      prompt: `You are an expert PTE/IELTS speaking examiner. Analyze this speaking response and provide detailed scoring.

Question: ${questionText}
Transcript: ${transcript}
Duration: ${durationMs}ms

Provide scores based on PTE criteria:
- Content (0-90): Relevance, completeness, accuracy
- Fluency (0-90): Smoothness, rhythm, hesitations
- Pronunciation (0-90): Clarity, accent, word stress

Also analyze:
- Words per minute (normal: 120-150)
- Filler words (um, uh, like, you know)
- Provide constructive feedback`,
    })

    console.log("[v0] AI scoring complete:", scores.overallScore)

    try {
      const [attempt] = await db
        .insert(speakingAttempts)
        .values({
          userId,
          questionId,
          audioUrl,
          transcript,
          durationMs,
          overallScore: scores.overallScore,
          contentScore: scores.content,
          fluencyScore: scores.fluency,
          pronunciationScore: scores.pronunciation,
          wordsPerMinute: scores.wordsPerMinute.toString(),
          fillerRate: (scores.fillerWordCount / (transcript.split(" ").length || 1)).toString(),
          scores: scores as any,
        })
        .returning()

      console.log("[v0] Saved attempt to database:", attempt.id)

      return NextResponse.json({
        scores,
        attemptId: attempt.id,
        remaining: rateLimitRemaining,
      })
    } catch (dbError) {
      console.warn("[v0] Database save failed (tables may not exist yet):", dbError)
      // Return scores even if DB save fails
      return NextResponse.json({
        scores,
        remaining: rateLimitRemaining,
        warning: "Scores generated but not saved to database",
      })
    }
  } catch (error) {
    console.error("[v0] Error scoring speaking attempt:", error)
    return NextResponse.json(
      {
        error: "Failed to score attempt",
        message: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
