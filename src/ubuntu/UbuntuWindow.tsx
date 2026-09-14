import type { ReactNode } from "react";
import { useDrag } from "../desktop/useDrag";
import type { Win } from "../desktop/useWindows";

/** GNOME/Yaru chrome: a tall headerbar, bold centred title, round grey window
 *  controls on the RIGHT. The controls being on the right rather than the left
 *  is the single fastest way to tell a GNOME window from a Mac one. */
export default function UbuntuWindow({
  win, active, onFocus, onClose, onMinimise, onMoved, children,
}: {
  win: Win; active: boolean;
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
      className={`absolute left-0 top-0 flex flex-col overflow-hidden rounded-[12px] border bg-[var(--os-bg)] text-[var(--os-text)] ${
        active ? "border-black/60 shadow-[0_30px_70px_-14px_rgba(0,0,0,.75)]"
               : "border-black/40 shadow-[0_14px_36px_-16px_rgba(0,0,0,.6)]"
      }`}
      style={{ width: win.w, height: win.h, zIndex: win.z }}
    >
      <div {...bar}
        className={`flex h-[47px] shrink-0 cursor-default select-none items-center gap-2 border-b border-black/40 px-3 ${
          active ? "bg-[#3b3234]" : "bg-[#2c2628]"
        }`}>
        <span className="w-[76px]" />
        <span className={`flex-1 truncate text-center text-[14.7px] font-bold ${active ? "" : "opacity-45"}`}>
          {win.title}
        </span>
        <span className="flex items-center gap-2" data-no-drag>
          <button onClick={onMinimise} aria-label={`Minimise ${win.title}`}
            className="grid h-[26px] w-[26px] place-items-center rounded-full bg-white/10 text-[13px] leading-none hover:bg-white/20">−</button>
          <button aria-label="Maximise unavailable" disabled title="Maximise unavailable"
            className="grid h-[26px] w-[26px] place-items-center rounded-full bg-white/[0.06] text-[10px] leading-none opacity-40">□</button>
          <button onClick={onClose} aria-label={`Close ${win.title}`}
            className="grid h-[26px] w-[26px] place-items-center rounded-full bg-white/10 text-[12px] leading-none hover:bg-[var(--os-accent)]">✕</button>
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
