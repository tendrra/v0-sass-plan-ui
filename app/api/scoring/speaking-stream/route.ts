import { streamText } from "ai"
import type { NextRequest } from "next/server"

export const runtime = "edge"

export async function POST(request: NextRequest) {
  try {
    const { transcript, questionText, userId } = await request.json()

    if (!transcript || !questionText) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("[v0] Starting AI reasoning stream for scoring...")

    const result = streamText({
      model: "openai/gpt-4o",
      system: `You are an expert PTE (Pearson Test of English) speaking examiner with an agent-based evaluation system.

Your task is to think through the response step-by-step and explain your reasoning:
1. CONTENT EVALUATION: Analyze what was said and how well it answers the question
2. FLUENCY ASSESSMENT: Listen to pacing, smoothness, hesitations, filler words
3. PRONUNCIATION CHECK: Evaluate clarity, accent, word stress
4. SCORING RATIONALE: Explain how scores were determined based on observations

Format your response as a continuous stream of reasoning followed by final scores in JSON.
Make your thinking transparent so the test taker understands how they were evaluated.`,
      prompt: `You are evaluating a PTE Read Aloud response. Think through this carefully and share your reasoning.

Original Text: "${questionText}"

User's Transcribed Speech: "${transcript}"

Walk me through your evaluation process:
1. Content: How accurate and complete is the response?
2. Fluency: How smooth and natural is the speech?
3. Pronunciation: How clear and correct are the sounds?

After reasoning through each aspect, provide final scores for:
- Content (0-90)
- Fluency (0-90)  
- Pronunciation (0-90)
- Overall (0-90)

Be transparent in your thinking - the user should understand exactly how you evaluated their response.`,
      maxTokens: 2000,
      temperature: 0.3,
    })

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            const data = JSON.stringify({ text: chunk })
            controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
          }

          controller.enqueue(new TextEncoder().encode("data: [DONE]\n\n"))
          controller.close()
        } catch (error) {
          console.error("[v0] Stream error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    })
  } catch (error) {
    console.error("[v0] Scoring stream error:", error)
    return new Response(JSON.stringify({ error: "Scoring failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
