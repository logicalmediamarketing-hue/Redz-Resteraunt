#!/usr/bin/env node
/**
 * Point redzrestaurant.com DNS at Vercel.
 *
 * Usage:
 *   GODADDY_API_KEY=... GODADDY_API_SECRET=... node tools/godaddy-point-to-vercel.mjs
 *
 * Create keys at: https://developer.godaddy.com/keys (Production, not OTE)
 */

const key = process.env.GODADDY_API_KEY;
const secret = process.env.GODADDY_API_SECRET;
const domain = process.env.DOMAIN || "redzrestaurant.com";

if (!key || !secret) {
  console.error("Set GODADDY_API_KEY and GODADDY_API_SECRET first.");
  process.exit(1);
}

const auth = `sso-key ${key}:${secret}`;
const base = `https://api.godaddy.com/v1/domains/${domain}`;

async function req(method, path, body) {
  const res = await fetch(`${base}${path}`, {
    method,
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }
  if (!res.ok) {
    throw new Error(`${method} ${path} -> ${res.status} ${typeof data === "string" ? data : JSON.stringify(data)}`);
  }
  return data;
}

async function main() {
  console.log(`Updating DNS for ${domain} -> Vercel 76.76.21.21`);

  // Replace apex A records
  await req("PUT", "/records/A/@", [
    { data: "76.76.21.21", ttl: 600 },
  ]);
  console.log("Set A @ -> 76.76.21.21");

  // www: prefer A to Vercel (matches Vercel recommendation for this domain)
  try {
    await req("PUT", "/records/A/www", [
      { data: "76.76.21.21", ttl: 600 },
    ]);
    console.log("Set A www -> 76.76.21.21");
  } catch (e) {
    console.warn("A www failed, trying CNAME:", e.message);
    await req("PUT", "/records/CNAME/www", [
      { data: "cname.vercel-dns.com", ttl: 600 },
    ]);
    console.log("Set CNAME www -> cname.vercel-dns.com");
  }

  // Remove conflicting apex CNAME if any (ignore errors)
  try {
    await req("PUT", "/records/CNAME/@", []);
  } catch {
    /* ignore */
  }

  const records = await req("GET", "/records");
  const relevant = (records || []).filter(
    (r) =>
      (r.type === "A" || r.type === "CNAME") &&
      (r.name === "@" || r.name === "www" || r.name === domain)
  );
  console.log("Current A/CNAME @/www:");
  for (const r of relevant) {
    console.log(`  ${r.type} ${r.name} -> ${r.data}`);
  }
  console.log("Done. Wait 5–30 minutes, then: curl -I https://redzrestaurant.com");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
