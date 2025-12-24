import { Redis } from "@upstash/redis"

if (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN) {
  throw new Error("Redis environment variables are not set")
}

export const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
})

// Rate limiting helper
export async function checkRateLimit(userId: string, limit = 10, window = 60) {
  const key = `rate_limit:${userId}`
  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, window)
  }

  return {
    success: count <= limit,
    remaining: Math.max(0, limit - count),
    reset: window,
  }
}
