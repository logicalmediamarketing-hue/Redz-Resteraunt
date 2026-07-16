// Shared request gating for the public API routes.
//
// All legitimate callers of these endpoints are browsers on our own pages, and
// browsers always send an Origin header on POST — so a missing or foreign
// Origin is rejected. This stops cross-site and drive-by scripted abuse; a
// determined attacker can forge Origin, so production should also enable
// platform-level rate limiting (e.g. Vercel WAF) for defense in depth.

function isLocalHost(value: string | null): boolean {
  if (!value) return false;
  const host = value.split(':')[0]?.toLowerCase();
  return host === 'localhost' || host === '127.0.0.1' || host === '::1';
}

export function sameOriginOk(req: Request): boolean {
  const origin = req.headers.get('origin');
  if (!origin) return false;

  let originHost: string;
  try {
    originHost = new URL(origin).host;
  } catch {
    return false;
  }

  const host = req.headers.get('host');
  if (!host) return false;

  // Exact match against the request Host (normal production / preview traffic)
  if (originHost === host) return true;

  // Explicit production allowlist from SITE_URL (covers www vs apex mismatches)
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (siteUrl) {
    try {
      if (originHost === new URL(siteUrl).host) return true;
    } catch {
      // ignore malformed SITE_URL
    }
  }

  // Localhost only in development AND only when the request itself is local
  if (process.env.NODE_ENV === 'development' && isLocalHost(originHost) && isLocalHost(host)) {
    return true;
  }

  return false;
}

// Best-effort in-memory sliding-window limiter, per serverless instance.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_BUCKETS = 5000;
const buckets = new Map<string, number[]>();

export function rateLimitOk(req: Request, key: string, maxPerHour: number): boolean {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
  const bucketKey = `${key}:${ip}`;
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) buckets.clear();

  const hits = (buckets.get(bucketKey) || []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= maxPerHour) return false;

  hits.push(now);
  buckets.set(bucketKey, hits);
  return true;
}

// Standard 403/429 responses so the routes stay uniform.
export function forbiddenResponse(): Response {
  return Response.json({ error: 'Request not allowed' }, { status: 403 });
}

export function rateLimitedResponse(): Response {
  return Response.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
}
