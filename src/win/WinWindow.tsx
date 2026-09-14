import type { ReactNode } from "react";
import { useDrag } from "../desktop/useDrag";
import type { Win } from "../desktop/useWindows";

/** Windows 11 chrome: icon and title on the LEFT, and square-cornered
 *  minimise / maximise / close hit areas on the right with close turning red.
 *  Those two things are the whole tell. */
export default function WinWindow({
  win, active, icon, onFocus, onClose, onMinimise, onMoved, children,
}: {
  win: Win; active: boolean; icon: ReactNode;
  onFocus: () => void; onClose: () => void; onMinimise: () => void;
  onMoved: (x: number, y: number) => void; children: ReactNode;
}) {
  const { el, bar } = useDrag(win, onFocus, onMoved);
  return (
    <div
      ref={el}
      role="dialog"
      aria-label={win.title}
      onPointerDown={onFocus}
      hidden={win.minimised}
      className={`absolute left-0 top-0 flex flex-col overflow-hidden rounded-[8px] border bg-[var(--os-bg)] text-[var(--os-text)] ${
        active ? "border-white/20 shadow-[0_28px_64px_-14px_rgba(0,0,0,.72)]"
               : "border-white/10 shadow-[0_14px_34px_-16px_rgba(0,0,0,.55)]"
      }`}
      style={{ width: win.w, height: win.h, zIndex: win.z }}
    >
      <div {...bar}
        className={`flex h-[32px] shrink-0 cursor-default select-none items-center ${active ? "bg-[#2b2b2b]" : "bg-[#242424]"}`}>
        <span className="flex min-w-0 flex-1 items-center gap-2 pl-3">
          <span className="grid h-[15px] w-[15px] shrink-0 place-items-center">
            <span className="scale-[0.55]">{icon}</span>
          </span>
          <span className={`truncate text-[12.5px] ${active ? "" : "opacity-50"}`}>{win.title}</span>
        </span>
        <span className="flex h-full items-stretch" data-no-drag>
          <button onClick={onMinimise} aria-label={`Minimise ${win.title}`}
            className="grid w-[46px] place-items-center text-[10px] hover:bg-white/[0.06]">\u2500</button>
          <button aria-label="Maximise unavailable" disabled title="Maximise unavailable"
            className="grid w-[46px] place-items-center text-[10px] opacity-35">\u2610</button>
          <button onClick={onClose} aria-label={`Close ${win.title}`}
            className="grid w-[46px] place-items-center text-[10px] hover:bg-[#C42B1C] hover:text-white">\u2715</button>
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
