# Platform Setup Instructions

## Current Status

Your language testing SaaS platform is fully built and ready to use! All integrations are connected:

✅ Neon PostgreSQL Database  
✅ Upstash Redis  
✅ Vercel AI SDK v6  
✅ Drizzle ORM  
✅ Zustand State Management  
✅ Next.js 16 with React 19  

## Quick Start (3 Steps)

### Step 1: Run Database Migrations

1. Open the v0 interface
2. Navigate to the `scripts` folder
3. Execute these SQL files in order:
   - `01_create_tables.sql` - Creates indexes for performance
   - `02_seed_sample_questions.sql` - Adds sample questions

**How to run scripts in v0:**
- The scripts will execute automatically when you open them
- Or click the "Run Script" button if available

### Step 2: Test the Platform

Visit these pages to test functionality:

**User Interface:**
- `/` - Landing page
- `/test/speaking` - Speaking test with audio recording and AI scoring

**Admin Interface:**
- `/admin/questions` - Question management dashboard

### Step 3: Verify Integrations

Check the health endpoint:
- `/api/health` - Verifies database and Redis connections

## Features Overview

### Speaking Tests
- Real-time audio recording with Web Audio API
- AI transcription using OpenAI Whisper
- Detailed scoring for Content, Fluency, Pronunciation
- Score breakdown modal matching your Alfa PTE design
- Audio playback with waveform visualization

### Writing Tests (API Ready)
- Grammar and vocabulary analysis
- Coherence and cohesion scoring
- Word count tracking
- Time-based submissions

### Admin CMS
- Create and manage questions
- Set difficulty levels (Easy, Medium, Hard)
- Activate/deactivate questions
- Bulk operations support

### Navigation System
- **Side Drawer**: Question browser with filters, search, and pagination
- **Bottom Drawer**: Quick task switching between Speaking/Writing/Reading/Listening
- Mobile-responsive design

### AI Scoring Engine
- Uses Vercel AI Gateway (no API key needed!)
- Structured output with Zod schemas
- Detailed feedback with strengths and improvements
- Real-time transcript analysis

### Rate Limiting
- Redis-backed rate limiting
- 50 AI scoring requests per hour per user
- Configurable limits in `lib/redis.ts`

## Environment Variables

All required variables are already set:

```
DATABASE_URL - Neon PostgreSQL
KV_REST_API_URL - Upstash Redis URL
KV_REST_API_TOKEN - Upstash Redis Token
POSTGRES_* - Additional Neon variables
```

No additional setup needed!

## File Structure

```
app/
├── page.tsx                    # Landing page
├── test/
│   └── speaking/
│       └── page.tsx           # Speaking test interface
├── admin/
│   └── questions/
│       └── page.tsx           # Admin CMS
└── api/
    ├── questions/
    │   └── speaking/
    │       └── route.ts       # Question CRUD
    ├── scoring/
    │   ├── speaking/
    │   │   └── route.ts       # AI speaking scorer
    │   └── writing/
    │       └── route.ts       # AI writing scorer
    ├── transcribe/
    │   └── route.ts           # Audio to text
    └── health/
        └── route.ts           # Health check

components/
├── test/
│   ├── audio-recorder.tsx     # Audio recording component
│   ├── scoring-modal.tsx      # AI score display
│   ├── question-drawer.tsx    # Side navigation
│   └── task-drawer.tsx        # Bottom navigation
└── ui/                        # shadcn/ui components

lib/
├── drizzle/
│   ├── index.ts              # Database client
│   └── schema.ts             # Complete SaaS schema
├── stores/
│   └── test-store.ts         # Zustand state
├── redis.ts                  # Redis client + rate limiting
├── types.ts                  # TypeScript definitions
└── utils/
    └── audio.ts              # Audio utilities

scripts/
├── 01_create_tables.sql      # Database indexes
└── 02_seed_sample_questions.sql  # Sample data
```

## Usage Examples

### Recording and Scoring a Speaking Test

1. Go to `/test/speaking`
2. Click "Start Recording"
3. Read the text aloud
4. Click "Stop"
5. Click "Submit"
6. View AI scores in the modal

### Adding Questions (Admin)

1. Go to `/admin/questions`
2. Click "Add Question"
3. Fill in title, type, prompt text, difficulty
4. Click "Create Question"
5. Question appears in the list

### API Usage

**Fetch Questions:**
```typescript
const response = await fetch('/api/questions/speaking?type=read_aloud')
const { questions } = await response.json()
```

**Score Speaking:**
```typescript
const response = await fetch('/api/scoring/speaking', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user123',
    questionId: 'question-id',
    transcript: 'User speech transcript',
    questionText: 'Original question text',
    durationMs: 35000
  })
})
const { scores, remaining } = await response.json()
```

## Customization

### Change AI Models

Edit API routes in `app/api/scoring/`:

```typescript
// Current: openai/gpt-5
// Options: anthropic/claude-sonnet-4.5, xai/grok-4-fast, etc.
const { object: scores } = await generateObject({
  model: "anthropic/claude-sonnet-4.5",
  schema: scoringSchema,
  prompt: "..."
})
```

### Adjust Rate Limits

Edit `lib/redis.ts`:

```typescript
// Change limit and window
await checkRateLimit(userId, 100, 3600) // 100 requests per hour
```

### Modify Scoring Rubrics

Edit the Zod schemas in `app/api/scoring/speaking/route.ts` and `writing/route.ts`:

```typescript
const scoringSchema = z.object({
  overallScore: z.number().min(0).max(90),
  // Add custom rubrics here
  customScore: z.number().min(0).max(100),
})
```

## Troubleshooting

### Issue: "Failed to fetch questions"
**Solution**: Run the database migration scripts first

### Issue: "Rate limit exceeded"
**Solution**: Wait for the rate limit window to reset (check `X-RateLimit-Reset` header)

### Issue: "Failed to transcribe audio"
**Solution**: Ensure microphone permissions are granted in the browser

### Issue: Database connection errors
**Solution**: Check `/api/health` to verify database connectivity

## Next Steps

1. **Add Authentication**: Integrate Stack Auth (already in schema)
2. **Add Writing UI**: Build writing test interface
3. **Add Reading/Listening**: Complete all test types
4. **Progress Dashboard**: Track user performance over time
5. **Mock Tests**: Full exam simulation mode
6. **Subscription Plans**: Integrate Stripe for payments

## Support

For debugging:
- Check browser console for `[v0]` prefixed logs
- Verify all environment variables in the Vars section
- Test API endpoints with `/api/health`
- Check Redis keys in Upstash dashboard

## Credits

Built with:
- Next.js 16 + React 19
- Vercel AI SDK v6
- Drizzle ORM
- Upstash Redis
- shadcn/ui
- Tailwind CSS v4

All rights reserved © Alfa Education, 2025
