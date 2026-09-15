import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
/* The WebGL chunk is the heaviest thing here by an order of magnitude.
   Splitting it means the type, the nav and the copy paint immediately and the
   surface fades in behind them, instead of the whole page waiting on three. */
const Metal = lazy(() => import("./three/Metal"));
import Poster from "./three/Poster";
import Cursor from "./ui/Cursor";
import Preloader from "./ui/Preloader";
import Station from "./ui/Station";
import Reveal from "./ui/Reveal";
import Shells from "./ui/Shells";
import AboutMe from "./ui/AboutMe";
import { useStage } from "./lib/useStage";
import { useSceneMode, prefersStill } from "./lib/useCapability";
import { initSmoothScroll, scrollToId } from "./lib/smooth";
import { useProjects, boardProjects } from "./lib/useProjects";
import type { Discipline } from "./lib/supabase";
import { spell } from "./lib/claims";

const EMAIL = "ogundairosodiq954@gmail.com";

/* Three acts, and the register changes between them on purpose.
 *
 *   I  atmosphere  full-bleed surface, two held statements, no density
 *   II substance   solid ground, the whole body of work, grouped and scannable
 *   III ask        one action
 *
 * The transition is the point: Act II is opaque and simply rises over the
 * fixed canvas, so the ground swallows the surface rather than the surface
 * politely fading. It costs nothing, it cannot desync, and it lets the WebGL
 * frameloop stop dead the moment the stage is off screen. */

export default function App() {
  const stage = useRef<HTMLDivElement>(null);
  const { progress, active, grounded } = useStage(stage);
  /* Decided before first render: on a poster device the WebGL chunk is never
     even fetched, which is the larger half of the saving. */
  const mode = useSceneMode();
  const [ready, setReady] = useState(false);
  const { projects, loaded, error } = useProjects();
  const board = boardProjects(projects);
  /* Counted from the live rows so a door can never advertise a number the
     desktop behind it does not actually hold. */
  const counts = projects.reduce<Partial<Record<Discipline, number>>>((a, p) => {
    for (const d of p.disciplines?.length ? p.disciplines : [p.discipline]) {
      a[d] = (a[d] ?? 0) + 1;
    }
    return a;
  }, {});

  /* Returning from a case study should put you back at the index, not at the
     top of the scene. The scroll has to wait for the rows to exist, or it
     lands at a height the page has not grown into yet. */
  const jumpTo = (useLocation().state as { to?: string } | null)?.to;
  const jumped = useRef(false);
  useEffect(() => initSmoothScroll({ reset: !jumpTo }), []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!jumpTo || !loaded || jumped.current) return;
    jumped.current = true;
    requestAnimationFrame(() => scrollToId(jumpTo));
  }, [jumpTo, loaded]);

  return (
    <>
      <Preloader ready={ready} dataReady={loaded} />
      <Cursor />
      {mode === "webgl" ? (
        <Suspense fallback={<div className="fixed inset-0 z-0 bg-void" />}>
          <Metal progress={progress} projects={board} active={active} onReady={() => setReady(true)} />
        </Suspense>
      ) : (
        <Poster progress={progress} still={prefersStill()} onReady={() => setReady(true)} />
      )}

      <header
        className={`fixed inset-x-0 top-0 z-40 flex items-center justify-between px-gutter py-5 transition-colors duration-[var(--dur-move)] ${
          grounded ? "border-b border-edge bg-void" : "border-b border-transparent"
        }`}
      >
        <button onClick={() => scrollToId("top")} className="hud text-bone">Ogundairo</button>
        <nav className="flex items-center gap-6">
          <button onClick={() => scrollToId("work")} className="hud transition-colors hover:text-bone">Work</button>
          <button onClick={() => scrollToId("about")} className="hud transition-colors hover:text-bone">About</button>
          <button onClick={() => scrollToId("contact")} className="hud transition-colors hover:text-bone">Contact</button>
        </nav>
      </header>

      {/* ── Act I ─────────────────────────────────────────────── */}
      <div id="top" ref={stage} className="pointer-events-none relative z-10">
        <Station id="hero" index="00" label="Design Engineer">
          <h1 data-reveal className="display text-hero">
            Yemi<br />Ogundairo
          </h1>
          <p data-reveal className="max-w-md text-lead leading-relaxed text-ghost">
            I design the system, then ship it. Design systems, multi-tenant SaaS,
            mobile and native desktop.
          </p>
        </Station>

        <Station id="approach" index="01" label="Approach">
          <h2 data-reveal className="display max-w-xl text-section">
            Design and engineering are one job.
          </h2>
          <p data-reveal className="max-w-md text-lead leading-relaxed text-ghost">
            A decade in design, four years shipping the code behind it. The handoff
            never happens because there is nobody to hand off to.
          </p>
        </Station>
      </div>

      {/* ── Act II: the doors ──────────────────────────────────
          The index used to sit here. Yemi's call, 14/09/2026: the work is
          carried by the desktops now, so the front door points at them rather
          than listing the projects itself. WorkIndex is left in the tree, not
          deleted, because "hide those for now" means this should be one line
          to put back. /work/:slug stays routed so links already shared keep
          working even though nothing on the site points at them. */}
      <section id="work" className="relative z-10 bg-void px-gutter pt-act">
        <div className="mx-auto max-w-6xl">
          <Reveal className="flex flex-col gap-6 pb-10">
            <div data-reveal className="flex items-center gap-4">
              <span className="hud text-bone">02</span>
              <span className="hairline w-16" />
              <span className="hud">Work</span>
            </div>
            {/* The old line named three artefacts and stopped there, which read
                thin once the desktops carried the whole body of work. The count
                is derived from the live rows instead.
                It is also PREFIXED rather than defaulted. The fallback used to
                be a hardcoded "Thirty-four", which had already gone stale by
                four on 15/09/2026 and, worse, stated a number to a visitor on
                exactly the load that had just failed. A headline that says
                nothing beats one that invents something. */}
            <h2 data-reveal className="display max-w-3xl text-section">
              {loaded && projects.length ? `${spell(projects.length)} projects. ` : ""}
              Product, engineering and brand. One person on all of it.
            </h2>
            <p data-reveal className="max-w-xl text-lead leading-relaxed text-ghost">
              {loaded && projects.length
                ? `${projects.length} projects across three disciplines. Open one of the desktops and browse them the way you would on your own machine.`
                : "Open one of the desktops and browse the work the way you would on your own machine."}
            </p>
          </Reveal>
          <Reveal><Shells counts={counts} /></Reveal>
          {error && <p className="pt-6 text-small text-ghost">Could not load the work right now.</p>}
        </div>
      </section>

      <AboutMe />

      {/* ── Act III ───────────────────────────────────────────── */}
      <section id="contact" className="relative z-10 bg-void px-gutter pb-32 pt-act">
        <div className="mx-auto max-w-6xl">
          <Reveal className="flex flex-col gap-8">
            <div data-reveal className="flex items-center gap-4">
              <span className="hud text-bone">04</span>
              <span className="hairline w-16" />
              <span className="hud">Contact</span>
            </div>
            <h2 data-reveal className="display max-w-2xl text-section">
              If you need one person who can hold both ends, let's talk.
            </h2>
            <a
              data-reveal
              href={`mailto:${EMAIL}`}
              className="group inline-flex w-fit items-baseline gap-4 border-b border-edge pb-3 text-row text-bone transition-colors duration-[var(--dur-move)] hover:border-bone"
            >
              {EMAIL}
              <span className="text-ghost transition-transform duration-[var(--dur-move)] ease-[var(--ease-glide)] group-hover:translate-x-1">→</span>
            </a>
          </Reveal>

          {/* Both links come off the CV header. Behance is deliberately NOT
              here: moving off it is the reason this site exists. The phone
              number is off too, because a public page is a scraper's lunch
              and the mailto above is the route he wants people to take. */}
          <div className="mt-24 flex flex-wrap items-center justify-between gap-4 border-t border-edge pt-6">
            <span className="hud">Yemi Ogundairo · Design Engineer</span>
            <span className="flex flex-wrap items-center gap-6">
              <a href="https://www.linkedin.com/in/yemi-ogundairo" target="_blank" rel="noreferrer"
                 className="hud transition-colors hover:text-bone">LinkedIn ↗</a>
              <a href="https://github.com/SodiqOgundairo" target="_blank" rel="noreferrer"
                 className="hud transition-colors hover:text-bone">GitHub ↗</a>
            </span>
          </div>
        </div>
      </section>
    </>
  );
}
