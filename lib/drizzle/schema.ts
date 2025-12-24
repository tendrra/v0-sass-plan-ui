import { pgTable, text, uuid, timestamp, integer, jsonb, boolean, numeric, pgEnum } from "drizzle-orm/pg-core"

// Enums
export const difficultyEnum = pgEnum("difficulty", ["easy", "medium", "hard"])
export const roleEnum = pgEnum("role", ["user", "admin"])
export const questionTypeEnum = pgEnum("question_type", [
  "read_aloud",
  "repeat_sentence",
  "describe_image",
  "retell_lecture",
  "answer_short_question",
  "summarize_written_text",
  "essay",
])

// Users table (references existing schema)
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  name: text("name"),
  role: roleEnum("role").default("user"),
  image: text("image"),
  emailVerified: boolean("email_verified").default(false),
  aiCreditsUsed: integer("ai_credits_used").default(0),
  dailyAiCredits: integer("daily_ai_credits").default(100),
  practiceQuestionsUsed: integer("practice_questions_used").default(0),
  dailyPracticeLimit: integer("daily_practice_limit").default(50),
  lastCreditReset: timestamp("last_credit_reset"),
  lastPracticeReset: timestamp("last_practice_reset"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Speaking Questions
export const speakingQuestions = pgTable("speaking_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  externalId: text("external_id"),
  title: text("title").notNull(),
  type: questionTypeEnum("type").notNull(),
  promptText: text("prompt_text").notNull(),
  promptMediaUrl: text("prompt_media_url"),
  referenceAudioUrlUs: text("reference_audio_url_us"),
  referenceAudioUrlUk: text("reference_audio_url_uk"),
  difficulty: difficultyEnum("difficulty").default("medium"),
  tags: jsonb("tags"),
  metadata: jsonb("metadata"),
  isActive: boolean("is_active").default(true),
  bookmarked: boolean("bookmarked").default(false),
  appearanceCount: integer("appearance_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})

// Speaking Attempts
export const speakingAttempts = pgTable("speaking_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  questionId: uuid("question_id")
    .notNull()
    .references(() => speakingQuestions.id),
  audioUrl: text("audio_url"),
  transcript: text("transcript"),
  type: questionTypeEnum("type"),
  durationMs: integer("duration_ms"),
  overallScore: integer("overall_score"),
  contentScore: integer("content_score"),
  fluencyScore: integer("fluency_score"),
  pronunciationScore: integer("pronunciation_score"),
  wordsPerMinute: numeric("words_per_minute"),
  fillerRate: numeric("filler_rate"),
  scores: jsonb("scores"),
  timings: jsonb("timings"),
  isPublic: boolean("is_public").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

// Writing Questions
export const writingQuestions = pgTable("writing_questions", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  promptText: text("prompt_text").notNull(),
  difficulty: difficultyEnum("difficulty").default("medium"),
  tags: jsonb("tags"),
  options: jsonb("options"),
  answerKey: jsonb("answer_key"),
  isActive: boolean("is_active").default(true),
  bookmarked: boolean("bookmarked").default(false),
  createdAt: timestamp("created_at").defaultNow(),
})

// Writing Attempts
export const writingAttempts = pgTable("writing_attempts", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  questionId: uuid("question_id")
    .notNull()
    .references(() => writingQuestions.id),
  userResponse: text("user_response").notNull(),
  wordCount: integer("word_count"),
  timeTaken: integer("time_taken"),
  overallScore: integer("overall_score"),
  contentScore: integer("content_score"),
  grammarScore: integer("grammar_score"),
  vocabularyScore: integer("vocabulary_score"),
  coherenceScore: integer("coherence_score"),
  scores: jsonb("scores"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
})
