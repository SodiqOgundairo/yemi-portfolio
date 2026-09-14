import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { supabase, DISCIPLINE_LABEL, type Project as P } from "../lib/supabase";
import { renderBody, readingTime } from "../lib/markdown";

export type Img = { id: string; url: string; caption: string | null; sort: number };

/* One template, three shapes it has to survive:
 *
 *   minimal   title, one line, nothing else. Must read as a deliberate note,
 *             not as a page that failed to load.
 *   typical   summary, role, stack, a cover, a few hundred words.
 *   maximal   four metrics, 1,200 words, eight gallery images.
 *
 * Every block below is independently optional, and the spacing lives on the
 * blocks that are present rather than on a fixed grid, so nothing leaves a
 * hole when it is absent. */

export default function ProjectPage() {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const [p, setP] = useState<P | null>(null);
  const [imgs, setImgs] = useState<Img[]>([]);
  const [state, setState] = useState<"loading" | "ready" | "missing">("loading");

  useEffect(() => {
    let alive = true;
    window.scrollTo(0, 0);
    (async () => {
      const { data } = await supabase.from("projects").select("*").eq("slug", slug).maybeSingle();
      if (!alive) return;
      if (!data) { setState("missing"); return; }
      setP(data as P);
      const { data: gal } = await supabase.from("images").select("*")
        .eq("project_id", (data as P).id).order("sort");
      if (!alive) return;
      setImgs((gal ?? []) as Img[]);
      setState("ready");
    })();
    return () => { alive = false; };
  }, [slug]);

  const toWork = () => navigate("/", { state: { to: "work" } });

  if (state === "loading") return <Shell onWork={toWork}><p className="hud pt-24">Loading</p></Shell>;

  if (state === "missing" || !p)
    return (
      <Shell onWork={toWork}>
        <h1 className="display pt-24 text-title">Not found</h1>
        <p className="mt-4 max-w-md text-body text-ghost">
          There is no published project at this address. It may be a draft, or the
          link may be out of date.
        </p>
        <button onClick={toWork} className="hud mt-10 border border-edge px-5 py-2.5 transition-colors hover:border-bone hover:text-bone">
          All work
        </button>
      </Shell>
    );

  return <ProjectView p={p} imgs={imgs} onWork={toWork} />;
}

/** The template itself, with no data source of its own. `/preview` renders it
 *  against fixtures so the minimal and maximal shapes can be judged before a
 *  single case study exists. */
export function ProjectView({ p, imgs, onWork }: { p: P; imgs: Img[]; onWork: () => void }) {
  const metrics = Object.entries(p.metrics ?? {});
  const words = p.body ? p.body.trim().split(/\s+/).length : 0;
  /* Structure, not length, decides what this is. A word count alone called a
     four-section piece with a real argument a "brief" purely for being tight,
     which is the wrong signal: a brief is a paragraph or two of context, a
     case study is a piece that goes through named sections. Length still has
     a say at the bottom end so a two-line stub cannot promote itself with a
     single heading. */
  const sections = p.body ? (p.body.match(/^## /gm) ?? []).length : 0;
  const kind = sections >= 2 && words >= 150 ? "Case study" : "Brief";
  const hasFacts = Boolean(p.role || p.stack.length || p.live_url || p.repo_url);

  return (
    <Shell onWork={onWork}>
      <article className="pt-24">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span className="hud text-bone">{DISCIPLINE_LABEL[p.discipline]}</span>
          <span className="hairline w-10" />
          <span className="hud">{kind}</span>
          {words > 0 && <><span className="hairline w-10" /><span className="hud">{readingTime(p.body!)} min</span></>}
        </div>

        <h1 className="display mt-6 max-w-4xl text-title">{p.title}</h1>
        {p.summary && (
          <p className="mt-6 max-w-2xl text-lead leading-relaxed text-ghost">{p.summary}</p>
        )}

        {hasFacts && (
          <dl className="mt-14 grid gap-x-8 gap-y-7 border-y border-edge py-8 sm:grid-cols-4">
            {p.role && (
              <div><dt className="hud pb-2">Role</dt><dd className="text-small text-bone">{p.role}</dd></div>
            )}
            {!!p.stack.length && (
              <div className="sm:col-span-2">
                <dt className="hud pb-2">Stack</dt>
                <dd className="text-small text-bone">{p.stack.join(" · ")}</dd>
              </div>
            )}
            {(p.live_url || p.repo_url) && (
              <div>
                <dt className="hud pb-2">Links</dt>
                <dd className="flex flex-col items-start gap-1.5">
                  {p.live_url && <a href={p.live_url} target="_blank" rel="noreferrer" className="text-small text-bone underline-offset-4 hover:underline">Live ↗</a>}
                  {p.repo_url && <a href={p.repo_url} target="_blank" rel="noreferrer" className="text-small text-bone underline-offset-4 hover:underline">Code ↗</a>}
                </dd>
              </div>
            )}
          </dl>
        )}

        {!!metrics.length && (
          <dl className="mt-14 grid grid-cols-2 gap-8 sm:grid-cols-4">
            {metrics.map(([k, v]) => (
              <div key={k}>
                <dt className="display text-[2rem] text-bone">
                  {typeof v === "number" ? v.toLocaleString("en-GB") : String(v)}
                </dt>
                <dd className="hud pt-2">{k.replace(/_/g, " ")}</dd>
              </div>
            ))}
          </dl>
        )}

        {p.cover_url && (
          <figure className="mt-16 overflow-hidden border border-edge bg-ash">
            <img src={p.cover_url} alt="" className="w-full" />
          </figure>
        )}

        {p.body && <div className="prose-case mt-16 max-w-2xl">{renderBody(p.body)}</div>}

        {!!imgs.length && (
          <div className="mt-20 space-y-14">
            {imgs.map((im) => (
              <figure key={im.id}>
                <div className="overflow-hidden border border-edge bg-ash">
                  <img src={im.url} alt={im.caption ?? ""} loading="lazy" className="w-full" />
                </div>
                {im.caption && <figcaption className="hud pt-3">{im.caption}</figcaption>}
              </figure>
            ))}
          </div>
        )}

        {/* A brief with no cover, no metrics and no gallery ends here, and the
            rule plus the return is what makes that read as finished. */}
        <div className="mt-24 border-t border-edge pt-6">
          <button onClick={onWork} className="hud transition-colors hover:text-bone">← All work</button>
        </div>
      </article>
    </Shell>
  );
}

function Shell({ children, onWork }: { children: React.ReactNode; onWork: () => void }) {
  return (
    <div className="min-h-[100svh] bg-void">
      <header className="fixed inset-x-0 top-0 z-20 flex items-center justify-between border-b border-edge bg-void/85 px-gutter py-5 backdrop-blur">
        <Link to="/" className="hud text-bone">Ogundairo</Link>
        <nav className="flex items-center gap-6">
          <button onClick={onWork} className="hud transition-colors hover:text-bone">Work</button>
          <Link to="/" className="hud transition-colors hover:text-bone">Back to the scene</Link>
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-gutter pb-32">{children}</main>
    </div>
  );
}
