import { NextResponse } from "next/server";
import { z } from "zod";
import { getAvailability, MAX_PARTY_HARD } from "@/lib/booking";
import { rateLimitOk, rateLimitedResponse } from "@/lib/security";

export const maxDuration = 15;

const querySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  party_size: z.coerce.number().int().min(1).max(MAX_PARTY_HARD).default(2),
});

export async function GET(req: Request) {
  if (!rateLimitOk(req, "availability", 120)) return rateLimitedResponse();

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    date: url.searchParams.get("date"),
    party_size: url.searchParams.get("party_size") ?? "2",
  });

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid date or party size" }, { status: 400 });
  }

  const result = await getAvailability(parsed.data.date, parsed.data.party_size);
  if (result.error && result.slots.length === 0) {
    return NextResponse.json(
      { error: result.error, slots: [], maxCovers: result.maxCovers },
      { status: 400 }
    );
  }

  return NextResponse.json({
    date: parsed.data.date,
    party_size: parsed.data.party_size,
    maxCovers: result.maxCovers,
    slots: result.slots,
    warning: result.error,
  });
}
