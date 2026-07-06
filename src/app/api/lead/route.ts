import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendNotifications } from "@/lib/notify";
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from "@/lib/security";

export const maxDuration = 30;

const leadSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  event_type: z.string().trim().min(1).max(80),
  event_date: z.string().trim().min(1).max(40),
  guest_count: z.coerce.number().int().min(1).max(1000),
  special_requests: z.string().trim().max(1000).optional()
});

export async function POST(req: Request) {
  try {
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, 'lead', 10)) return rateLimitedResponse();

    const parsed = leadSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }
    const { name, email, phone, event_type, event_date, guest_count, special_requests } = parsed.data;

    // Insert into Supabase 'leads' table.
    // No .select() after insert: the anon role has INSERT but not SELECT under RLS,
    // so a RETURNING clause would be rejected.
    const { error } = await supabase
      .from("leads")
      .insert([
        {
          name,
          email,
          phone,
          event_type,
          event_date,
          guest_count,
          special_requests: special_requests || "",
          status: "new"
        }
      ]);

    if (error) {
      console.error("Supabase leads insert error:", error);
      return NextResponse.json({ error: "Unable to submit inquiry. Please try again or call us." }, { status: 500 });
    }

    // Trigger notification (Email/SMS) directly — no HTTP roundtrip
    try {
      await sendNotifications("banquet", {
        name,
        email,
        phone,
        event_date,
        guest_count,
        special_requests
      });
    } catch (notifyError) {
      // Don't fail the whole request if notification fails, but log it
      console.error("Failed to send notification for lead:", notifyError);
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Unable to submit inquiry. Please try again or call us." }, { status: 500 });
  }
}
