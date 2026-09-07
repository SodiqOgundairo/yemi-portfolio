import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!url || !key) {
  // fail loudly in dev rather than silently rendering an empty portfolio
  console.error("Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env.local.");
}

/** Everything portfolio-related lives in its own schema inside the shared
 *  Gr8QM project, so the client is pinned to it. Without this the SDK talks
 *  to `public` and finds nothing. */
/* Session isolation from Gr8QM.
 *
 * localStorage is partitioned by ORIGIN, so portfolio.gr8qm.com and
 * www.gr8qm.com already get separate stores and a Gr8QM session cannot appear
 * here. The subtlety is that BOTH apps point at the same Supabase project, so
 * they default to the SAME storage key (`sb-<ref>-auth-token`). Same key +
 * same origin (a path-based deploy, a preview URL, a future consolidation)
 * would mean one app silently adopting or clobbering the other's session.
 * A distinct key removes that class of accident entirely.
 *
 * Gr8QM uses plain createClient with localStorage and no cookies, so there is
 * no `.gr8qm.com`-scoped cookie to leak across subdomains. If it ever moves to
 * @supabase/ssr with cookie auth, revisit this: cookies DO cross subdomains. */
export const AUTH_STORAGE_KEY = "bigyems-portfolio-auth";

export const supabase = createClient(url, key, {
  db: { schema: "bigyems_portfolio" },
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: "pkce",
    storageKey: AUTH_STORAGE_KEY,
    storage: typeof window === "undefined" ? undefined : window.localStorage,
  },
});

export const BUCKET = "bigyems-portfolio";

/** True only for emails on the bigyems_portfolio.owners allowlist.
 *  Auth is SHARED with the live Gr8QM site (10 users), so we cannot block
 *  sign-in at the auth layer without breaking their registrations. The gate
 *  therefore lives in the app, backed by the same check RLS enforces. */
export async function isOwner() {
  const { data, error } = await supabase.rpc("is_owner");
  if (error) return false;
  return data === true;
}

export type Discipline = "product" | "graphics" | "engineering";

export type Project = {
  id: string;
  slug: string;
  title: string;
  discipline: Discipline;
  role: string | null;
  summary: string | null;
  body: string | null;
  stack: string[];
  metrics: Record<string, number | string>;
  live_url: string | null;
  repo_url: string | null;
  cover_url: string | null;
  year: number | null;
  featured: boolean;
  sort: number;
  published: boolean;
};

export async function listProjects(opts: { publishedOnly?: boolean } = {}) {
  let q = supabase.from("projects").select("*").order("sort", { ascending: true });
  if (opts.publishedOnly) q = q.eq("published", true);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as Project[];
}

export async function upsertProject(p: Partial<Project>) {
  const { data, error } = await supabase
    .from("projects")
    .upsert({ ...p, updated_at: new Date().toISOString() }, { onConflict: "slug" })
    .select()
    .single();
  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) throw error;
}

/** Uploads to the public bucket and returns the public URL. */
export async function uploadImage(file: File, slug: string) {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${slug}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;
  return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}
