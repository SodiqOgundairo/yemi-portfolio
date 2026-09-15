import { createHash } from "node:crypto";
import type { IncomingMessage, ServerResponse } from "node:http";

/* Signs ONE Cloudinary upload, and only for a signed-in owner.
 *
 * The whole reason this endpoint exists is that the API secret must never
 * reach the bundle. An unsigned upload preset would have been simpler, but the
 * preset name ships in public JS and anyone reading it could then write to the
 * account. Signing server-side keeps the account closed.
 *
 * A signing endpoint with no auth is exactly as open as the preset it replaced,
 * so the owner check below is not optional decoration. It reuses the SAME
 * `is_owner` RPC the client and RLS already use, rather than keeping a second
 * copy of the allowlist that can drift. */

type Req = IncomingMessage & { body?: unknown };

/** Everything this endpoint will ever sign lives under one prefix, chosen
 *  HERE rather than taken from the caller. A caller-supplied folder would let
 *  an owner (or a stolen token) scatter writes across the whole account. */
const ROOT = "bigyems-portfolio";

const env = (...names: string[]) => {
  for (const n of names) {
    const v = process.env[n];
    if (v) return v;
  }
  return undefined;
};

async function readJson(req: Req): Promise<Record<string, unknown>> {
  // Vercel's Node runtime usually parses the body and consumes the stream, so
  // check that first: re-reading a consumed stream yields nothing.
  if (req.body && typeof req.body === "object") return req.body as Record<string, unknown>;
  if (typeof req.body === "string") {
    try { return JSON.parse(req.body) as Record<string, unknown>; } catch { return {}; }
  }
  const chunks: Buffer[] = [];
  for await (const c of req) chunks.push(c as Buffer);
  const raw = Buffer.concat(chunks).toString("utf8");
  if (!raw) return {};
  try { return JSON.parse(raw) as Record<string, unknown>; } catch { return {}; }
}

/** Cloudinary's scheme: the params to sign, sorted by key, joined `k=v` with
 *  `&`, then the API secret appended, then SHA-1. `file`, `api_key`,
 *  `cloud_name` and `resource_type` are excluded by Cloudinary's own rules. */
export function sign(params: Record<string, string | number>, secret: string) {
  const base = Object.keys(params)
    .sort()
    .map((k) => `${k}=${params[k]}`)
    .join("&");
  return createHash("sha1").update(base + secret).digest("hex");
}

/** A public_id becomes part of a URL and of a storage path, so it is rebuilt
 *  from a safe alphabet rather than trusted. Rejecting would be ruder than
 *  normalising, and the caller does not choose anything that matters. */
function safeSlug(raw: unknown, fallback: string) {
  const s = String(raw ?? "").toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "");
  return s.slice(0, 60) || fallback;
}

async function isOwner(token: string, supabaseUrl: string, anonKey: string) {
  const r = await fetch(`${supabaseUrl}/rest/v1/rpc/is_owner`, {
    method: "POST",
    headers: {
      apikey: anonKey,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Content-Profile": "bigyems_portfolio",
      "Accept-Profile": "bigyems_portfolio",
    },
    body: "{}",
  });
  if (!r.ok) return false;
  return (await r.json()) === true;
}

export default async function handler(req: Req, res: ServerResponse) {
  const send = (code: number, body: unknown) => {
    res.statusCode = code;
    res.setHeader("Content-Type", "application/json");
    // A signature is single use and caller specific: never let it be cached.
    res.setHeader("Cache-Control", "no-store");
    res.end(JSON.stringify(body));
  };

  if (req.method !== "POST") return send(405, { error: "POST only" });

  const supabaseUrl = env("SUPABASE_URL", "VITE_SUPABASE_URL");
  const anonKey = env("SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY");
  const cloudName = env("CLOUDINARY_CLOUD_NAME", "VITE_CLOUDINARY_CLOUD_NAME");
  const apiKey = env("CLOUDINARY_API_KEY");
  const apiSecret = env("CLOUDINARY_API_SECRET");

  /* Names the missing piece rather than failing as a generic 500. Getting this
     wrong is the single most likely reason this endpoint does not work on a
     fresh deploy, and a vague error costs an hour. */
  const missing = [
    !supabaseUrl && "SUPABASE_URL",
    !anonKey && "SUPABASE_ANON_KEY",
    !cloudName && "CLOUDINARY_CLOUD_NAME",
    !apiKey && "CLOUDINARY_API_KEY",
    !apiSecret && "CLOUDINARY_API_SECRET",
  ].filter(Boolean);
  if (missing.length) {
    return send(500, { error: `Server is missing: ${missing.join(", ")}. Set them on the host.` });
  }

  const auth = req.headers.authorization ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : "";
  if (!token) return send(401, { error: "Sign in first." });

  if (!(await isOwner(token, supabaseUrl!, anonKey!))) {
    return send(403, { error: "Not on the owner allowlist." });
  }

  const body = await readJson(req);
  const slug = safeSlug(body.slug, "misc");
  const name = safeSlug(body.name, String(Date.now()));

  const params = {
    folder: `${ROOT}/${slug}`,
    public_id: `${name}-${Date.now()}`,
    timestamp: Math.floor(Date.now() / 1000),
  };

  return send(200, {
    ...params,
    signature: sign(params, apiSecret!),
    apiKey,
    cloudName,
  });
}
