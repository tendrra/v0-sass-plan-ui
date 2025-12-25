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
  reasoning: z.object({
    contentReasoning: z.string(),
    grammarReasoning: z.string(),
    vocabularyReasoning: z.string(),
    coherenceReasoning: z.string(),
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
      prompt: `You are an expert PTE/IELTS writing examiner with agent-based evaluation.

WRITING TASK: ${questionText}
USER'S RESPONSE: ${userResponse}
TIME TAKEN: ${timeTaken} seconds

EVALUATION PROCESS:
1. CONTENT: Is the response addressing the task? Is it relevant, complete, and well-developed?
2. GRAMMAR: Are there any grammatical errors? Is a range of structures used accurately?
3. VOCABULARY: What is the range of vocabulary? Are words used precisely and appropriately?
4. COHERENCE: Is the writing organized logically? Are ideas connected smoothly?

For each dimension:
- Explain what you observe in detail
- Provide specific examples from the response
- Give a score (0-90)
- Suggest improvements

Then provide overall feedback and scoring.`,
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
          scores: {
            ...scores,
            reasoning: scores.reasoning,
          } as any,
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
