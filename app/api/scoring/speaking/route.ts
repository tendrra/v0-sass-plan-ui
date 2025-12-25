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
  reasoning: z.object({
    contentAnalysis: z.string().describe("Detailed analysis of content"),
    fluencyAnalysis: z.string().describe("Analysis of fluency and pacing"),
    pronunciationAnalysis: z.string().describe("Analysis of pronunciation"),
    scoringRationale: z.string().describe("Explanation of how scores were determined"),
  }),
})

export async function POST(request: NextRequest) {
  try {
    console.log("[v0] Starting AI speaking scoring with agents...")
    const body = await request.json()
    const { userId, questionId, transcript, audioUrl, questionText, durationMs } = body

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
    } catch (redisError) {
      console.warn("[v0] Redis rate limit check failed, continuing:", redisError)
    }

    if (!process.env.VERCEL_AI_GATEWAY_API_KEY) {
      console.error("[v0] VERCEL_AI_GATEWAY_API_KEY is not set")
      return NextResponse.json({ error: "AI Gateway not configured" }, { status: 500 })
    }

    console.log("[v0] Calling AI Gateway with enhanced reasoning prompt...")
    const { object: scores } = await generateObject({
      model: "openai/gpt-4o-mini",
      schema: scoringSchema,
      prompt: `You are an expert PTE/IELTS speaking examiner with a detailed scoring agent.

TASK: Analyze this speaking response step by step and provide comprehensive scoring.

ORIGINAL QUESTION: ${questionText}
USER'S TRANSCRIPT: ${transcript}
DURATION: ${durationMs}ms
WORDS SPOKEN: ${transcript.split(/\s+/).length}

EVALUATION PROCESS:
1. First, analyze the CONTENT: Is the response relevant, complete, and accurate?
2. Then, analyze FLUENCY: Is the speech smooth, with natural pacing and minimal hesitations?
3. Finally, analyze PRONUNCIATION: Are words pronounced clearly and correctly?

SCORING CRITERIA (0-90):
- Content: Relevance to question, completeness, accuracy of information
- Fluency: Smoothness, natural pacing, minimal filler words/hesitations
- Pronunciation: Clarity, accent, word stress, ease of understanding

For each dimension, provide:
1. Detailed reasoning about what you observed
2. Specific examples from the transcript
3. Numerical score (0-90)
4. Constructive feedback for improvement

Also calculate:
- Words per minute (normal range: 120-150)
- Count of filler words (um, uh, like, you know, er, etc)

Provide your complete reasoning as you evaluate, then final scores.`,
    })

    console.log("[v0] AI scoring complete with reasoning:", scores.reasoning.scoringRationale.substring(0, 100))

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
          scores: {
            ...scores,
            reasoning: scores.reasoning,
          } as any,
        })
        .returning()

      return NextResponse.json({
        scores,
        attemptId: attempt.id,
        remaining: rateLimitRemaining,
      })
    } catch (dbError) {
      console.warn("[v0] Database save failed (tables may not exist):", dbError)
      return NextResponse.json({
        scores,
        remaining: rateLimitRemaining,
        warning: "Scores generated but not saved to database",
      })
    }
  } catch (error) {
    console.error("[v0] Error in AI scoring agent:", error)
    return NextResponse.json(
      {
        error: "Failed to score attempt",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
