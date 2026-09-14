import type { ReactNode } from "react";
import { useDrag } from "../desktop/useDrag";
import type { Win } from "../desktop/useWindows";

/** macOS chrome: traffic lights left, centred title, heavy shadow. */
export default function MacWindow({
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
      className={`mac-win absolute left-0 top-0 flex flex-col overflow-hidden rounded-[10px] border ${
        active ? "border-white/20 shadow-[0_28px_70px_-12px_rgba(0,0,0,.7)]"
               : "border-white/10 shadow-[0_16px_40px_-16px_rgba(0,0,0,.6)]"
      }`}
      style={{ width: win.w, height: win.h, zIndex: win.z }}
    >
      <div {...bar}
        className="flex h-[32px] shrink-0 cursor-default select-none items-center border-b border-black/30 bg-[#404040]/[0.773] pl-[9px] pr-3 backdrop-blur-xl">
        {/* 14pt circles on a 23pt pitch, so a 9pt gap between them */}
        <span className="flex items-center gap-[9px]" data-no-drag>
          <button onClick={onClose} aria-label={`Close ${win.title}`}
            className="group grid h-[14px] w-[14px] place-items-center rounded-full bg-[#ff5f57]">
            <span className="text-[8px] leading-none text-black/60 opacity-0 group-hover:opacity-100">✕</span>
          </button>
          <button onClick={onMinimise} aria-label={`Minimise ${win.title}`}
            className="group grid h-[14px] w-[14px] place-items-center rounded-full bg-[#febc2e]">
            <span className="text-[9px] leading-none text-black/60 opacity-0 group-hover:opacity-100">−</span>
          </button>
          <span className="h-[14px] w-[14px] rounded-full bg-[#28c840]/40" title="Zoom unavailable" />
        </span>
        <span className={`flex-1 truncate text-center text-[13px] font-bold tracking-[-0.006em] ${active ? "text-white/[0.847]" : "text-white/40"}`}>
          {win.title}
        </span>
        <span className="w-[61px]" />
      </div>
      <div className="mac-win-body min-h-0 flex-1 overflow-y-auto">{children}</div>
    </div>
  );
}
