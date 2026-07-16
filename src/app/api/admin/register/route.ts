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
});

type RegisterResult = {
  success?: boolean;
  error?: string;
  user?: { id: string; email: string };
  message?: string;
};

/**
 * Create a CRM staff account for an allowlisted email (no invite code).
 * Order: allowlist RPC → service-role Admin API.
 */
export async function POST(req: Request) {
  try {
    if (!sameOriginOk(req)) return forbiddenResponse();
    if (!rateLimitOk(req, "admin-register", 10)) return rateLimitedResponse();

    const parsed = registerSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Provide a valid email and a password of at least 8 characters." },
        { status: 400 }
      );
    }

    const email = parsed.data.email.trim().toLowerCase();
    if (!isAdminEmail(email)) {
      return NextResponse.json(
        {
          error:
            "This email is not authorized for CRM access. Ask the owner to add it to NEXT_PUBLIC_ADMIN_EMAILS.",
        },
        { status: 403 }
      );
    }

    // 1) Allowlist RPC (works without SUPABASE_SERVICE_ROLE_KEY)
    const { data, error } = await supabase.rpc("register_staff_account", {
      p_email: email,
      p_password: parsed.data.password,
      p_full_name: parsed.data.full_name || "",
    });

    if (!error) {
      const result = data as RegisterResult;
      if (result?.success) {
        return NextResponse.json({
          success: true,
          user: result.user,
          message: result.message || "Account created. You can sign in now.",
        });
      }
      // Fall through to service-role if allowlist miss; otherwise return RPC error
      if (result?.error && !/not authorized/i.test(result.error)) {
        const status = /already exists/i.test(result.error) ? 409 : 400;
        return NextResponse.json({ error: result.error }, { status });
      }
    } else {
      console.error("register_staff_account RPC error:", error);
    }

    // 2) Fallback: service-role create
    const admin = getServiceSupabase();
    if (!admin) {
      return NextResponse.json(
        {
          error:
            "Unable to create account for this email yet. Sign in as an existing admin once so allowlisted emails sync, then try again — or ask the owner to add your email under Staff access in the CRM.",
          code: "ALLOWLIST_SYNC_REQUIRED",
        },
        { status: 400 }
      );
    }

    const created = await admin.auth.admin.createUser({
      email,
      password: parsed.data.password,
      email_confirm: true,
      user_metadata: {
        full_name: parsed.data.full_name || "",
        role: "staff",
      },
    });

    if (created.error) {
      const msg = created.error.message || "Unable to create account";
      const status = /already|registered|exists/i.test(msg) ? 409 : 400;
      return NextResponse.json({ error: msg }, { status });
    }

    // Keep DB allowlist in sync for future RPC path
    await admin.from("staff_allowlist").upsert({ email });

    return NextResponse.json({
      success: true,
      user: { id: created.data.user?.id, email: created.data.user?.email },
      message: "Account created. You can sign in now.",
    });
  } catch (err) {
    console.error("Admin register error:", err);
    return NextResponse.json({ error: "Unable to create account." }, { status: 500 });
  }
}
