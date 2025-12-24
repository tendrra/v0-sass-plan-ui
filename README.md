# Language Testing SaaS Platform

A comprehensive AI-powered language testing platform for PTE/IELTS preparation with real-time scoring and detailed feedback.

## Features

- **Speaking Tests**: Read Aloud, Repeat Sentence, Describe Image, Retell Lecture
- **Writing Tests**: Summarize Written Text, Essay Writing
- **AI Scoring**: Real-time scoring using Vercel AI SDK v6 with detailed rubrics
  - Content, Fluency, Pronunciation (Speaking)
  - Grammar, Vocabulary, Coherence (Writing)
- **Admin CMS**: Question management system for administrators
- **Rate Limiting**: Redis-backed rate limiting per user
- **State Management**: Zustand for client-side state
- **Database**: PostgreSQL with Drizzle ORM
- **Modern UI**: Side drawer for question navigation, bottom drawer for task switching

## Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Database**: Neon PostgreSQL with Drizzle ORM
- **Caching**: Upstash Redis
- **AI**: Vercel AI SDK v6
- **Styling**: Tailwind CSS v4, shadcn/ui
- **State**: Zustand

## Getting Started

### 1. Database Setup

The database schema is already connected via Neon integration. Run the migration scripts:

1. Go to the **Scripts** folder
2. Run `01_create_tables.sql` to create indexes
3. Run `02_seed_sample_questions.sql` to add sample questions

### 2. Environment Variables

All required environment variables are already configured:
- `DATABASE_URL` - Neon PostgreSQL connection
- `KV_REST_API_URL` - Upstash Redis URL
- `KV_REST_API_TOKEN` - Upstash Redis token

### 3. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) to see the platform.

## Pages

### User Pages
- `/` - Landing page with platform overview
- `/test/speaking` - Speaking test interface with audio recording

### Admin Pages
- `/admin/questions` - Question management dashboard

## API Routes

### Questions
- `GET /api/questions/speaking` - Fetch speaking questions
- `POST /api/questions/speaking` - Create new speaking question

### Scoring
- `POST /api/scoring/speaking` - Score speaking attempt with AI
- `POST /api/scoring/writing` - Score writing attempt with AI

### Utilities
- `POST /api/transcribe` - Convert audio to text using AI

## Key Features

### Audio Recording
The platform includes a custom audio recorder component that:
- Uses Web Audio API for high-quality recording
- Records in WebM format
- Provides real-time recording timer
- Implements echo cancellation and noise suppression

### AI Scoring Engine
The scoring system uses Vercel AI SDK v6 with structured outputs:
- Analyzes responses based on official PTE rubrics
- Provides detailed feedback with strengths and improvements
- Tracks words per minute and filler words
- Generates actionable suggestions

### Rate Limiting
Redis-based rate limiting protects API endpoints:
- 50 requests per hour for scoring endpoints
- 100 requests per hour for other APIs
- Per-user tracking with automatic reset

### State Management
Zustand store manages:
- Current task and question
- Recording state
- Scoring data and modal visibility
- Question list and navigation
- Drawer states

## Database Schema

### Main Tables
- `users` - User accounts and credits
- `speaking_questions` - Speaking test questions
- `speaking_attempts` - User responses with scores
- `writing_questions` - Writing test questions
- `writing_attempts` - Writing responses with scores

### Indexes
Optimized indexes for:
- User lookups
- Question filtering by type/difficulty
- Attempt history queries

## Admin Features

The admin dashboard allows:
- Creating new questions
- Managing question metadata
- Setting difficulty levels
- Activating/deactivating questions
- Bulk operations

## Rate Limit Configuration

Edit `lib/redis.ts` to adjust:
\`\`\`typescript
checkRateLimit(userId, limit, windowInSeconds)
\`\`\`

## AI Model Configuration

The platform uses the Vercel AI Gateway by default with these models:
- `openai/gpt-5` for text scoring
- `openai/whisper-1` for speech-to-text

To change models, edit the API routes in `app/api/scoring/`.

## UI Components

Key components:
- `AudioRecorder` - Records and manages audio input
- `ScoringModal` - Displays AI scores with rubrics
- `QuestionDrawer` - Side navigation for questions
- `TaskDrawer` - Bottom navigation for task switching

## Future Enhancements

- [ ] User authentication with Stack Auth (already in schema)
- [ ] Reading and Listening test types
- [ ] Progress tracking and analytics
- [ ] Mock test mode with full simulation
- [ ] Community forum integration
- [ ] Subscription plans with Stripe

## Support

For issues or questions:
1. Check the console logs for `[v0]` prefixed debug messages
2. Verify all environment variables are set
3. Ensure database migrations have run
4. Check API rate limits in Redis

## License

All rights reserved © Alfa Education, 2025
