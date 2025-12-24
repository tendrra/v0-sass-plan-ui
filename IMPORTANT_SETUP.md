# Environment Setup Required

## AI Gateway Configuration

The AI scoring functionality requires the Vercel AI Gateway API key to be configured.

**Add this to your environment variables:**

```
VERCEL_AI_GATEWAY_API_KEY=vck_3ZkCmRYgbfYXCvowGWeciYYf5AbfHpiCORN07Toq1sMIroK62D2IjiiN
```

This key has already been added to `.env.local` for local development.

For production deployment, add it through:
1. Vercel Dashboard → Your Project → Settings → Environment Variables
2. Or use the Vars section in the v0 sidebar

## Database Setup

To enable full functionality, run the SQL migration scripts in the `/scripts` folder:

1. Navigate to your Neon database dashboard
2. Open the SQL Editor
3. Copy and paste the contents of `/scripts/01_create_tables.sql`
4. Run the script to create all required tables
5. Optionally run `/scripts/02_seed_sample_questions.sql` to add sample questions

Until the database is set up, the app will use mock data for questions.

## Current Status

- ✅ Mock questions are working
- ✅ Audio transcription is working (mock implementation)
- ⚠️ AI scoring needs VERCEL_AI_GATEWAY_API_KEY environment variable
- ⚠️ Database persistence needs tables to be created
