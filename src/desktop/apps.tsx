import { useEffect, useMemo, useRef, useState } from "react";
import { supabase, DISCIPLINE_LABEL, KINDS, KIND_LABEL, KIND_FOLDER, type Project, type Discipline, type Kind } from "../lib/supabase";
import { hasPage, type Group } from "../lib/useProjects";
import { renderBody, disciplinesOf, readingLabel } from "../lib/markdown";
import { MacIcon } from "../mac/icons";
import { YaruIcon } from "../ubuntu/icons";
import { FluentIcon } from "../win/icons";
import { cldUrl } from "../lib/cloudinary";

const EMAIL = "ogundairosodiq954@gmail.com";

/* ── Finder ───────────────────────────────────────────────────────────────
   Real Finder behaviour, because half-behaviour is what makes these things
   feel like a costume: single click selects and fills the info strip,
   double click opens. A project with no case study simply does not open,
   which is the same rule the main site follows, and here it reads correctly
   as a greyed item rather than as a broken link. */
export type Shell = "mac" | "ubuntu" | "win";

export function Finder({
  groups, images, onOpen, onQuickLook, defaultScope = "all", shell = "mac",
}: {
  groups: Group[]; images: Record<string, number>;
  onOpen: (slug: string, title: string) => void;
  onQuickLook: (p: Project) => void;
  defaultScope?: Discipline | "all";
  shell?: Shell;
}) {
  const [scope, setScope] = useState<Discipline | "all">(defaultScope);
  /* Which folder is open, by id. Null means the top of the current discipline. */
  const [folder, setFolder] = useState<string | null>(null);
  /* Folders group the work; the flat list is faster to scan once you know what
     you are after. Both, because neither wins for every visitor. */
  const [view, setView] = useState<"folders" | "list">("folders");
  const [sel, setSel] = useState<Project | null>(null);
  const [touch, setTouch] = useState(false);
  useEffect(() => {
    setTouch(window.matchMedia("(hover: none), (pointer: coarse)").matches);
  }, []);

  /* Nautilus has NO preview pane. Its sidebar has no text section headings
     either: GNOME separates sections with a plain 1px rule. Finder and File
     Explorer both do have those things, so this is a per-shell difference
     rather than a shared layout. */
  const gnome = shell === "ubuntu";
  /* Each shell draws its own folder and document, down to the 16px glyphs in
     the sidebar. A shared blue folder inside a Windows Explorer was the last
     place one icon set was doing three jobs. */
  const Glyph = shell === "ubuntu" ? YaruIcon : shell === "win" ? FluentIcon : MacIcon;

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("input, textarea, [contenteditable]")) return;
      if (e.code === "Space" && sel) { e.preventDefault(); onQuickLook(sel); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [sel, onQuickLook]);

  const projects = useMemo(() => {
    if (scope !== "all") return groups.find((g) => g.discipline === scope)?.projects ?? [];
    /* Under All Work a project appears ONCE. Projects carry several
       disciplines, so summing the shelves listed Flock twice and counted 57
       of 38.
       Deduped BY ID, not by matching the primary discipline to the shelf.
       That earlier rule silently dropped any project whose primary was not in
       its own `disciplines` list: two rows were in exactly that state, so the
       sidebar advertised 38 while the list rendered 36. A count and a list
       disagreeing is worse than either being wrong, and no data state should
       be able to hide a project from the view that claims to show everything. */
    const seen = new Set<string>();
    return groups.flatMap((g) => g.projects).filter((p) => {
      if (seen.has(p.id)) return false;
      seen.add(p.id);
      return true;
    });
  }, [groups, scope]);

  /* Folders, in the order an OS would put them: the curated shelf first,
     then anything Yemi has named himself, then what things simply are.
     Featured and collections are SMART folders: a project appears in them
     AND in its kind folder, the same way a file can sit in a playlist and
     still live in its own directory. */
  const folders = useMemo(() => {
    const out: { id: string; label: string; projects: Project[] }[] = [];

    const starred = projects.filter((p) => p.featured);
    if (starred.length) out.push({ id: "featured", label: "Featured", projects: starred });

    const named = new Map<string, Project[]>();
    for (const p of projects) {
      const name = p.collection?.trim();
      if (!name) continue;
      named.set(name, [...(named.get(name) ?? []), p]);
    }
    for (const name of [...named.keys()].sort((x, y) => x.localeCompare(y))) {
      out.push({ id: `col:${name}`, label: name, projects: named.get(name)! });
    }

    const byKind = new Map<Kind, Project[]>();
    for (const p of projects) {
      if (!p.kind) continue;
      byKind.set(p.kind, [...(byKind.get(p.kind) ?? []), p]);
    }
    for (const k of KINDS) {
      if (byKind.has(k)) out.push({ id: `kind:${k}`, label: KIND_FOLDER[k], projects: byKind.get(k)! });
    }
    return out;
  }, [projects]);

  /* Anything no folder claims. A project with no kind and no collection sits
     loose beside the folders rather than vanishing, as a file browser does. */
  const loose = useMemo(
    () => projects.filter((p) => !p.kind && !p.collection?.trim() && !p.featured),
    [projects],
  );
  // leaving a discipline closes whatever folder was open inside it
  useEffect(() => { setFolder(null); setSel(null); }, [scope]);
  useEffect(() => { setSel(null); }, [view, folder]);

  const open = folder ? folders.find((f) => f.id === folder) : null;
  const rows = view === "list" ? projects : open ? open.projects : loose;
  const showFolders = view === "folders" && !open;
  const inView = rows.length + (showFolders ? folders.length : 0);

  const total = new Set(groups.flatMap((g) => g.projects.map((p) => p.id))).size;
  const nav: [Discipline | "all", string][] = [
    ["all", `All Work (${total})`],
    ...groups.map((g) => [g.discipline, `${DISCIPLINE_LABEL[g.discipline]} (${g.projects.length})`] as [Discipline, string]),
  ];
  const here = scope === "all" ? "All Work" : DISCIPLINE_LABEL[scope];

  const cell = gnome ? "px-1.5 py-[6px]" : "px-3 py-[6px]";
  const head = gnome ? "px-1.5 py-[3px] font-bold" : "px-3 py-1.5";
  const rowCls = (on: boolean) =>
    on
      ? gnome ? "bg-[var(--os-view-select)]" : "bg-[var(--os-accent)] text-white"
      : gnome ? "hover:bg-white/[0.04]" : "odd:bg-white/[0.02] hover:bg-white/[0.06]";

  return (
    <div className="flex h-full min-h-0 bg-[var(--os-bg)] text-[13px] text-[var(--os-text)]">
      <aside
        className={`hidden shrink-0 border-r border-[var(--os-line)] bg-[var(--os-panel)] sm:block ${
          gnome ? "w-[200px] py-1.5" : "w-[178px] p-3"
        }`}
      >
        {gnome ? (
          nav.map(([id, label], i) => (
            <div key={id}>
              {/* a rule where a section changes, never a heading */}
              {i === 1 && <span className="mx-1.5 my-1.5 block h-px bg-[var(--os-line)]" />}
              <button onClick={() => setScope(id)}
                className={`mx-1.5 mb-[2px] flex min-h-[36px] w-[calc(100%-12px)] items-center gap-2 rounded-[9px] px-2 text-left ${
                  scope === id ? "bg-[var(--os-row-select)]" : "hover:bg-white/[0.07]"}`}>
                <Glyph app="finder" size={16} className="shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            </div>
          ))
        ) : (
          <>
            <p className="px-2 pb-1.5 text-[11px] font-medium uppercase tracking-wider text-[var(--os-dim)]">Favourites</p>
            {nav.map(([id, label]) => (
              <button key={id} onClick={() => setScope(id)}
                className={`flex w-full items-center gap-2 rounded-[6px] px-2 py-[5px] text-left ${
                  scope === id ? "bg-white/15 text-white" : "text-[var(--os-text)]/70 hover:bg-white/5"}`}>
                <Glyph app="finder" size={16} className="shrink-0" />
                <span className="truncate">{label}</span>
              </button>
            ))}
          </>
        )}
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* path on the left, view switch on the right, as every file browser does */}
        <div className="flex h-[32px] shrink-0 items-center justify-between gap-3 border-b border-[var(--os-line)] bg-[var(--os-panel)] px-3">
          <nav className="flex min-w-0 items-center gap-1 text-[12px]">
            <button
              onClick={() => setFolder(null)}
              className={open ? "truncate text-[var(--os-text)]/60 hover:text-[var(--os-text)]" : "truncate text-[var(--os-text)]/80"}
            >
              {here}
            </button>
            {open && (
              <>
                <span className="text-[var(--os-dim)]">›</span>
                <span className="truncate">{open.label}</span>
              </>
            )}
          </nav>
          <div className="flex shrink-0 items-center rounded-[6px] border border-[var(--os-line)]">
            {(["folders", "list"] as const).map((v) => (
              <button key={v} onClick={() => setView(v)}
                aria-pressed={view === v}
                className={`px-2.5 py-[3px] text-[11px] capitalize first:rounded-l-[5px] last:rounded-r-[5px] ${
                  view === v ? "bg-white/15 text-white" : "text-[var(--os-text)]/55 hover:text-[var(--os-text)]"}`}>
                {v}
              </button>
            ))}
          </div>
        </div>

        <div className={`flex-1 overflow-y-auto ${gnome ? "px-6 pt-4" : ""}`}>
          <table className="w-full border-collapse">
            <thead className={`sticky top-0 text-[11px] ${gnome ? "bg-[var(--os-bg)]" : "bg-[var(--os-head)]"}`}>
              <tr className={gnome ? "text-[12px] font-bold text-[var(--os-text)]/40" : "text-[var(--os-dim)]"}>
                <th className={`border-b border-[var(--os-line)] text-left font-medium ${head}`}>Name</th>
                <th className={`hidden border-b border-[var(--os-line)] text-left font-medium lg:table-cell ${head}`}>Kind</th>
              </tr>
            </thead>
            <tbody>
              {showFolders && folders.map((f) => (
                <tr key={f.id}
                  onClick={() => { if (touch) setFolder(f.id); }}
                  onDoubleClick={() => !touch && setFolder(f.id)}
                  className={`cursor-default ${rowCls(false)}`}>
                  <td className={`flex items-center gap-2 ${cell}`}>
                    <Glyph app="finder" size={15} />
                    <span className="truncate">{f.label}</span>
                  </td>
                  <td className={`hidden whitespace-nowrap lg:table-cell ${cell} text-[var(--os-text)]/50`}>
                    Folder, {f.projects.length} item{f.projects.length === 1 ? "" : "s"}
                  </td>
                </tr>
              ))}

              {rows.map((p) => {
                const openable = hasPage(p, images[p.id] ?? 0);
                const on = sel?.id === p.id;
                return (
                  <tr key={p.id}
                    onClick={() => { setSel(p); if (touch && openable) onOpen(p.slug, p.title); }}
                    onDoubleClick={() => !touch && openable && onOpen(p.slug, p.title)}
                    className={`cursor-default ${rowCls(on)}`}>
                    <td className={`flex items-center gap-2 ${cell} ${openable ? "" : "text-[var(--os-text)]/45"}`}>
                      <span className={openable ? "" : "opacity-45"}><Glyph app="reader" size={15} /></span>
                      <span className="truncate">{p.title}</span>
                    </td>
                    <td className={`hidden whitespace-nowrap lg:table-cell ${cell} ${on && !gnome ? "text-white/80" : "text-[var(--os-text)]/50"}`}>
                      {/* The real kind. This column used to read "Document" on
                          every single row, which is a column doing no work. */}
                      {p.kind ? KIND_LABEL[p.kind] : openable ? "Document" : "Credit"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="flex h-[26px] shrink-0 items-center justify-center border-t border-[var(--os-line)] bg-[var(--os-panel)] text-[11px] text-[var(--os-dim)]">
          {inView} item{inView === 1 ? "" : "s"}{sel ? ", 1 selected" : ""}
        </div>
      </div>

      {!gnome && (
        <aside className="hidden w-[248px] shrink-0 flex-col overflow-y-auto border-l border-[var(--os-line)] bg-[var(--os-panel)] md:flex">
          {sel ? <Preview p={sel} openable={hasPage(sel, images[sel.id] ?? 0)} onOpen={() => onOpen(sel.slug, sel.title)} />
               : <span className="grid h-full place-items-center px-6 text-center text-[12px] text-[var(--os-dim)]">
                   Select a project to preview it
                 </span>}
        </aside>
      )}
    </div>
  );
}

function Preview({ p, openable, onOpen }: { p: Project; openable: boolean; onOpen: () => void }) {
  const metrics = Object.entries(p.metrics ?? {}).slice(0, 4);
  return (
    <div className="flex flex-col gap-3 p-3.5">
      {/* contain, not cover. These are 1280x800 screenshots of a live page:
          cropping one to fill the box discards the page it exists to show.
          The box is 8/5 so a screenshot fills it exactly, and the matte
          letterboxes the brand photos (1:1, 2:3) on purpose rather than
          cutting them. Do not "tidy" this back to object-cover. */}
      {p.cover_url ? (
        <img src={cldUrl(p.cover_url, { w: 440 })} alt="" className="aspect-[8/5] w-full rounded-[6px] bg-white/[0.04] object-contain" />
      ) : (
        <span className="grid aspect-[8/5] w-full place-items-center rounded-[6px] bg-white/[0.05] text-[11px] text-white/25">
          No preview
        </span>
      )}
      <p className="text-center text-[13px] font-medium leading-tight text-white">{p.title}</p>

      <dl className="text-[11px]">
        <Row k="Kind" v={p.kind ? KIND_LABEL[p.kind] : openable ? "Document" : "Credit"} />
        <Row k="Discipline" v={disciplinesOf(p)} />
        <Row k="Case study" v={openable ? "Yes" : "Credit only"} />
        {p.role && <Row k="Role" v={p.role} />}
        {!!p.stack.length && <Row k="Stack" v={p.stack.join(", ")} />}
      </dl>

      {p.summary && <p className="text-[11.5px] leading-relaxed text-white/55">{p.summary}</p>}

      {!!metrics.length && (
        <dl className="grid grid-cols-2 gap-2 border-t border-[var(--os-line)] pt-3">
          {metrics.map(([k, v]) => (
            <div key={k}>
              <dt className="text-[14px] font-semibold text-white">
                {typeof v === "number" ? v.toLocaleString("en-GB") : String(v)}
              </dt>
              <dd className="text-[9px] uppercase tracking-wider text-white/40">{k.replace(/_/g, " ")}</dd>
            </div>
          ))}
        </dl>
      )}

      {openable ? (
        <button onClick={onOpen}
          className="mt-1 rounded-[6px] bg-white/15 py-1.5 text-[12px] hover:bg-white/25">
          Open
        </button>
      ) : (
        <p className="mt-1 text-center text-[11px] text-white/30">No case study written yet</p>
      )}
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-2 border-b border-[var(--os-line)] py-[3px] last:border-0">
      <dt className="w-[62px] shrink-0 text-right text-white/35">{k}</dt>
      <dd className="min-w-0 flex-1 text-white/75">{v}</dd>
    </div>
  );
}

/* ── Reader ─────────────────────────────────────────────────────────────── */
export function Reader({ slug }: { slug: string }) {
  const [p, setP] = useState<Project | null>(null);
  const [imgs, setImgs] = useState<{ id: string; url: string; caption: string | null }[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      if (!alive) return;
      if (!data) return setState("missing");
      setP(data as Project);
      const { data: g } = await supabase.from("images").select("*").eq("project_id", (data as Project).id).order("sort");
      if (!alive) return;
      setImgs((g ?? []) as typeof imgs);
      setState("ready");
    })();
    return () => { alive = false; };
  }, [slug]);

  if (state === "loading") return <Pad><p className="text-white/40">Opening…</p></Pad>;
  if (!p) return <Pad><p className="text-white/40">That document could not be found.</p></Pad>;

  return (
    <div className="bg-[var(--os-bg)]">
      {/* Was h-[190px] + object-cover, which showed a 38% horizontal band
          of the screenshot and cut off both the nav and the product shot.
          Bounded height with contain keeps the whole capture readable. */}
      {p.cover_url && (
        <img src={cldUrl(p.cover_url, { w: 1000 })} alt="" className="max-h-[340px] w-full bg-white/[0.04] object-contain" />
      )}
      <div className="mx-auto max-w-[62ch] px-7 py-8">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          {disciplinesOf(p)}{p.kind ? ` · ${KIND_LABEL[p.kind]}` : ""}
          {readingLabel(p.body) ? ` · ${readingLabel(p.body)}` : ""}
        </p>
        <h1 className="pt-2 text-[26px] font-semibold leading-tight text-white">{p.title}</h1>
        {p.summary && <p className="pt-3 text-[15px] leading-relaxed text-white/60">{p.summary}</p>}
        {!!p.stack.length && (
          <p className="pt-5 text-[12px] text-white/45">{p.stack.join(" · ")}</p>
        )}
        {(p.live_url || p.repo_url) && (
          <p className="flex gap-4 pt-3 text-[12px]">
            {p.live_url && <a className="text-[var(--os-link)] hover:underline" href={p.live_url} target="_blank" rel="noreferrer">Live ↗</a>}
            {p.repo_url && <a className="text-[var(--os-link)] hover:underline" href={p.repo_url} target="_blank" rel="noreferrer">Code ↗</a>}
          </p>
        )}
        {p.body && <div className="prose-case prose-mac pt-7">{renderBody(p.body)}</div>}
        {imgs.map((im) => (
          <figure key={im.id} className="pt-7">
            <img src={cldUrl(im.url, { w: 1000 })} alt={im.caption ?? ""} loading="lazy" className="w-full rounded-md" />
            {im.caption && <figcaption className="pt-2 text-[11px] text-white/40">{im.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  );
}

/* ── Mail ───────────────────────────────────────────────────────────────── */
export function Mail() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const send = () =>
    window.open(`mailto:${EMAIL}?subject=${encodeURIComponent(subject || "Hello")}&body=${encodeURIComponent(message)}`, "_self");
  return (
    <div className="flex h-full flex-col bg-[var(--os-bg)] text-[13px] text-[var(--os-text)]">
      <div className="flex items-center gap-3 border-b border-[var(--os-line)] px-4 py-2">
        <span className="w-[52px] text-white/45">To</span>
        <span className="rounded-[4px] bg-[var(--os-accent)] px-2 py-[2px] text-white">{EMAIL}</span>
      </div>
      <label className="flex items-center gap-3 border-b border-[var(--os-line)] px-4 py-2">
        <span className="w-[52px] text-white/45">Subject</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value)}
          className="flex-1 bg-transparent outline-none placeholder:text-white/25" placeholder="A role, a project, a question" />
      </label>
      <textarea value={message} onChange={(e) => setMessage(e.target.value)}
        className="min-h-0 flex-1 resize-none bg-transparent px-4 py-3 leading-relaxed outline-none placeholder:text-white/25"
        placeholder="Write here. Send opens this in your own mail app." />
      <div className="flex items-center justify-between border-t border-[var(--os-line)] px-4 py-2.5">
        <span className="text-[11px] text-white/35">Nothing is sent from this page.</span>
        <button onClick={send} className="rounded-[6px] bg-[var(--os-accent)] px-4 py-1.5 text-white hover:brightness-110">Send</button>
      </div>
    </div>
  );
}

/* ── Terminal ───────────────────────────────────────────────────────────── */
export function Terminal({
  groups, onOpen,
}: { groups: Group[]; onOpen: (slug: string, title: string) => void }) {
  const all = useMemo(() => groups.flatMap((g) => g.projects), [groups]);
  const [lines, setLines] = useState<string[]>([
    "Last login: today on ttys000",
    "Type `help` for a list of commands.",
  ]);
  const [cmd, setCmd] = useState("");
  const end = useRef<HTMLDivElement>(null);
  useEffect(() => { end.current?.scrollIntoView({ block: "end" }); }, [lines]);

  const run = (raw: string) => {
    const [c, ...rest] = raw.trim().split(/\s+/);
    const arg = rest.join(" ");
    const out: string[] = [`yemi@portfolio ~ % ${raw}`];
    switch (c) {
      case "": break;
      case "help":
        out.push("ls                list every project", "open <slug>       open a case study",
                 "whoami            who is this", "clear             clear the screen");
        break;
      case "ls":
        out.push(...all.map((p) => `${p.slug.padEnd(20)} ${p.role ?? ""}`));
        break;
      case "whoami":
        out.push("Yemi Ogundairo. Design engineer. Designs the system, then ships it.");
        break;
      case "open": {
        const p = all.find((x) => x.slug === arg);
        if (!p) out.push(`open: ${arg || "<slug>"}: no such project`);
        else if (!p.body) out.push(`open: ${arg}: no case study written yet`);
        else { out.push(`opening ${arg}…`); onOpen(p.slug, p.title); }
        break;
      }
      case "clear": setLines([]); setCmd(""); return;
      default: out.push(`zsh: command not found: ${c}`);
    }
    setLines((l) => [...l, ...out]);
    setCmd("");
  };

  return (
    <div className="h-full bg-[var(--os-term)] px-3 py-2 font-mono text-[12.5px] leading-[1.55] text-[#d8d8d8]"
         onClick={(e) => (e.currentTarget.querySelector("input") as HTMLInputElement)?.focus()}>
      {lines.map((l, i) => <div key={i} className="whitespace-pre-wrap">{l}</div>)}
      <div className="flex gap-2">
        <span className="shrink-0 text-[var(--os-term-accent)]">yemi@portfolio ~ %</span>
        <input autoFocus value={cmd} onChange={(e) => setCmd(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run(cmd)}
          className="min-w-0 flex-1 bg-transparent outline-none" spellCheck={false} />
      </div>
      <div ref={end} />
    </div>
  );
}

/* ── bits ───────────────────────────────────────────────────────────────── */
function Pad({ children }: { children: React.ReactNode }) {
  return <div className="grid h-full place-items-center bg-[var(--os-bg)] text-[13px]">{children}</div>;
}
