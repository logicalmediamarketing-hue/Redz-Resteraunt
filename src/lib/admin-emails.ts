/** Comma-separated staff emails allowed into /admin (NEXT_PUBLIC_ADMIN_EMAILS). */
export function getAdminEmails(): string[] {
  return (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** If the allowlist is empty, any authenticated Supabase user may access CRM. */
export function isAdminEmail(email: string | undefined | null): boolean {
  const allow = getAdminEmails();
  if (allow.length === 0) return !!email;
  return !!email && allow.includes(email.toLowerCase());
}
