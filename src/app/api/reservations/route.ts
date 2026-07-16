import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendNotifications } from "@/lib/notify";
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from "@/lib/security";

export const maxDuration = 30;

const reservationSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  date: z.string().trim().min(1).max(40),
  time: z.string().trim().min(1).max(40),
  party_size: z.coerce.number().int().min(1).max(20),
  special_requests: z.string().trim().max(1000).optional(),
});

export async function POST(req: Request) {
  try {
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, "reservations", 15)) return rateLimitedResponse();

    const parsed = reservationSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const { name, email, phone, date, time, party_size, special_requests } = parsed.data;

    // No .select() after insert: anon has INSERT but not SELECT under RLS.
    const { error } = await supabase.from("reservations").insert([
      {
        name,
        email,
        phone,
        date,
        time,
        party_size,
        special_requests: special_requests || "",
        status: "pending",
      },
    ]);

    if (error) {
      console.error("Supabase reservations insert error:", error);
      return NextResponse.json(
        { error: "Unable to submit reservation. Please try again or call 856-380-6045." },
        { status: 500 }
      );
    }

    try {
      await sendNotifications("reservation", {
        name,
        email,
        phone,
        date,
        time,
        party_size,
        special_requests,
      });
    } catch (notifyErr) {
      console.error("Failed to send reservation notifications:", notifyErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reservation submission error:", error);
    return NextResponse.json(
      { error: "Unable to submit reservation. Please try again or call 856-380-6045." },
      { status: 500 }
    );
  }
}
