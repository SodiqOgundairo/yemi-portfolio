import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import MenuBar from "./MenuBar";
import Dock, { type DockApp } from "./Dock";
import MacWindow from "./MacWindow";
import StageRail from "./StageRail";
import QuickLook from "./QuickLook";
import { MacIcon } from "./icons";
import { useDesktop, type AppId, type Titles } from "../desktop/useDesktop";
import { useMedia, COMPACT } from "../desktop/useMedia";
import { hasPage } from "../lib/useProjects";
import type { Project } from "../lib/supabase";

/* macOS. One of three shells over the same Supabase content: no Apple marks,
   icons or wallpaper anywhere, all drawn. The shell owns only chrome and a
   palette; the windows, apps and data are shared with Ubuntu and Windows. */

const RAIL = 128;

const TITLES: Titles = {
  finder: "Work", reader: "Reader", about: "About This Designer",
  contact: "Mail", terminal: "Terminal",
  experience: "Experience", education: "Education", skills: "Skills",
};
const APP_LABEL: Record<AppId, string> = {
  finder: "Finder", reader: "Preview", about: "About", contact: "Mail",
  terminal: "Terminal", experience: "Experience", education: "Education", skills: "Skills",
};

export default function Mac() {
  const [quick, setQuick] = useState<Project | null>(null);
  const d = useDesktop(TITLES, setQuick, "product", "mac");
  const { wins, focused, open, close, minimise, focus, move, render, images, loaded } = d;
  const [booted, setBooted] = useState(false);
  const [stage, setStage] = useState(true);
  const compact = useMedia(COMPACT);

  const dockApps: DockApp[] = [
    { id: "finder", label: "Work" },
    { id: "experience", label: "Experience" },
    { id: "education", label: "Education" },
    { id: "skills", label: "Skills" },
    { id: "terminal", label: "Terminal" },
    { id: "contact", label: "Mail" },
    { id: "about", label: "About" },
  ];

  const running = useMemo(() => new Set(wins.map((w) => (w.app === "reader" ? "finder" : w.app))), [wins]);
  const front = wins.filter((w) => !w.minimised).sort((a, b) => a.z - b.z).at(-1);
  const activeApp = front ? APP_LABEL[front.app] : "Finder";

  const activeId = front?.id ?? null;
  const staged = stage && !compact;
  const onStage = staged ? wins.filter((w) => w.id === activeId) : wins;
  const parked = staged ? wins.filter((w) => w.id !== activeId) : [];

  const placed = useRef<string | null>(null);
  useEffect(() => {
    if (!staged || !activeId || placed.current === activeId) return;
    placed.current = activeId;
    const w = wins.find((x) => x.id === activeId);
    if (!w) return;
    const x = Math.max(RAIL + 24, Math.round((window.innerWidth + RAIL - w.w) / 2));
    const y = Math.max(48, Math.round((window.innerHeight - w.h) / 2) - 20);
    if (Math.abs(w.x - x) > 2 || Math.abs(w.y - y) > 2) move(activeId, x, y);
  }, [staged, activeId, wins, move]);
  useEffect(() => { if (!staged) placed.current = null; }, [staged]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (!(e.metaKey || e.ctrlKey)) return;
      const k = e.key.toLowerCase();
      if (k === "w" && front) { e.preventDefault(); close(front.id); }
      if (k === "m" && front) { e.preventDefault(); minimise(front.id); }
      if (k === "n") { e.preventDefault(); open("finder"); }
      if (k === "t") { e.preventDefault(); open("terminal"); }
      if (k === "q" && e.ctrlKey) { e.preventDefault(); setBooted(false); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  });

  useEffect(() => {
    if (booted && loaded && wins.length === 0) open("finder");
  }, [booted, loaded]); // eslint-disable-line react-hooks/exhaustive-deps

  const act = useCallback((a: { type: string; id?: string }) => {
    switch (a.type) {
      case "about": case "terminal": case "finder": case "contact":
      case "experience": case "education": case "skills":
        open(a.type as AppId); break;
      case "home": window.location.assign("/"); break;
      case "shell": if (a.id) window.location.assign(a.id); break;
      case "github": window.open("https://github.com/SodiqOgundairo", "_blank", "noreferrer"); break;
      case "lock": setBooted(false); break;
      case "toggle-stage": setStage((v) => !v); break;
      case "close": if (front) close(front.id); break;
      case "close-all": wins.forEach((w) => close(w.id)); break;
      case "minimise": if (front) minimise(front.id); break;
      case "focus": if (a.id) focus(a.id); break;
    }
  }, [open, close, minimise, focus, front, wins]);

  if (!booted) return <Lock onEnter={() => setBooted(true)} />;

  return (
    <div className="mac-desktop os-mac fixed inset-0 select-none overflow-hidden">
      <MenuBar appName={activeApp} wins={wins} stage={stage} onAction={act} />

      <div className="absolute right-5 top-11 flex flex-col items-center gap-5">
        <DesktopIcon label="Work" onOpen={() => open("finder")} app="finder" />
        <DesktopIcon label="Main site" href="/" app="globe" />
      </div>

      {compact ? (
        <div className="absolute inset-x-0 bottom-[86px] top-[30px]">
          {front ? (
            <div role="dialog" aria-label={front.title}
                 className="mac-win absolute inset-2 flex flex-col overflow-hidden rounded-[12px] border border-white/15">
              <div className="flex h-[38px] shrink-0 items-center gap-2 border-b border-black/30 bg-[#3a3a3c]/85 px-3 backdrop-blur-xl">
                <button onClick={() => close(front.id)} aria-label="Close" className="h-3 w-3 rounded-full bg-[#ff5f57]" />
                <span className="flex-1 truncate text-center text-[13px] font-medium text-white/90">{front.title}</span>
                <span className="w-3" />
              </div>
              <div className="mac-win-body min-h-0 flex-1 overflow-y-auto">{render(front)}</div>
            </div>
          ) : (
            <p className="grid h-full place-items-center px-8 text-center text-[13px] text-white/50">
              Tap an app in the dock to begin.
            </p>
          )}
        </div>
      ) : (
        <>
          {staged && parked.length > 0 && <StageRail wins={parked} onPick={focus} />}
          {onStage.map((w) => (
            <MacWindow
              key={w.id} win={w} active={focused === w.id}
              onFocus={() => focus(w.id)} onClose={() => close(w.id)}
              onMinimise={() => minimise(w.id)} onMoved={(x, y) => move(w.id, x, y)}
            >
              {render(w)}
            </MacWindow>
          ))}
        </>
      )}

      {quick && (
        <QuickLook
          project={quick}
          canOpen={hasPage(quick, images[quick.id] ?? 0)}
          onOpen={() => { d.openReader(quick.slug, quick.title); setQuick(null); }}
          onClose={() => setQuick(null)}
        />
      )}

      <Dock apps={dockApps} running={running} onOpen={(id) => open(id)} />
    </div>
  );
}

function Lock({ onEnter }: { onEnter: () => void }) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 10000);
    const k = () => onEnter();
    window.addEventListener("keydown", k);
    return () => { clearInterval(t); window.removeEventListener("keydown", k); };
  }, [onEnter]);
  return (
    <button onClick={onEnter}
      className="mac-desktop fixed inset-0 flex w-full cursor-default flex-col items-center justify-center gap-1 text-white">
      <span className="text-[76px] font-semibold leading-none tracking-tight tabular-nums">
        {new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(now)}
      </span>
      <span className="text-[17px] text-white/85">
        {new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long" }).format(now)}
      </span>
      <span className="mt-14 grid h-[84px] w-[84px] place-items-center rounded-full bg-white/85 text-[32px] font-semibold text-black">Y</span>
      <span className="pt-3 text-[15px] font-medium">Yemi Ogundairo</span>
      <span className="mt-6 rounded-full bg-black/35 px-4 py-2 text-[13px] backdrop-blur-md">
        Click anywhere or press any key to enter
      </span>
    </button>
  );
}

function DesktopIcon({ label, onOpen, href, app }: { label: string; onOpen?: () => void; href?: string; app: "finder" | "globe" }) {
  const inner = (
    <>
      <span className="drop-shadow-lg"><MacIcon app={app} size={52} /></span>
      <span className="rounded px-1.5 text-[11px] text-white [text-shadow:0_1px_3px_rgba(0,0,0,.8)]">{label}</span>
    </>
  );
  const cls = "flex w-[74px] flex-col items-center gap-1.5";
  return href ? <Link to={href} className={cls}>{inner}</Link> : <button onDoubleClick={onOpen} onClick={onOpen} className={cls}>{inner}</button>;
}
