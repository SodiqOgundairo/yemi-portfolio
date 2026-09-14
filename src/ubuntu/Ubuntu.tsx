import { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import UbuntuWindow from "./UbuntuWindow";
import Wallpaper from "./Wallpaper";
import QuickLook from "../mac/QuickLook";
import { YaruIcon } from "./icons";
import { useDesktop, type AppId, type Titles } from "../desktop/useDesktop";
import { useMedia, COMPACT } from "../desktop/useMedia";
import { hasPage } from "../lib/useProjects";
import type { Project } from "../lib/supabase";

/* Ubuntu, GNOME/Yaru. Same content and window manager as the other two
   shells; only the chrome and the palette differ. No Canonical marks: the
   Circle of Friends is a trademark, so the wallpaper is drawn.

   The signature interaction here is Activities: hit the corner and every
   window becomes a thumbnail. That is GNOME's answer to Stage Manager and
   leaving it out would be the obvious omission. */

const TITLES: Titles = {
  finder: "Files", reader: "Document Viewer", about: "About Me",
  contact: "Thunderbird", terminal: "Terminal",
  experience: "Experience", education: "Education", skills: "Skills",
};

/** reader never appears in a dock: it only ever opens from a document. */
type LaunchId = Exclude<AppId, "reader">;
const DOCK: { id: LaunchId; label: string }[] = [
  { id: "finder", label: "Files" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "terminal", label: "Terminal" },
  { id: "contact", label: "Thunderbird" },
  { id: "about", label: "About Me" },
];

export default function Ubuntu() {
  const [quick, setQuick] = useState<Project | null>(null);
  const d = useDesktop(TITLES, setQuick, "engineering", "ubuntu");
  const { wins, focused, open, close, minimise, focus, move, render, images, loaded } = d;
  const [booted, setBooted] = useState(false);
  const [overview, setOverview] = useState(false);
  const [sysMenu, setSysMenu] = useState(false);
  const compact = useMedia(COMPACT);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 15000); return () => clearInterval(t); }, []);

  const running = useMemo(() => new Set(wins.map((w) => (w.app === "reader" ? "finder" : w.app))), [wins]);
  const front = wins.filter((w) => !w.minimised).sort((a, b) => a.z - b.z).at(-1);

  useEffect(() => {
    if (booted && loaded && wins.length === 0) open("finder");
  }, [booted, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") { setOverview(false); setSysMenu(false); }
      if (e.key === "Meta" || e.key === "OS") { e.preventDefault(); setOverview((v) => !v); }
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w" && front) { e.preventDefault(); close(front.id); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [front, close]);

  const stamp = new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short", hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now);

  const pick = useCallback((id: string) => { focus(id); setOverview(false); }, [focus]);

  if (!booted) return <Lock onEnter={() => setBooted(true)} stamp={now} />;

  return (
    <div className="ubuntu-desktop os-ubuntu fixed inset-0 select-none overflow-hidden" onClick={() => sysMenu && setSysMenu(false)}>
      <Wallpaper />
      {/* top bar */}
      <div className="absolute inset-x-0 top-0 z-[9000] flex h-[32px] items-center bg-[#131313] px-3 text-[13px] text-white backdrop-blur-xl">
        <button onClick={() => setOverview((v) => !v)}
          className={`rounded-[6px] px-2.5 py-[3px] ${overview ? "bg-white/20" : "hover:bg-white/10"}`}>
          Activities
        </button>
        <span className="flex-1" />
        <span className="tabular-nums">{stamp}</span>
        <span className="flex-1" />
        <button onClick={(e) => { e.stopPropagation(); setSysMenu((v) => !v); }}
          aria-label="System menu" aria-expanded={sysMenu}
          className={`flex items-center gap-2 rounded-[6px] px-2 py-[3px] ${sysMenu ? "bg-white/20" : "hover:bg-white/10"}`}>
          <Glyph d="M8 10.6 6.3 8.8a2.4 2.4 0 0 1 3.4 0ZM4.6 7.1 3.3 5.8a6.7 6.7 0 0 1 9.4 0l-1.3 1.3a4.9 4.9 0 0 0-6.8 0ZM1.6 4.1.3 2.8a10.9 10.9 0 0 1 15.4 0l-1.3 1.3a9.1 9.1 0 0 0-12.8 0Z" w={16} h={12} />
          <Glyph d="M3 5h2.5L9 2v12L5.5 11H3Zm9.2-1.4a5 5 0 0 1 0 8.8" w={15} h={16} stroke />
          <Glyph d="M.5 3.5h17v9h-17ZM2 5h12v6H2ZM18.5 6.5v3" w={21} h={16} stroke />
        </button>
      </div>

      {sysMenu && (
        <div onClick={(e) => e.stopPropagation()}
          className="absolute right-2 top-[36px] z-[9600] w-[300px] rounded-[12px] border border-black/40 bg-[#333134]/95 p-3 shadow-[0_22px_60px_-12px_rgba(0,0,0,.8)] backdrop-blur-2xl">
          <div className="grid grid-cols-3 gap-2 pb-3">
            {["Wi-Fi", "Sound", "Power"].map((t) => (
              <span key={t} className="rounded-[10px] bg-[var(--os-accent)]/90 px-2 py-2 text-center text-[11.5px] text-white">{t}</span>
            ))}
          </div>
          <div className="border-t border-white/10 pt-2 text-[13px]">
            <Link to="/" className="block rounded-[7px] px-2.5 py-1.5 text-white/85 hover:bg-white/10">Main site ↗</Link>
            <button onClick={() => setBooted(false)} className="block w-full rounded-[7px] px-2.5 py-1.5 text-left text-white/85 hover:bg-white/10">Lock Screen</button>
          </div>
        </div>
      )}

      {/* left dock, always visible, running marks on the outer edge */}
      <div className={
          compact
            ? "absolute inset-x-0 bottom-0 z-[8000] flex h-[64px] items-center gap-1.5 overflow-x-auto bg-black/55 px-2 backdrop-blur-xl [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            : "absolute bottom-0 left-0 top-[32px] z-[8000] flex w-[72px] flex-col items-center gap-1 bg-black/45 py-2.5 backdrop-blur-xl"
        }>
        {/* a browser at the top is the most recognisable thing on an Ubuntu
            dock, and here it is the way back to the main site */}
        <Link to="/" title="Main site" aria-label="Main site"
          className={`grid ${compact ? "h-[36px] w-[36px]" : "h-[48px] w-[48px]"} shrink-0 place-items-center transition-transform hover:scale-105`}>
          <YaruIcon app="browser" size={compact ? 36 : 48} className="drop-shadow-md" />
        </Link>
        {!compact && <span className="h-px w-8 bg-white/15" />}
        {DOCK.map((a) => (
          <button key={a.id} onClick={() => { open(a.id); setOverview(false); }} title={a.label} aria-label={a.label}
            className={`group relative grid ${compact ? "h-[36px] w-[36px]" : "h-[48px] w-[48px]"} shrink-0 place-items-center transition-transform hover:scale-105`}>
            <YaruIcon app={a.id} size={compact ? 36 : 48} className="drop-shadow-md" />
            {running.has(a.id) && <span className="absolute -left-[6px] h-[5px] w-[5px] rounded-full bg-[var(--os-accent)]" />}
            <span className="pointer-events-none absolute left-[56px] z-10 whitespace-nowrap rounded-md bg-black/85 px-2 py-1 text-[12px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {a.label}
            </span>
          </button>
        ))}
        {!compact && <span className="mt-auto h-px w-8 bg-white/15" />}
        <button onClick={() => setOverview(true)} aria-label="Show Applications" title="Show Applications"
          className={`grid shrink-0 place-items-center rounded-[12px] bg-white/10 hover:bg-white/20 ${compact ? "h-[36px] w-[36px]" : "mt-2 h-[48px] w-[48px]"}`}>
          <span className="grid grid-cols-3 gap-[3px]">
            {Array.from({ length: 9 }).map((_, i) => <span key={i} className="h-[4px] w-[4px] rounded-full bg-white/85" />)}
          </span>
        </button>
      </div>

      {compact ? (
        /* Dragging a window with a thumb is miserable, so the front window
           fills the screen between the top bar and the dock and the dock
           switches between them. The headerbar keeps its GNOME controls on
           the right, which is the part that still reads as Ubuntu. */
        <div className="absolute inset-x-0 bottom-[68px] top-[32px] z-[100] p-2">
          {front ? (
            <div role="dialog" aria-label={front.title}
                 className="flex h-full flex-col overflow-hidden rounded-[12px] border border-black/50 bg-[var(--os-bg)] text-[var(--os-text)] shadow-2xl">
              <div className="flex h-[47px] shrink-0 items-center gap-2 border-b border-black/40 bg-[#3b3234] px-3">
                <span className="w-[26px]" />
                <span className="flex-1 truncate text-center text-[14.7px] font-bold">{front.title}</span>
                <button onClick={() => close(front.id)} aria-label={`Close ${front.title}`}
                  className="grid h-[26px] w-[26px] shrink-0 place-items-center rounded-full bg-white/10 text-[12px] leading-none hover:bg-[var(--os-accent)]">✕</button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">{render(front)}</div>
            </div>
          ) : (
            <p className="grid h-full place-items-center px-8 text-center text-[13px] text-white/55">
              Tap an app below to begin.
            </p>
          )}
        </div>
      ) : (
        wins.map((w) => (
          <UbuntuWindow key={w.id} win={w} active={focused === w.id}
            onFocus={() => focus(w.id)} onClose={() => close(w.id)}
            onMinimise={() => minimise(w.id)} onMoved={(x, y) => move(w.id, x, y)}>
            {render(w)}
          </UbuntuWindow>
        ))
      )}

      {/* Activities overview */}
      {overview && (
        <div className="absolute inset-0 z-[9500] bg-black/55 backdrop-blur-xl" onClick={() => setOverview(false)}>
          <div className="flex h-full flex-col items-center justify-center gap-8 px-[100px]" onClick={(e) => e.stopPropagation()}>
            <div className="flex flex-wrap items-center justify-center gap-5">
              {wins.length ? wins.map((w) => (
                <button key={w.id} onClick={() => pick(w.id)}
                  className="flex h-[150px] w-[230px] flex-col overflow-hidden rounded-[10px] border border-white/20 bg-[var(--os-bg)] text-left shadow-2xl transition-transform hover:scale-[1.03]">
                  <span className="flex h-[26px] shrink-0 items-center justify-center bg-[#3b3234] text-[11px] font-bold text-white/85">{w.title}</span>
                  <span className="flex-1 opacity-70">
                    <span className="block scale-[0.42] origin-top-left" style={{ width: 548, height: 300 }}>{render(w)}</span>
                  </span>
                </button>
              )) : <p className="text-[14px] text-white/60">No open windows</p>}
            </div>
            <div className="flex flex-wrap justify-center gap-4 rounded-[16px] bg-black/40 p-4">
              {DOCK.map((a) => (
                <button key={a.id} onClick={() => { open(a.id); setOverview(false); }}
                  className="flex w-[84px] flex-col items-center gap-1.5">
                  <YaruIcon app={a.id} size={52} className="drop-shadow-md" />
                  <span className="text-[11px] text-white/80">{a.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {quick && (
        <QuickLook project={quick} canOpen={hasPage(quick, images[quick.id] ?? 0)}
          onOpen={() => { d.openReader(quick.slug, quick.title); setQuick(null); }}
          onClose={() => setQuick(null)} />
      )}
    </div>
  );
}

function Lock({ onEnter, stamp }: { onEnter: () => void; stamp: Date }) {
  useEffect(() => {
    const k = () => onEnter();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onEnter]);
  return (
    <button
      onClick={onEnter}
      /* clock high, user low, so the wallpaper art is visible between them,
         which is how GNOME actually lays the lock screen out */
      className="ubuntu-desktop os-ubuntu fixed inset-0 flex w-full cursor-default flex-col items-center justify-between py-[10vh] text-white"
    >
      <Wallpaper />
      <span className="relative z-10 flex flex-col items-center">
        <span className="text-[80px] font-light leading-none tabular-nums">
          {new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(stamp)}
        </span>
        <span className="pt-1 text-[17px] font-medium text-white/85">
          {new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(stamp)}
        </span>
      </span>

      <span className="relative z-10 flex flex-col items-center">
        <span className="grid h-[86px] w-[86px] place-items-center rounded-full bg-[var(--os-accent)] text-[32px] font-semibold text-white">Y</span>
        <span className="pt-3 text-[15px]">Yemi Ogundairo</span>
        <span className="mt-6 rounded-full bg-black/45 px-4 py-2 text-[13px] backdrop-blur-md">
          Click anywhere or press any key to enter
        </span>
      </span>

      <span className="absolute bottom-5 z-10 text-[12px] text-white/45">Ubuntu 26.04 LTS</span>
    </button>
  );
}

function Glyph({ d, w, h, stroke = false }: { d: string; w: number; h: number; stroke?: boolean }) {
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden
         fill={stroke ? "none" : "currentColor"}
         stroke={stroke ? "currentColor" : undefined} strokeWidth={stroke ? 1.4 : undefined}
         strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}
