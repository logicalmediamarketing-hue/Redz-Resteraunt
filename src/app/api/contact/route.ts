import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { sendNotifications } from "@/lib/notify";
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from "@/lib/security";

export const maxDuration = 30;

const contactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  phone: z.string().trim().min(7).max(30),
  message: z.string().trim().min(1).max(2000)
});

export async function POST(req: Request) {
  try {
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, 'contact', 10)) return rateLimitedResponse();

    const parsed = contactSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
    }

    const { name, email, phone, message } = parsed.data;

    // Persist so CRM can see contact messages even if email delivery fails
    const { error } = await supabase.from("leads").insert([
      {
        name,
        email,
        phone,
        event_type: "contact",
        event_date: new Date().toISOString().slice(0, 10),
        guest_count: 1,
        special_requests: message,
        status: "new",
      },
    ]);

    if (error) {
      console.error("Supabase contact lead insert error:", error);
      // Still try to email — form shouldn't hard-fail if leads table rejects guest_count 0
    }

    await sendNotifications("contact", parsed.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact submission error:", error);
    return NextResponse.json({ error: "Unable to send message. Please try again or call us." }, { status: 500 });
  }
}
