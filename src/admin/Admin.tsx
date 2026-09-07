import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "devign";
import {
  supabase, listProjects, upsertProject, deleteProject, uploadImage, isOwner,
  type Project, type Discipline,
} from "../lib/supabase";

const BLANK: Partial<Project> = {
  slug: "", title: "", discipline: "product", role: "", summary: "", body: "",
  stack: [], metrics: {}, live_url: "", repo_url: "", cover_url: "",
  year: new Date().getFullYear(), featured: false, sort: 0, published: false,
};
const DISCIPLINES: Discipline[] = ["product", "graphics", "engineering"];

/* Devign's stock variants are branded (purple primary). Override to the site's
   monochrome so the admin reads as the same product as the landing page. */
const BTN = {
  solid: "bg-bone text-void hover:bg-white",
  line: "border border-edge bg-transparent text-ghost hover:border-bone hover:text-bone",
  quiet: "bg-transparent text-ghost hover:text-bone",
  danger: "bg-transparent text-faint hover:text-red-400",
};

/* ── shared field chrome: one input language, matching the site ───────────── */
const inputCls =
  "w-full bg-transparent border-b border-edge px-0 py-2.5 text-[15px] text-bone " +
  "placeholder:text-faint outline-none transition-colors focus:border-bone";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="hud block pb-1.5">
        {label}{hint && <span className="ml-2 normal-case tracking-normal text-faint">{hint}</span>}
      </span>
      {children}
    </label>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="py-8">
      <div className="mb-6 flex items-center gap-4">
        <span className="hud whitespace-nowrap">{title}</span>
        <span className="h-px flex-1 bg-edge" />
      </div>
      {children}
    </section>
  );
}

/* ── sign in ─────────────────────────────────────────────────────────────── */
function SignIn() {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function google() {
    setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin` },
    });
    if (error) { setErr(error.message); setBusy(false); }
  }

  return (
    <main className="relative flex min-h-[100svh] items-center justify-center px-6">
      {/* the same faint engineering grid the site uses, so this feels like the same product */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.03) 1px, transparent 1px)," +
            "linear-gradient(90deg, rgba(255,255,255,.03) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }} />
      <div className="relative w-full max-w-[380px]">
        <div className="mb-10 flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center border border-edge text-[11px] font-mono text-ghost">Y</span>
          <span className="hud">Restricted</span>
        </div>
        <h1 className="display text-[2.75rem] leading-[1.02]">Portfolio<br />admin</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ghost">
          Sign in to add and edit work. Writes are limited to the owner allowlist.
        </p>
        <div className="mt-9">
          <Button onClick={google} isLoading={busy} size="lg" className={`w-full justify-center rounded-none ${BTN.solid}`}>
            Continue with Google
          </Button>
        </div>
        {err && <p className="mt-4 text-sm text-red-400">{err}</p>}
        <div className="mt-10 h-px bg-edge" />
        <p className="hud mt-4 leading-relaxed">
          Any other account can read published work but never save.
        </p>
      </div>
    </main>
  );
}

/* ── signed in, but not an owner ──────────────────────────────────────────
   Anyone with a Google account can complete sign-in, because auth is shared
   with the Gr8QM site. Say so plainly rather than letting them fill a form
   that will always fail on save. */
function NotAuthorised({ email }: { email: string | null }) {
  return (
    <main className="flex min-h-[100svh] items-center justify-center px-6">
      <div className="w-full max-w-[380px]">
        <div className="mb-10 flex items-center gap-3">
          <span className="grid h-7 w-7 place-items-center border border-edge text-[11px] font-mono text-ghost">Y</span>
          <span className="hud">Not authorised</span>
        </div>
        <h1 className="display text-[2.5rem] leading-[1.05]">Wrong<br />account</h1>
        <p className="mt-5 text-[15px] leading-relaxed text-ghost">
          {email ? <><span className="text-bone">{email}</span> is signed in, but it is not on the owner allowlist.</>
                 : "This account is not on the owner allowlist."}
        </p>
        <div className="mt-9">
          <Button onClick={() => supabase.auth.signOut()} size="lg"
            className="w-full justify-center rounded-none border border-edge bg-transparent text-ghost hover:border-bone hover:text-bone">
            Sign out and try another
          </Button>
        </div>
      </div>
    </main>
  );
}

/* ── editor ──────────────────────────────────────────────────────────────── */
function Editor({ value, onSaved, onCancel }: {
  value: Partial<Project>; onSaved: () => void; onCancel: () => void;
}) {
  const [p, setP] = useState<Partial<Project>>(value);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = <K extends keyof Project>(k: K, v: Project[K]) => setP((s) => ({ ...s, [k]: v }));

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    try { await upsertProject(p); onSaved(); }
    catch (e2) { setErr((e2 as Error).message); } finally { setBusy(false); }
  }
  async function pickImage(file: File) {
    if (!p.slug) { setErr("Add a slug first — the upload path uses it."); return; }
    setBusy(true); setErr(null);
    try { set("cover_url", await uploadImage(file, p.slug)); }
    catch (e2) { setErr((e2 as Error).message); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={save} className="border-t border-edge">
      <Section title="Identity">
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label="Slug" hint="url, unique">
            <input className={inputCls} value={p.slug ?? ""} placeholder="flock" required
              onChange={(e) => set("slug", e.target.value)} />
          </Field>
          <Field label="Title">
            <input className={inputCls} value={p.title ?? ""} placeholder="Flock ChMS" required
              onChange={(e) => set("title", e.target.value)} />
          </Field>
          <Field label="Discipline">
            <select className={inputCls + " appearance-none"} value={p.discipline}
              onChange={(e) => set("discipline", e.target.value as Discipline)}>
              {DISCIPLINES.map((d) => <option key={d} value={d} className="bg-ash">{d}</option>)}
            </select>
          </Field>
          <Field label="Your role">
            <input className={inputCls} value={p.role ?? ""} placeholder="Lead engineer"
              onChange={(e) => set("role", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Story">
        <div className="space-y-7">
          <Field label="Summary" hint="one line, shown on the card">
            <input className={inputCls} value={p.summary ?? ""}
              onChange={(e) => set("summary", e.target.value)} />
          </Field>
          <Field label="Case study" hint="markdown">
            <textarea className={inputCls + " min-h-44 resize-y leading-relaxed"} value={p.body ?? ""}
              onChange={(e) => set("body", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Details">
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label="Stack" hint="comma separated">
            <input className={inputCls} value={(p.stack ?? []).join(", ")} placeholder="React 19, Supabase"
              onChange={(e) => set("stack", e.target.value.split(",").map((x) => x.trim()).filter(Boolean))} />
          </Field>
          <Field label="Metrics" hint="JSON">
            <input className={inputCls} value={JSON.stringify(p.metrics ?? {})}
              onChange={(e) => { try { set("metrics", JSON.parse(e.target.value)); } catch { /* mid-type */ } }} />
          </Field>
          <Field label="Live URL">
            <input className={inputCls} value={p.live_url ?? ""} placeholder="https://"
              onChange={(e) => set("live_url", e.target.value)} />
          </Field>
          <Field label="Repo URL">
            <input className={inputCls} value={p.repo_url ?? ""} placeholder="https://"
              onChange={(e) => set("repo_url", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Cover">
        <div className="flex flex-wrap items-center gap-6">
          <div className="h-[92px] w-[147px] shrink-0 overflow-hidden border border-edge bg-ash">
            {p.cover_url
              ? <img src={p.cover_url} alt="" className="h-full w-full object-cover" />
              : <div className="grid h-full w-full place-items-center"><span className="hud">no image</span></div>}
          </div>
          <div className="min-w-[240px] flex-1 space-y-4">
            <label className="hud inline-flex cursor-pointer items-center gap-2 border border-edge px-4 py-2.5
                              transition-colors hover:border-ghost hover:text-bone">
              Upload image
              <input type="file" accept="image/*" className="hidden"
                onChange={(e) => e.target.files?.[0] && pickImage(e.target.files[0])} />
            </label>
            <input className={inputCls} value={p.cover_url ?? ""} placeholder="…or paste a URL"
              onChange={(e) => set("cover_url", e.target.value)} />
          </div>
        </div>
      </Section>

      <Section title="Publishing">
        <div className="grid gap-7 sm:grid-cols-4">
          <Field label="Year">
            <input type="number" className={inputCls} value={p.year ?? ""}
              onChange={(e) => set("year", Number(e.target.value))} />
          </Field>
          <Field label="Sort">
            <input type="number" className={inputCls} value={p.sort ?? 0}
              onChange={(e) => set("sort", Number(e.target.value))} />
          </Field>
          {([["featured", "Featured"], ["published", "Published"]] as const).map(([k, lbl]) => (
            <button key={k} type="button"
              onClick={() => set(k, !p[k] as never)}
              className="flex items-center gap-3 self-end pb-2 text-left">
              <span className={`h-4 w-4 border transition-colors ${p[k] ? "border-bone bg-bone" : "border-edge"}`} />
              <span className={`text-sm ${p[k] ? "text-bone" : "text-ghost"}`}>{lbl}</span>
            </button>
          ))}
        </div>
      </Section>

      {err && <p className="pb-4 text-sm text-red-400">{err}</p>}

      <div className="flex items-center gap-3 border-t border-edge py-7">
        <Button type="submit" isLoading={busy} className={`rounded-none ${BTN.solid}`}>Save project</Button>
        <Button type="button" onClick={onCancel} className={`rounded-none ${BTN.quiet}`}>Cancel</Button>
      </div>
    </form>
  );
}

/* ── shell ───────────────────────────────────────────────────────────────── */
export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [owner, setOwner] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [rows, setRows] = useState<Project[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const refresh = () => listProjects().then(setRows).catch((e) => setErr((e as Error).message));

  useEffect(() => {
    const apply = async (session: unknown, mail: string | null) => {
      setAuthed(!!session); setEmail(mail);
      setOwner(session ? await isOwner() : null);
    };
    supabase.auth.getSession().then(({ data }) =>
      apply(data.session, data.session?.user?.email ?? null));
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) =>
      apply(s, s?.user?.email ?? null));
    return () => sub.subscription.unsubscribe();
  }, []);
  useEffect(() => { if (authed && owner) refresh(); }, [authed, owner]);

  if (authed === null || (authed && owner === null))
    return <div className="grid min-h-[100svh] place-items-center"><span className="hud">Checking session</span></div>;
  if (!authed) return <SignIn />;
  if (!owner) return <NotAuthorised email={email} />;

  return (
    <div className="min-h-[100svh]">
      <header className="sticky top-0 z-10 border-b border-edge bg-void/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <span className="grid h-7 w-7 place-items-center border border-edge text-[11px] font-mono text-ghost">Y</span>
          <span className="hud">Portfolio admin</span>
          <span className="flex-1" />
          {email && <span className="hidden text-xs text-faint sm:inline">{email}</span>}
          <Button size="sm" onClick={() => setEditing({ ...BLANK })} className={`rounded-none ${BTN.solid}`}>New</Button>
          <Button size="sm" onClick={() => supabase.auth.signOut()} className={`rounded-none ${BTN.line}`}>Sign out</Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        {err && <p className="pt-6 text-sm text-red-400">{err}</p>}

        {editing ? (
          <>
            <h1 className="display pt-12 text-4xl">{editing.id ? "Edit project" : "New project"}</h1>
            <p className="mb-8 mt-3 text-[15px] text-ghost">
              {editing.id ? editing.title : "Drafts stay hidden until you tick Published."}
            </p>
            <Editor value={editing} onSaved={() => { setEditing(null); refresh(); }}
              onCancel={() => setEditing(null)} />
          </>
        ) : (
          <>
            <h1 className="display pt-12 text-4xl">Work</h1>
            <p className="mb-10 mt-3 text-[15px] text-ghost">
              {rows.length} {rows.length === 1 ? "project" : "projects"} ·{" "}
              {rows.filter((r) => r.published).length} live
            </p>

            <ul className="border-t border-edge">
              {rows.map((r) => (
                <li key={r.id} className="group flex items-center gap-5 border-b border-edge py-4">
                  <div className="h-11 w-[70px] shrink-0 overflow-hidden border border-edge bg-ash">
                    {r.cover_url && <img src={r.cover_url} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px] text-bone">{r.title}</p>
                    <p className="hud truncate pt-1">{r.discipline} · {r.role || "—"}</p>
                  </div>
                  <span className="flex items-center gap-2">
                    <span className={`h-1.5 w-1.5 rounded-full ${r.published ? "bg-bone" : "bg-faint"}`} />
                    <span className="hud">{r.published ? "live" : "draft"}</span>
                  </span>
                  <span className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <Button size="sm" onClick={() => setEditing(r)} className={`rounded-none ${BTN.quiet}`}>Edit</Button>
                    <Button size="sm" className={`rounded-none ${BTN.danger}`}
                      onClick={async () => {
                        if (!confirm(`Delete “${r.title}”?`)) return;
                        await deleteProject(r.id); refresh();
                      }}>Delete</Button>
                  </span>
                </li>
              ))}
              {!rows.length && (
                <li className="py-16 text-center">
                  <p className="hud">Nothing here yet</p>
                  <Button size="sm" onClick={() => setEditing({ ...BLANK })} className={`mt-5 rounded-none ${BTN.solid}`}>Add the first project</Button>
                </li>
              )}
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
