import { NextResponse } from "next/server";
import { createReservation, reservationInputSchema } from "@/lib/booking";
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from "@/lib/security";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, "reservations", 15)) return rateLimitedResponse();

    const parsed = reservationInputSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const result = await createReservation(
      { ...parsed.data, source: parsed.data.source || "website", status: "pending" },
      { notify: true }
    );

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ success: true, reservation: result.reservation });
  } catch (error) {
    console.error("Reservation submission error:", error);
    return NextResponse.json(
      { error: "Unable to submit reservation. Please try again or call 856-380-6045." },
      { status: 500 }
    );
  }
}
