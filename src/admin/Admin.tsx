import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { Button } from "devign";
import {
  supabase, listProjects, upsertProject, deleteProject, uploadImage, isOwner, setPublished,
  listAbout, upsertAbout, deleteAbout, setAboutPublished,
  DISCIPLINES, DISCIPLINE_LABEL, ABOUT_KINDS, ABOUT_LABEL,
  type Project, type About, type AboutKind,
} from "../lib/supabase";
import { HEADLINE_CLAIM, spell, countCountries } from "../lib/claims";

const BLANK: Partial<Project> = {
  slug: "", title: "", discipline: "product", disciplines: ["product"], role: "", summary: "", body: "",
  stack: [], metrics: {}, live_url: "", repo_url: "", cover_url: "",
  year: new Date().getFullYear(), featured: false, sort: 0, published: false,
};

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
          {/* A project can sit on more than one shelf. The FIRST one ticked
              is the primary, which is what a case study page labels itself
              with; the rest decide which desktops list it. */}
          <Field label="Disciplines" hint="tick every one that applies. First is primary.">
            <div className="flex flex-col gap-2 pt-1">
              {DISCIPLINES.map((d) => {
                const on = (p.disciplines ?? [p.discipline]).includes(d);
                return (
                  <button key={d} type="button"
                    onClick={() => {
                      const cur = p.disciplines ?? (p.discipline ? [p.discipline] : []);
                      const next = on ? cur.filter((x) => x !== d) : [...cur, d];
                      if (!next.length) return;   // never leave a project unfiled
                      setP((s2) => ({ ...s2, disciplines: next, discipline: next[0] }));
                    }}
                    className="flex items-center gap-3 text-left">
                    <span className={`h-4 w-4 shrink-0 border transition-colors ${on ? "border-bone bg-bone" : "border-edge"}`} />
                    <span className={`text-sm ${on ? "text-bone" : "text-ghost"}`}>
                      {DISCIPLINE_LABEL[d]}
                      {on && (p.disciplines ?? [])[0] === d && <span className="hud ml-2">primary</span>}
                    </span>
                  </button>
                );
              })}
            </div>
          </Field>
          <Field label="Your role">
            <input className={inputCls} value={p.role ?? ""} placeholder="Lead engineer"
              onChange={(e) => set("role", e.target.value)} />
          </Field>
        </div>
      </Section>

      <Section title="Story">
        <div className="space-y-7">
          <Field label="Summary" hint="one line, under 120 characters">
            <input className={inputCls} maxLength={160} value={p.summary ?? ""}
              onChange={(e) => set("summary", e.target.value)} />
          </Field>
          <Field
            label="Case study"
            hint="## heading, - bullet, **bold**. 400 words or more reads as a case study, less as a brief."
          >
            <textarea className={inputCls + " min-h-44 resize-y leading-relaxed"} value={p.body ?? ""}
              onChange={(e) => set("body", e.target.value)} />
          </Field>
          {/* Whether a project opens a page is DERIVED from this field, never
              toggled. That is why a page can never exist and be empty. */}
          <p className="hud">
            {(p.body ?? "").trim()
              ? `Opens a page · ${(p.body ?? "").trim().split(/\s+/).length} words`
              : "No page · listed on the landing index as a credit only"}
          </p>
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
        {/* No Year field: years are not shown anywhere on the site. The
            column and its existing values are retained in the database. */}
        <div className="grid gap-7 sm:grid-cols-3">
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

/* ── the person ──────────────────────────────────────────────────────────
   `about` is one table behind five different shapes, so a column means
   something different per kind: `subtitle` is the PROMINENT line for a job
   and a qualification, while `title` is the employer or school behind it.
   Labelling the inputs "subtitle" and "title" would guarantee they get
   filled in backwards, so every field is named for what it becomes on
   screen, and each kind is told where it shows up. */
type AboutShape = {
  where: string;
  fields: { key: "subtitle" | "title" | "meta" | "period"; label: string; hint?: string }[];
  items?: { label: string; noun: string; hint: string };
};

const ABOUT_SHAPE: Record<AboutKind, AboutShape> = {
  summary: {
    where: "The About section on the landing page, and the Summary window in every desktop.",
    fields: [{ key: "title", label: "Internal label", hint: "never shown; just names the row here" }],
    items: { label: "Paragraphs", noun: "paragraphs", hint: "one per line. The landing page shows the first two." },
  },
  experience: {
    where: "The About section on the landing page, and the Experience window in every desktop.",
    fields: [
      { key: "subtitle", label: "Role", hint: "the bold line" },
      { key: "title", label: "Company" },
      { key: "meta", label: "Location", hint: "shown after the company" },
      { key: "period", label: "Dates", hint: "a month and year, or a range" },
    ],
    items: { label: "What you did", noun: "bullets", hint: "one per line" },
  },
  education: {
    where: "The Education window in every desktop.",
    fields: [
      { key: "subtitle", label: "Qualification", hint: "the bold line" },
      { key: "title", label: "Institution" },
      { key: "meta", label: "Location", hint: "optional" },
      { key: "period", label: "Year" },
    ],
  },
  teaching: {
    where: "Under Education in every desktop.",
    fields: [{ key: "title", label: "Heading", hint: "shown above the list" }],
    items: { label: "Bullets", noun: "bullets", hint: "one per line" },
  },
  skills: {
    where: "The Skills window in every desktop.",
    fields: [{ key: "title", label: "Group name", hint: "Design, Front-end, Tools" }],
    items: { label: "Skills", noun: "skills", hint: "one per line. Each becomes a chip." },
  },
};

/** Exactly what the panes compose, so the editor can show the row the way a
 *  visitor will read it. Two lines of duplication is the cheaper trade than
 *  importing the shells' render tree into the admin. */
function itemNoun(r: About) {
  const n = ABOUT_SHAPE[r.kind].items?.noun ?? "lines";
  return r.items.length === 1 ? n.replace(/s$/, "") : n;
}

function aboutPreview(r: Partial<About>) {
  const k = r.kind ?? "summary";
  if (k === "experience" || k === "education") {
    const lead = (r.subtitle ?? "").trim();
    const under = [r.title, r.meta].map((x) => (x ?? "").trim()).filter(Boolean)
      .join(k === "experience" ? " · " : ", ");
    return [lead, under, (r.period ?? "").trim()].filter(Boolean);
  }
  return [(r.title ?? "").trim()].filter(Boolean);
}

const BLANK_ABOUT: Partial<About> = {
  kind: "experience", title: "", subtitle: "", meta: "", period: "",
  items: [], sort: 0, published: true,
};

function AboutEditor({ value, onSaved, onCancel }: {
  value: Partial<About>; onSaved: () => void; onCancel: () => void;
}) {
  const [r, setR] = useState<Partial<About>>(value);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const set = <K extends keyof About>(k: K, v: About[K]) => setR((s) => ({ ...s, [k]: v }));
  const shape = ABOUT_SHAPE[r.kind ?? "experience"];
  const preview = aboutPreview(r);

  async function save(e: FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    /* Cleaned here rather than on keystroke, so pressing Enter twice while
       drafting still works. Empty strings become null: the panes test these
       for truthiness to decide whether to render a separator at all, and ""
       would print a stray middot. */
    const blank = (v: string | null | undefined) => (v ?? "").trim() || null;
    const payload: Partial<About> = {
      ...r,
      title: (r.title ?? "").trim(),
      subtitle: blank(r.subtitle),
      meta: blank(r.meta),
      period: blank(r.period),
      items: (r.items ?? []).map((x) => x.trim()).filter(Boolean),
    };
    try { await upsertAbout(payload); onSaved(); }
    catch (e2) { setErr((e2 as Error).message); } finally { setBusy(false); }
  }

  return (
    <form onSubmit={save} className="border-t border-edge">
      <Section title="Placement">
        <div className="grid gap-7 sm:grid-cols-2">
          <Field label="Kind" hint="decides which fields matter and where it appears">
            {/* Changing kind keeps whatever is typed. Nothing is cleared for
                you: a mistyped kind should be a one-click undo, not a retype. */}
            <select className={inputCls + " appearance-none"} value={r.kind ?? "experience"}
              onChange={(e) => set("kind", e.target.value as AboutKind)}>
              {ABOUT_KINDS.map((k) => (
                <option key={k} value={k} className="bg-ash">{ABOUT_LABEL[k]}</option>
              ))}
            </select>
          </Field>
          <Field label="Sort" hint="low first. Existing rows step in tens.">
            <input type="number" className={inputCls} value={r.sort ?? 0}
              onChange={(e) => set("sort", Number(e.target.value))} />
          </Field>
        </div>
        <p className="hud pt-6">{shape.where}</p>
      </Section>

      <Section title="Fields">
        <div className="grid gap-7 sm:grid-cols-2">
          {shape.fields.map((f) => (
            <Field key={f.key} label={f.label} hint={f.hint}>
              <input className={inputCls} value={(r[f.key] ?? "") as string}
                required={f.key === "title"}
                onChange={(e) => set(f.key, e.target.value)} />
            </Field>
          ))}
        </div>
        {!!preview.length && (
          <div className="mt-8 border-l border-edge pl-5">
            <p className="hud pb-2">Reads as</p>
            <p className="text-[15px] text-bone">{preview[0]}</p>
            {preview[1] && <p className="pt-[3px] text-sm text-ghost">{preview[1]}</p>}
            {preview[2] && <p className="hud pt-1.5">{preview[2]}</p>}
          </div>
        )}
      </Section>

      {shape.items && (
        <Section title="Content">
          <Field label={shape.items.label} hint={shape.items.hint}>
            <textarea className={inputCls + " min-h-36 resize-y leading-relaxed"}
              value={(r.items ?? []).join("\n")}
              onChange={(e) => set("items", e.target.value.split("\n"))} />
          </Field>
          {/* Blank lines are stripped on save, not on keystroke: stripping as
              you type makes it impossible to press Enter twice. */}
          <p className="hud pt-4">
            {(r.items ?? []).filter((x) => x.trim()).length} {shape.items.noun}
          </p>
        </Section>
      )}

      <Section title="Publishing">
        <button type="button" onClick={() => set("published", !r.published)}
          className="flex items-center gap-3 text-left">
          <span className={`h-4 w-4 border transition-colors ${r.published ? "border-bone bg-bone" : "border-edge"}`} />
          <span className={`text-sm ${r.published ? "text-bone" : "text-ghost"}`}>
            {r.published ? "Published" : "Hidden"}
          </span>
        </button>
      </Section>

      {err && <p className="pb-4 text-sm text-red-400">{err}</p>}

      <div className="flex items-center gap-3 border-t border-edge py-7">
        <Button type="submit" isLoading={busy} className={`rounded-none ${BTN.solid}`}>Save</Button>
        <Button type="button" onClick={onCancel} className={`rounded-none ${BTN.quiet}`}>Cancel</Button>
      </div>
    </form>
  );
}

function AboutList({ rows, onEdit, onChanged, onError }: {
  rows: About[]; onEdit: (r: About) => void; onChanged: () => void; onError: (m: string) => void;
}) {
  const live = rows.filter((r) => r.published);
  /* The landing headline is hand-written copy, not derived, so it can go
     stale the moment a role or a country is added here. Surfacing the two
     numbers it asserts makes that impossible to miss. */
  const countries = countCountries(
    rows.filter((r) => r.kind === "experience" && r.published).map((r) => r.meta),
  );
  const roles = live.filter((r) => r.kind === "experience").length;

  return (
    <>
      <h1 className="display pt-12 text-4xl">About</h1>
      <p className="mb-3 mt-3 text-[15px] text-ghost">
        {rows.length} {rows.length === 1 ? "entry" : "entries"} · {live.length} live. Feeds the
        landing page and all three desktops.
      </p>
      <p className="hud mb-10 leading-relaxed">
        Landing headline claims {spell(HEADLINE_CLAIM.countries).toLowerCase()} countries and{" "}
        {spell(HEADLINE_CLAIM.teams).toLowerCase()} teams. Live data: {countries}{" "}
        {countries === 1 ? "country" : "countries"}, {roles} {roles === 1 ? "role" : "roles"}.
        {(countries !== HEADLINE_CLAIM.countries || roles !== HEADLINE_CLAIM.teams) && (
          <span className="text-red-400"> Update HEADLINE_CLAIM in src/lib/claims.ts.</span>
        )}
      </p>

      {ABOUT_KINDS.map((k) => {
        const group = rows.filter((r) => r.kind === k);
        if (!group.length) return null;
        return (
          <section key={k} className="pb-10">
            <div className="mb-4 flex items-center gap-4">
              <span className="hud whitespace-nowrap">{ABOUT_LABEL[k]}</span>
              <span className="h-px flex-1 bg-edge" />
            </div>
            <ul className="border-t border-edge">
              {group.map((r) => {
                const [lead, under] = aboutPreview(r);
                return (
                  <li key={r.id} className="group flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-edge py-3.5">
                    <span className="hud w-7 shrink-0 tabular-nums">{r.sort}</span>
                    {/* A phone squeezed this to "Product ..." because the
                        status pill and the actions take a fixed width. A
                        minimum width makes the row wrap instead. */}
                    <div className="min-w-[11rem] flex-1">
                      <p className="text-[15px] leading-snug text-bone">{lead || r.title}</p>
                      <p className="hud pt-1">
                        {under || `${r.items.length} ${itemNoun(r)}`}
                        {r.period ? ` · ${r.period}` : ""}
                      </p>
                    </div>
                    <button type="button"
                      title={r.published ? "Live. Click to hide." : "Hidden. Click to publish."}
                      onClick={async () => {
                        try { await setAboutPublished(r.id, !r.published); onChanged(); }
                        catch (e) { onError((e as Error).message); }
                      }}
                      className="flex items-center gap-2 px-2 py-1 transition-colors hover:text-bone">
                      <span className={`h-1.5 w-1.5 rounded-full ${r.published ? "bg-bone" : "bg-faint"}`} />
                      <span className="hud">{r.published ? "live" : "hidden"}</span>
                    </button>
                    <span className="flex gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <Button size="sm" onClick={() => onEdit(r)} className={`rounded-none ${BTN.quiet}`}>Edit</Button>
                      <Button size="sm" className={`rounded-none ${BTN.danger}`}
                        onClick={async () => {
                          if (!confirm(`Delete “${lead || r.title}”?`)) return;
                          try { await deleteAbout(r.id); onChanged(); }
                          catch (e) { onError((e as Error).message); }
                        }}>Delete</Button>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </>
  );
}

/* ── shell ───────────────────────────────────────────────────────────────── */
type Tab = "work" | "about";

export default function Admin() {
  const [authed, setAuthed] = useState<boolean | null>(null);
  const [owner, setOwner] = useState<boolean | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [tab, setTab] = useState<Tab>("work");
  const [rows, setRows] = useState<Project[]>([]);
  const [about, setAbout] = useState<About[]>([]);
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [editingAbout, setEditingAbout] = useState<Partial<About> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const fail = (e: unknown) => setErr((e as Error).message);
  /* The error handler is inlined in these two rather than reusing `fail`.
     exhaustive-deps proves a component function stable only when every free
     variable it touches is itself stable, and it does not recurse: routing
     through `fail` makes both loaders look unstable and puts a spurious
     warning on the effect below. */
  const refresh = () => listProjects().then(setRows).catch((e) => setErr((e as Error).message));
  const refreshAbout = () => listAbout().then(setAbout).catch((e) => setErr((e as Error).message));

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
  /* Both tables load once, not per tab: two small reads buy accurate counts
     on the tab you are not looking at, and no spinner when you switch. */
  useEffect(() => { if (authed && owner) { refresh(); refreshAbout(); } }, [authed, owner]);

  /* Switching tabs closes any open editor. Leaving a half-typed project open
     behind the About tab is how you lose work you thought was saved. */
  function go(t: Tab) {
    setTab(t); setEditing(null); setEditingAbout(null); setErr(null);
  }
  function addNew() {
    if (tab === "work") setEditing({ ...BLANK });
    else setEditingAbout({ ...BLANK_ABOUT });
  }

  if (authed === null || (authed && owner === null))
    return <div className="grid min-h-[100svh] place-items-center"><span className="hud">Checking session</span></div>;
  if (!authed) return <SignIn />;
  if (!owner) return <NotAuthorised email={email} />;

  const editingAnything = tab === "work" ? !!editing : !!editingAbout;

  return (
    <div className="min-h-[100svh]">
      <header className="sticky top-0 z-10 border-b border-edge bg-void/85 backdrop-blur">
        <div className="mx-auto flex max-w-3xl items-center gap-4 px-6 py-4">
          <span className="grid h-7 w-7 place-items-center border border-edge text-[11px] font-mono text-ghost">Y</span>
          <nav className="flex items-center gap-1">
            {(["work", "about"] as const).map((t) => (
              <button key={t} type="button" onClick={() => go(t)}
                aria-current={tab === t ? "page" : undefined}
                className={`hud px-2 py-1 transition-colors ${tab === t ? "text-bone" : "hover:text-ghost"}`}>
                {t === "work" ? "Work" : "About"}
                <span className={`mt-1 block h-px transition-colors ${tab === t ? "bg-bone" : "bg-transparent"}`} />
              </button>
            ))}
          </nav>
          <span className="flex-1" />
          {email && <span className="hidden text-xs text-faint sm:inline">{email}</span>}
          {!editingAnything && (
            <Button size="sm" onClick={addNew} className={`rounded-none ${BTN.solid}`}>New</Button>
          )}
          <Button size="sm" onClick={() => supabase.auth.signOut()} className={`rounded-none ${BTN.line}`}>Sign out</Button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24">
        {err && <p className="pt-6 text-sm text-red-400">{err}</p>}

        {tab === "work" ? (
          editing ? (
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
                      <p className="hud truncate pt-1">{DISCIPLINE_LABEL[r.discipline]} · {r.role || "—"}</p>
                    </div>
                    {/* The status IS the switch. It was previously readable
                        here but only changeable inside the editor form, which
                        made unpublishing look impossible. */}
                    <button
                      type="button"
                      title={r.published ? "Published. Click to unpublish." : "Draft. Click to publish."}
                      onClick={async () => {
                        try { await setPublished(r.id, !r.published); refresh(); }
                        catch (e) { fail(e); }
                      }}
                      className="flex items-center gap-2 px-2 py-1 transition-colors hover:text-bone"
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${r.published ? "bg-bone" : "bg-faint"}`} />
                      <span className="hud">{r.published ? "live" : "draft"}</span>
                    </button>
                    <span className="flex gap-1 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                      <Button size="sm" onClick={() => setEditing(r)} className={`rounded-none ${BTN.quiet}`}>Edit</Button>
                      <Button size="sm" className={`rounded-none ${BTN.danger}`}
                        onClick={async () => {
                          if (!confirm(`Delete “${r.title}”?`)) return;
                          try { await deleteProject(r.id); refresh(); } catch (e) { fail(e); }
                        }}>Delete</Button>
                    </span>
                  </li>
                ))}
                {!rows.length && (
                  <li className="py-16 text-center">
                    <p className="hud">Nothing here yet</p>
                    <Button size="sm" onClick={addNew} className={`mt-5 rounded-none ${BTN.solid}`}>Add the first project</Button>
                  </li>
                )}
              </ul>
            </>
          )
        ) : editingAbout ? (
          <>
            <h1 className="display pt-12 text-4xl">
              {editingAbout.id ? "Edit entry" : "New entry"}
            </h1>
            <p className="mb-8 mt-3 text-[15px] text-ghost">
              {editingAbout.id
                ? aboutPreview(editingAbout)[0] || editingAbout.title
                : "This appears on the landing page and inside the desktops."}
            </p>
            <AboutEditor value={editingAbout}
              onSaved={() => { setEditingAbout(null); refreshAbout(); }}
              onCancel={() => setEditingAbout(null)} />
          </>
        ) : about.length ? (
          <AboutList rows={about} onEdit={setEditingAbout} onChanged={refreshAbout} onError={setErr} />
        ) : (
          <>
            <h1 className="display pt-12 text-4xl">About</h1>
            <ul className="mt-10 border-t border-edge">
              <li className="py-16 text-center">
                <p className="hud">Nothing here yet</p>
                <Button size="sm" onClick={addNew} className={`mt-5 rounded-none ${BTN.solid}`}>Add the first entry</Button>
              </li>
            </ul>
          </>
        )}
      </main>
    </div>
  );
}
