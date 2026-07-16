/** Comma-separated staff emails allowed into /admin (NEXT_PUBLIC_ADMIN_EMAILS). */
export function getAdminEmails(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** If the allowlist is empty, any authenticated Supabase user may access CRM. */
export function isAdminEmail(email: string | undefined | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase();
  // Laurel Lodging staff domain can always access / create accounts
  if (normalized.endsWith("@laurellodging.com")) return true;
  const allow = getAdminEmails();
  if (allow.length === 0) return true;
  return allow.includes(normalized);
}

/** Upsert env allowlist into staff_allowlist so signup works without invite codes. */
export async function syncStaffAllowlist(
  upsert: (rows: { email: string }[]) => PromiseLike<{ error: { message: string } | null }>
): Promise<void> {
  const emails = getAdminEmails();
  if (emails.length === 0) return;
  const { error } = await upsert(emails.map((email) => ({ email })));
  if (error) {
    console.error("staff_allowlist sync failed:", error.message);
  }
}
