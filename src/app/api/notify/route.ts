import { NextResponse } from 'next/server';
import { z } from 'zod';
import { sendNotifications } from '@/lib/notify';
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from '@/lib/security';

// Public endpoint (called from the browser by the reservations page).
// Same-origin gate + validation + rate limit keep it from being used as an open email/SMS relay.
const payloadSchema = z.object({
  type: z.enum(['reservation', 'banquet', 'contact']),
  data: z.object({
    name: z.string().trim().min(1).max(120),
    email: z.string().trim().email().max(254).optional(),
    phone: z.string().trim().max(30).optional(),
    date: z.string().trim().max(40).optional(),
    time: z.string().trim().max(40).optional(),
    party_size: z.coerce.number().int().min(1).max(100).optional(),
    event_date: z.string().trim().max(40).optional(),
    guest_count: z.coerce.number().int().min(1).max(1000).optional(),
    special_requests: z.string().trim().max(1000).optional(),
    message: z.string().trim().max(2000).optional()
  })
});

export async function POST(req: Request) {
  try {
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, 'notify', 20)) return rateLimitedResponse();

    const parsed = payloadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
    }

    await sendNotifications(parsed.data.type, parsed.data.data);

    return NextResponse.json({ success: true, message: 'Notifications processed.' });
  } catch (error) {
    console.error('Notification Error:', error);
    return NextResponse.json({ success: false, error: 'Unable to process request' }, { status: 500 });
  }
}
