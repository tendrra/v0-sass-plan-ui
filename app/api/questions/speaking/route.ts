import { type NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/drizzle"
import { speakingQuestions } from "@/lib/drizzle/schema"
import { eq } from "drizzle-orm"

const MOCK_QUESTIONS = [
  {
    id: "1001644",
    title: "Road bicycle racing",
    type: "read_aloud",
    promptText:
      "Road bicycle racing is the cycle sports discipline of road cycling, held on paved roads. Road racing is the most popular professional form of bicycle racing in terms of numbers of competitors, event, and spectators. The two most common competition formats are mass start events, where riders start simultaneously and race to set finish point; and time trials, where individual riders or teams race a course alone against the clock.",
    difficulty: "medium",
    tags: ["sports", "cycling"],
    isActive: true,
    preparationSeconds: 35,
    responseSeconds: 35,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "1001643",
    title: "Coconut oil",
    type: "read_aloud",
    promptText:
      "Coconut oil is an edible oil extracted from the kernel or meat of mature coconuts harvested from the coconut palm. It has various applications in food, medicine, and industry. Because of its high saturated fat content, it is slow to oxidize and resistant to rancidification, lasting up to six months without spoiling.",
    difficulty: "medium",
    tags: ["food", "health"],
    isActive: true,
    preparationSeconds: 35,
    responseSeconds: 35,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: "1001642",
    title: "Shrimp Farmers V2",
    type: "read_aloud",
    promptText:
      "Shrimp farming has grown from a small-scale rural activity to become a major global industry. It provides employment and income for millions of people around the world. However, intensive shrimp farming can have negative environmental impacts including mangrove destruction and water pollution.",
    difficulty: "medium",
    tags: ["agriculture", "environment"],
    isActive: true,
    preparationSeconds: 35,
    responseSeconds: 35,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
]

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Fetching speaking questions...")
    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get("type")
    const difficulty = searchParams.get("difficulty")

    try {
      // Try database first, but don't throw on failure
      const query = db.select().from(speakingQuestions).where(eq(speakingQuestions.isActive, true))
      const questions = await query

      if (questions && questions.length > 0) {
        console.log("[v0] Found questions from database:", questions.length)
        return NextResponse.json({ questions })
      }
    } catch (dbError) {
      console.warn("[v0] Database not available, using mock questions:", dbError)
    }

    // Always fallback to mock data
    console.log("[v0] Using mock questions")
    return NextResponse.json({
      questions: MOCK_QUESTIONS,
      warning: "Using mock data - database tables not initialized",
    })
  } catch (error) {
    console.error("[v0] Error in questions route:", error)
    return NextResponse.json({
      questions: MOCK_QUESTIONS,
      warning: "Using mock data due to error",
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const [question] = await db
      .insert(speakingQuestions)
      .values({
        title: body.title,
        type: body.type,
        promptText: body.promptText,
        promptMediaUrl: body.promptMediaUrl,
        difficulty: body.difficulty || "medium",
        tags: body.tags,
        metadata: body.metadata,
      })
      .returning()

    return NextResponse.json({ question })
  } catch (error) {
    console.error("[v0] Error creating speaking question:", error)
    return NextResponse.json({ error: "Failed to create question" }, { status: 500 })
  }
}
