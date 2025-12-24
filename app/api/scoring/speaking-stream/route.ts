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

    console.log("[v0] Starting AI scoring stream...")

    // Stream the AI reasoning and scoring
    const result = streamText({
      model: "openai/gpt-4o",
      system: `You are an expert PTE (Pearson Test of English) speaking examiner. 
      
Your task is to:
1. First, explain your reasoning step by step as you analyze the response
2. Evaluate pronunciation, fluency, and content accuracy
3. Provide detailed scores with justification

Format your response as follows:
1. Start with "REASONING:" followed by your detailed analysis
2. Then provide "SCORES:" in JSON format

Be thorough in your reasoning to help the test taker understand their performance.`,
      prompt: `Evaluate this PTE Read Aloud response:

Original Text: "${questionText}"

User's Transcribed Speech: "${transcript}"

Provide your reasoning first, then scores for:
- Content (0-90): Accuracy of words spoken
- Fluency (0-90): Smoothness and pace
- Pronunciation (0-90): Clarity and accuracy of sounds

Think through each aspect carefully and explain your evaluation.`,
      maxTokens: 1000,
      temperature: 0.3,
    })

    // Create a readable stream that formats the AI output
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.textStream) {
            // Send each chunk to the client
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
