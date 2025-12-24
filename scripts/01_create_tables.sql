-- Create enums
CREATE TYPE difficulty AS ENUM ('easy', 'medium', 'hard');
CREATE TYPE role AS ENUM ('user', 'admin');
CREATE TYPE question_type AS ENUM (
  'read_aloud',
  'repeat_sentence',
  'describe_image',
  'retell_lecture',
  'answer_short_question',
  'summarize_written_text',
  'essay'
);

-- Note: Users table already exists, just ensuring additional columns
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS role role DEFAULT 'user';
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS ai_credits_used INTEGER DEFAULT 0;
-- ALTER TABLE users ADD COLUMN IF NOT EXISTS daily_ai_credits INTEGER DEFAULT 100;

-- Speaking questions (already exists, just ensuring structure)
-- ALTER TABLE speaking_questions ADD COLUMN IF NOT EXISTS external_id TEXT;
-- ALTER TABLE speaking_questions ADD COLUMN IF NOT EXISTS metadata JSONB;

-- Writing questions (already exists)
-- No changes needed

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_user_id ON speaking_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_question_id ON speaking_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_speaking_attempts_created_at ON speaking_attempts(created_at);

CREATE INDEX IF NOT EXISTS idx_writing_attempts_user_id ON writing_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_writing_attempts_question_id ON writing_attempts(question_id);
CREATE INDEX IF NOT EXISTS idx_writing_attempts_created_at ON writing_attempts(created_at);

CREATE INDEX IF NOT EXISTS idx_speaking_questions_type ON speaking_questions(type);
CREATE INDEX IF NOT EXISTS idx_speaking_questions_difficulty ON speaking_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_speaking_questions_is_active ON speaking_questions(is_active);

CREATE INDEX IF NOT EXISTS idx_writing_questions_type ON writing_questions(type);
CREATE INDEX IF NOT EXISTS idx_writing_questions_difficulty ON writing_questions(difficulty);
CREATE INDEX IF NOT EXISTS idx_writing_questions_is_active ON writing_questions(is_active);
