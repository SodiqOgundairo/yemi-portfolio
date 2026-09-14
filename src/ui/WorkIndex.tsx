import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { gsap, ScrollTrigger } from "../lib/smooth";
import { DISCIPLINE_LABEL, type Project } from "../lib/supabase";
import { hasPage, type Group } from "../lib/useProjects";

/* The index is the argument, so it is dense, scannable and plain DOM: no
   WebGL, no cards, nothing between a reader and the list of what was built.
   Two tiers by design. A project with a case study or a brief reads as a
   destination; a project without reads as a credit and is inert. That is
   honest about which work has a story attached, and it makes the gap
   visible rather than papering over it with dead links. */

export default function WorkIndex({
  groups, images, total,
}: { groups: Group[]; images: Record<string, number>; total: number }) {
  const root = useRef<HTMLDivElement>(null);
  const peek = useRef<HTMLDivElement>(null);
  const peekImg = useRef<HTMLImageElement>(null);
  const pos = useRef({ x: 0, y: 0, tx: 0, ty: 0, on: false });

  /* Rows arrive in batches rather than one trigger per row: 34 individual
     ScrollTriggers is a measurable scroll cost for no visual gain. */
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      ScrollTrigger.batch("[data-row]", {
        start: "top 92%",
        once: true,
        onEnter: (batch) =>
          gsap.from(batch, {
            y: 18, opacity: 0, duration: 0.62, ease: "expo.out", stagger: 0.035,
          }),
      });
    }, el);
    return () => ctx.revert();
  }, [groups.length]);

  /* The cover preview is written straight to the DOM and eased on its own
     rAF. Routing pointermove through React state would re-render the whole
     index sixty times a second. */
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = root.current, box = peek.current;
    if (!el || !box) return;
    let raf = 0;
    const move = (e: PointerEvent) => { pos.current.tx = e.clientX; pos.current.ty = e.clientY; };
    const loop = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.14;
      p.y += (p.ty - p.y) * 0.14;
      box.style.transform = `translate3d(${p.x + 28}px, ${p.y - 90}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    el.addEventListener("pointermove", move);
    raf = requestAnimationFrame(loop);
    return () => { el.removeEventListener("pointermove", move); cancelAnimationFrame(raf); };
  }, []);

  const show = (url: string | null) => {
    const box = peek.current, img = peekImg.current;
    if (!box || !img || !url) return;
    if (img.getAttribute("src") !== url) img.setAttribute("src", url);
    // jump the easing to the pointer so the first frame is not a fly-in
    pos.current.x = pos.current.tx; pos.current.y = pos.current.ty;
    box.style.opacity = "1";
    box.style.scale = "1";
  };
  const hide = () => {
    const box = peek.current;
    if (!box) return;
    box.style.opacity = "0";
    box.style.scale = "0.96";
  };

  return (
    <div ref={root} className="relative" onPointerLeave={hide}>
      <div
        ref={peek}
        aria-hidden
        className="pointer-events-none fixed left-0 top-0 z-30 hidden h-[150px] w-[220px] overflow-hidden border border-edge bg-ash opacity-0 [scale:0.96] [transition:opacity_var(--dur-move)_var(--ease-glide),scale_var(--dur-move)_var(--ease-glide)] lg:block"
      >
        <img ref={peekImg} alt="" className="h-full w-full object-cover" />
      </div>

      {groups.map((g) => (
        <section key={g.discipline} className="pb-16">
          {/* The sticky label's containing block has to END with the last row,
              or it stays pinned across the gap into the next group and reads as
              a stuck element. Hence the wrapper: the group's bottom padding
              lives outside it. Opaque, not translucent: rows scrolling under a
              blurred 85% panel were still legible through it. */}
          <div>
            <div className="sticky top-14 z-20 -mx-gutter bg-void px-gutter pb-3 pt-4">
              <div className="flex items-baseline gap-4 border-b border-edge pb-3">
                <h3 className="hud text-bone">{DISCIPLINE_LABEL[g.discipline]}</h3>
                <span className="hairline flex-1 translate-y-[-4px]" />
                <span className="hud">{String(g.projects.length).padStart(2, "0")}</span>
              </div>
            </div>

            <ul>
              {g.projects.map((p) => (
                <Row key={p.id} p={p} open={hasPage(p, images[p.id] ?? 0)} onPeek={show} onLeave={hide} />
              ))}
            </ul>
          </div>
        </section>
      ))}

      <p className="hud pt-2">
        {total} published · {groups.length} disciplines
      </p>
    </div>
  );
}

function Row({
  p, open, onPeek, onLeave,
}: {
  p: Project; open: boolean;
  onPeek: (url: string | null) => void; onLeave: () => void;
}) {
  const inner = (
    <>
      <span
        className={`text-row leading-tight transition-[color,transform] duration-[var(--dur-move)] ease-[var(--ease-glide)] ${
          open ? "text-bone group-hover:translate-x-2" : "text-ghost"
        }`}
      >
        {p.title}
      </span>
      <span className="text-small text-faint sm:pt-1">{p.role ?? ""}</span>
      <span
        aria-hidden
        className={`hidden justify-self-end pt-1 text-ghost transition-[opacity,transform] duration-[var(--dur-move)] ease-[var(--ease-glide)] sm:block ${
          open ? "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" : "opacity-0"
        }`}
      >
        →
      </span>
    </>
  );

  /* No years anywhere. Yemi's call: a date on a row invites the reader to
     audit the gaps between them instead of reading the work. The column is
     still in the database, so this is one line to reverse. */
  const cols =
    "grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-x-6 gap-y-1 py-5 sm:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)_1.5rem]";

  return (
    <li className="group border-b border-edge/60 transition-colors duration-[var(--dur-move)] hover:border-edge">
      {open ? (
        <Link
          to={`/work/${p.slug}`}
          data-row
          className={cols}
          onPointerEnter={() => onPeek(p.cover_url)}
          onPointerLeave={onLeave}
        >
          {inner}
        </Link>
      ) : (
        /* No link, no pointer, no hover lift. It is a credit, and it says so
           by simply not behaving like anything you can open. */
        <div data-row className={`${cols} cursor-default`}>
          {inner}
          {p.summary && (
            <p className="col-span-full max-w-2xl pt-1 text-small leading-relaxed text-faint">
              {p.summary}
            </p>
          )}
        </div>
      )}
    </li>
  );
}
