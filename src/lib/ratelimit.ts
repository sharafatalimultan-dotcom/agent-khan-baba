// Simple sliding-window limiter held in memory per server instance.
// On Vercel each lambda instance has its own memory, so treat this as a baseline.
// For strict global limits, swap this for Upstash Redis (see README).

type Bucket = { hits: number[] };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < windowMs);
  if (bucket.hits.length >= limit) {
    const retryAfter = Math.ceil((windowMs - (now - bucket.hits[0])) / 1000);
    buckets.set(key, bucket);
    return { allowed: false as const, retryAfter };
  }
  bucket.hits.push(now);
  buckets.set(key, bucket);
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (!b.hits.length || now - b.hits[b.hits.length - 1] > windowMs) buckets.delete(k);
  }
  return { allowed: true as const, retryAfter: 0 };
}

export function clientIp(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? req.headers.get("x-real-ip") ?? "unknown").trim();
}
