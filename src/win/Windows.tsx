import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import WinWindow from "./WinWindow";
import Bloom from "./Bloom";
import QuickLook from "../mac/QuickLook";
import { FluentIcon } from "./icons";
import { useDesktop, type AppId, type Titles } from "../desktop/useDesktop";
import { useMedia, COMPACT } from "../desktop/useMedia";
import { hasPage } from "../lib/useProjects";
import type { Project } from "../lib/supabase";

/* Windows 11. Same content and window manager as the other two shells.
   No Microsoft marks: the Start logo and the Bloom wallpaper are both
   theirs, so the button is four plain squares and the wallpaper is drawn. */

const TITLES: Titles = {
  finder: "Work — File Explorer", reader: "Reader", about: "About",
  contact: "Mail", terminal: "Terminal",
  experience: "Experience", education: "Education", skills: "Skills",
};

type LaunchId = Exclude<AppId, "reader">;
const APPS: { id: LaunchId; label: string }[] = [
  { id: "finder", label: "File Explorer" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "skills", label: "Skills" },
  { id: "terminal", label: "Terminal" },
  { id: "contact", label: "Mail" },
  { id: "about", label: "About" },
];

export default function Windows() {
  const [quick, setQuick] = useState<Project | null>(null);
  const d = useDesktop(TITLES, setQuick, "brand", "win");
  const { wins, focused, open, close, minimise, focus, move, render, images, loaded } = d;
  const [booted, setBooted] = useState(false);
  const [start, setStart] = useState(false);
  const compact = useMedia(COMPACT);
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 15000); return () => clearInterval(t); }, []);

  const running = useMemo(() => new Set(wins.map((w) => (w.app === "reader" ? "finder" : w.app))), [wins]);
  const front = wins.filter((w) => !w.minimised).sort((a, b) => a.z - b.z).at(-1);
  const recent = useMemo(() => [...wins].sort((a, b) => b.z - a.z).slice(0, 4), [wins]);

  useEffect(() => {
    if (booted && loaded && wins.length === 0) open("finder");
  }, [booted, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setStart(false);
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "w" && front) { e.preventDefault(); close(front.id); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [front, close]);

  if (!booted) return <Lock onEnter={() => setBooted(true)} now={now} />;

  return (
    <div className="win-desktop os-win fixed inset-0 select-none overflow-hidden" onClick={() => start && setStart(false)}>
      <Bloom />
      {!compact && <div className="absolute left-5 top-5 flex flex-col gap-4">
        <DeskIcon label="Work" onOpen={() => open("finder")}>{<FluentIcon app="finder" size={38} />}</DeskIcon>
        <DeskIcon label="Main site" href="/">{<FluentIcon app="globe" size={38} />}</DeskIcon>
      </div>}

      {compact ? (
        /* The taskbar is already at the bottom on Windows, so the phone
           adaptation is just a full-bleed window above it. The title bar keeps
           icon and title LEFT with the close button right, which is the tell. */
        <div className="absolute inset-x-0 bottom-[48px] top-0 z-[100] p-2">
          {front ? (
            <div role="dialog" aria-label={front.title}
                 className="flex h-full flex-col overflow-hidden rounded-[8px] border border-white/15 bg-[var(--os-bg)] text-[var(--os-text)] shadow-2xl">
              <div className="flex h-[32px] shrink-0 items-center bg-[#2b2b2b]">
                <span className="flex min-w-0 flex-1 items-center gap-2 pl-3">
                  <span className="grid h-[15px] w-[15px] shrink-0 place-items-center">
                    <FluentIcon app={front.app} size={15} />
                  </span>
                  <span className="truncate text-[12.5px]">{front.title}</span>
                </span>
                <button onClick={() => close(front.id)} aria-label={`Close ${front.title}`}
                  className="grid h-full w-[46px] shrink-0 place-items-center text-[10px] hover:bg-[#C42B1C] hover:text-white">✕</button>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto">{render(front)}</div>
            </div>
          ) : (
            <p className="grid h-full place-items-center px-8 text-center text-[13px] text-white/60">
              Tap an app below to begin.
            </p>
          )}
        </div>
      ) : (
        wins.map((w) => (
          <WinWindow key={w.id} win={w} active={focused === w.id} icon={<FluentIcon app={w.app} size={15} />}
            onFocus={() => focus(w.id)} onClose={() => close(w.id)}
            onMinimise={() => minimise(w.id)} onMoved={(x, y) => move(w.id, x, y)}>
            {render(w)}
          </WinWindow>
        ))
      )}

      {/* Start menu */}
      {start && (
        <div onClick={(e) => e.stopPropagation()}
          className="absolute bottom-[56px] left-1/2 z-[9500] w-[560px] max-w-[calc(100vw-16px)] -translate-x-1/2 overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#2b2b2b]/95 shadow-[0_30px_70px_-16px_rgba(0,0,0,.85)] backdrop-blur-2xl">
          <div className="px-4 pt-5 sm:px-6 sm:pt-6">
            <div className="flex items-center gap-2 rounded-[4px] border border-white/15 bg-[#1f1f1f] px-3 py-2">
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="#9a9a9a" strokeWidth="1.5">
                <circle cx="7" cy="7" r="4.5" /><path d="m10.5 10.5 4 4" />
              </svg>
              <input placeholder="Search for apps, settings and documents"
                className="w-full bg-transparent text-[12.5px] text-white/90 outline-none placeholder:text-white/35" />
            </div>

            <div className="flex items-baseline justify-between pb-3 pt-6">
              <p className="text-[13px] font-semibold text-white/90">Pinned</p>
              <span className="rounded-[4px] px-2 py-1 text-[11.5px] text-white/60">All apps ›</span>
            </div>
            <div className="grid grid-cols-4 gap-1 sm:grid-cols-6">
              {APPS.map((a) => (
                <button key={a.id} onClick={() => { open(a.id); setStart(false); }}
                  className="flex flex-col items-center gap-1.5 rounded-[4px] px-1 py-3 hover:bg-white/[0.07]">
                  <FluentIcon app={a.id} size={30} />
                  <span className="w-full truncate text-center text-[11px] text-white/85">{a.label}</span>
                </button>
              ))}
            </div>

            <p className="pb-2 pt-6 text-[13px] font-semibold text-white/90">Recommended</p>
            <div className="grid grid-cols-1 gap-1 pb-6 sm:grid-cols-2">
              {recent.map((w) => (
                <button key={w.id} onClick={() => { focus(w.id); setStart(false); }}
                  className="flex items-center gap-3 rounded-[4px] px-2 py-2 text-left hover:bg-white/[0.07]">
                  <FluentIcon app={w.app} size={24} className="shrink-0" />
                  <span className="min-w-0">
                    <span className="block truncate text-[12px] text-white/90">{w.title}</span>
                    <span className="block text-[10.5px] text-white/45">Recently opened</span>
                  </span>
                </button>
              ))}
              {!recent.length && <p className="col-span-2 py-2 text-[12px] text-white/35">Nothing opened yet</p>}
            </div>
          </div>

          <div className="flex items-center gap-3 border-t border-white/[0.08] bg-[#242424] px-6 py-3">
            <span className="grid h-[28px] w-[28px] place-items-center rounded-full bg-[var(--os-accent)] text-[12px] font-semibold text-white">Y</span>
            <span className="text-[12.5px] text-white/85">Yemi Ogundairo</span>
            <span className="flex-1" />
            <Link to="/" className="rounded-[4px] px-2.5 py-1.5 text-[12px] text-white/65 hover:bg-white/10 hover:text-white">Main site ↗</Link>
            <button onClick={() => setBooted(false)} aria-label="Sign out"
              className="grid h-[30px] w-[30px] place-items-center rounded-[4px] text-white/70 hover:bg-white/10 hover:text-white">
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M8 1.8v6" /><path d="M4.2 3.6a5.6 5.6 0 1 0 7.6 0" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* taskbar, centred, the way 11 does it */}
      <div className="absolute inset-x-0 bottom-0 z-[9000] flex h-[48px] items-center bg-black/55 px-3 backdrop-blur-2xl">
        <span className="flex-1" />
        <div className="flex max-w-full items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button onClick={(e) => { e.stopPropagation(); setStart((v) => !v); }} aria-label="Start"
            className={`grid h-[40px] shrink-0 place-items-center rounded-[4px] ${compact ? "w-[38px]" : "w-[44px]"} ${start ? "bg-white/15" : "hover:bg-white/10"}`}>
            <span className="grid grid-cols-2 gap-[2.5px]">
              {[0, 1, 2, 3].map((i) => <span key={i} className="h-[7px] w-[7px] rounded-[1.5px] bg-[#4cc2ff]" />)}
            </span>
          </button>
          {/* Windows does not put its taskbar icons in coloured tiles: that
              is a dock, and it was the main thing making this read as macOS.
              Bare glyph, square hover, a short accent bar when running. */}
          {APPS.map((a) => (
            <button key={a.id} onClick={(e) => { e.stopPropagation(); open(a.id); }} title={a.label} aria-label={a.label}
              className={`group relative grid h-[40px] shrink-0 place-items-center rounded-[4px] hover:bg-white/[0.09] ${compact ? "w-[38px]" : "w-[44px]"}`}>
              <FluentIcon app={a.id} size={compact ? 22 : 24} />
              <span className={`absolute bottom-[2px] h-[3px] rounded-full bg-[#4cc2ff] transition-all ${running.has(a.id) ? "w-[16px]" : "w-0"}`} />
            </button>
          ))}
        </div>
        <span className="flex-1" />
        {/* the clock is the first thing to go on a narrow taskbar: clipped
            digits look broken, absent ones do not */}
        <span className="hidden pr-2 text-right text-[12px] leading-tight text-white/85 sm:block">
          <span className="block tabular-nums">{new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now)}</span>
          <span className="block tabular-nums">{new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "2-digit", year: "numeric" }).format(now)}</span>
        </span>
      </div>

      {quick && (
        <QuickLook project={quick} canOpen={hasPage(quick, images[quick.id] ?? 0)}
          onOpen={() => { d.openReader(quick.slug, quick.title); setQuick(null); }}
          onClose={() => setQuick(null)} />
      )}
    </div>
  );
}

function DeskIcon({ label, onOpen, href, children }: { label: string; onOpen?: () => void; href?: string; children: React.ReactNode }) {
  const inner = (
    <>
      <span className="grid h-[44px] w-[44px] place-items-center">{children}</span>
      <span className="text-[11.5px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,.85)]">{label}</span>
    </>
  );
  const cls = "flex w-[76px] flex-col items-center gap-1.5";
  return href ? <Link to={href} className={cls}>{inner}</Link> : <button onDoubleClick={onOpen} onClick={onOpen} className={cls}>{inner}</button>;
}

function Lock({ onEnter, now }: { onEnter: () => void; now: Date }) {
  useEffect(() => {
    const k = () => onEnter();
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [onEnter]);
  return (
    <button
      onClick={onEnter}
      className="win-desktop os-win fixed inset-0 flex w-full cursor-default flex-col items-center justify-between py-[10vh] text-white"
    >
      <Bloom />
      <span className="relative z-10 flex flex-col items-center">
        <span className="text-[88px] font-light leading-none tabular-nums">
          {new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now)}
        </span>
        <span className="pt-1 text-[19px] font-light text-white/85">
          {new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(now)}
        </span>
      </span>

      <span className="relative z-10 flex flex-col items-center">
        <span className="grid h-[86px] w-[86px] place-items-center rounded-full bg-white/85 text-[32px] font-semibold text-[#0b3d6b]">Y</span>
        <span className="pt-3 text-[15px]">Yemi Ogundairo</span>
        <span className="mt-6 rounded-full bg-black/40 px-4 py-2 text-[13px] backdrop-blur-md">
          Click anywhere or press any key to enter
        </span>
      </span>
    </button>
  );
}
