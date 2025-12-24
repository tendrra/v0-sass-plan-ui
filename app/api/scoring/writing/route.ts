import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { z } from "zod"
import { db } from "@/lib/drizzle"
import { writingAttempts } from "@/lib/drizzle/schema"
import { checkRateLimit } from "@/lib/redis"

const writingScoringSchema = z.object({
  overallScore: z.number().min(0).max(90).describe("Overall score out of 90"),
  content: z.number().min(0).max(90).describe("Content and ideas score"),
  grammar: z.number().min(0).max(90).describe("Grammar and accuracy score"),
  vocabulary: z.number().min(0).max(90).describe("Vocabulary range and usage score"),
  coherence: z.number().min(0).max(90).describe("Coherence and cohesion score"),
  wordCount: z.number().describe("Actual word count"),
  feedback: z.object({
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string()),
    suggestions: z.array(z.string()),
  }),
  detailedAnalysis: z.object({
    taskResponse: z.string(),
    grammarIssues: z.array(z.string()),
    vocabularyHighlights: z.array(z.string()),
    coherenceNotes: z.string(),
  }),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, questionId, userResponse, questionText, timeTaken } = body

    const rateLimit = await checkRateLimit(userId, 30, 3600)
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 })
    }

    const { object: scores } = await generateObject({
      model: "openai/gpt-4o-mini", // AI Gateway automatically uses VERCEL_AI_GATEWAY_API_KEY
      schema: writingScoringSchema,
      prompt: `You are an expert PTE/IELTS writing examiner. Analyze this writing response and provide detailed scoring.

Question: ${questionText}
Response: ${userResponse}
Time taken: ${timeTaken} seconds

Provide scores (0-90) for:
- Content: Task response, relevance, development of ideas
- Grammar: Accuracy, range of structures, error-free sentences
- Vocabulary: Range, appropriacy, precision, spelling
- Coherence: Logical organization, linking words, paragraph structure

Also provide detailed feedback and specific examples.`,
    })

    try {
      const [attempt] = await db
        .insert(writingAttempts)
        .values({
          userId,
          questionId,
          userResponse,
          wordCount: scores.wordCount,
          timeTaken,
          overallScore: scores.overallScore,
          contentScore: scores.content,
          grammarScore: scores.grammar,
          vocabularyScore: scores.vocabulary,
          coherenceScore: scores.coherence,
          scores: scores as any,
        })
        .returning()

      return NextResponse.json({
        scores,
        attemptId: attempt.id,
      })
    } catch (dbError) {
      console.warn("[v0] Database save failed:", dbError)
      return NextResponse.json({
        scores,
        warning: "Scores generated but not saved to database",
      })
    }
  } catch (error) {
    console.error("[v0] Error scoring writing attempt:", error)
    return NextResponse.json(
      {
        error: "Failed to score attempt",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
