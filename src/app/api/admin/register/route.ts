import { NextResponse } from "next/server";
import { z } from "zod";
import { isAdminEmail } from "@/lib/admin-emails";
import { getServiceSupabase } from "@/lib/supabase-admin";
import { supabase } from "@/lib/supabase";
import { sameOriginOk, rateLimitOk, forbiddenResponse, rateLimitedResponse } from "@/lib/security";

export const maxDuration = 30;

const registerSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(128),
  full_name: z.string().trim().min(1).max(120).optional(),
  invite_code: z.string().trim().min(4).max(64).optional(),
});

/**
 * Create a CRM staff account for an allowlisted email.
 * Order: invite RPC (no service role) → service-role Admin API → clear error.
 */
export async function POST(req: Request) {
  try {
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, "admin-register", 10)) return rateLimitedResponse();

    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Provide a valid email, invite code, and a password of at least 8 characters." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    if (!isAdminEmail(email)) {
      return NextResponse.json(
        {
          error:
            "This email is not authorized for CRM access. Ask the owner to add it to NEXT_PUBLIC_ADMIN_EMAILS, then send an invite from the CRM.",
        },
        { status: 403 }
      );
    }

    // 1) Preferred: invite-code RPC (works without SUPABASE_SERVICE_ROLE_KEY)
    if (parsed.data.invite_code) {
      const { data, error } = await supabase.rpc("register_staff_from_invite", {
        p_email: email,
        p_password: parsed.data.password,
        p_code: parsed.data.invite_code.trim(),
        p_full_name: parsed.data.full_name || "",
      });

      if (error) {
        console.error("register_staff_from_invite RPC error:", error);
        return NextResponse.json(
          { error: "Unable to create account. Check the invite code and try again." },
          { status: 400 }
        );
      }

      const result = data as { success?: boolean; error?: string; user?: { id: string; email: string }; message?: string };
      if (!result?.success) {
        return NextResponse.json(
          { error: result?.error || "Unable to create account." },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        user: result.user,
        message: result.message || "Account created. You can sign in now.",
      });
    }

    // 2) Fallback: service-role create (no invite required for allowlisted emails)
    const admin = getServiceSupabase();
    if (!admin) {
      return NextResponse.json(
        {
          error:
            "An invite code is required. Ask a signed-in staff member to create an invite in the CRM, or set SUPABASE_SERVICE_ROLE_KEY on the server.",
          code: "INVITE_REQUIRED",
        },
        { status: 400 }
      );
    }

    const { data, error } = await admin.auth.admin.createUser({
      email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        full_name: parsed.data.full_name || "",
        role: "staff",
      },
    });

    if (error) {
      const msg = error.message || "Unable to create account";
      const status = /already|registered|exists/i.test(msg) ? 409 : 400;
      return NextResponse.json({ error: msg }, { status });
    }

    return NextResponse.json({
      success: true,
      user: { id: data.user?.id, email: data.user?.email },
      message: "Account created. You can sign in now.",
    });
  } catch (err) {
    console.error("Admin register error:", err);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
