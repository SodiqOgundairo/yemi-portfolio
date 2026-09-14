import { useRef } from "react";
import { MacIcon } from "./icons";
import type { AppId } from "../desktop/useWindows";

/* Magnification is the detail everyone notices if it is missing and nobody
   can name if it is there. Done on pointermove against each icon's centre and
   written straight to the node, so the neighbours swell too. */

export type DockApp = { id: Exclude<AppId, "reader">; label: string };

export default function Dock({
  apps, running, onOpen,
}: { apps: DockApp[]; running: Set<string>; onOpen: (id: AppId) => void }) {
  const bar = useRef<HTMLDivElement>(null);

  const magnify = (e: React.PointerEvent) => {
    const b = bar.current;
    if (!b || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    for (const node of Array.from(b.querySelectorAll<HTMLElement>("[data-icon]"))) {
      const r = node.getBoundingClientRect();
      const d = Math.abs(e.clientX - (r.left + r.width / 2));
      const k = Math.max(0, 1 - d / 150);
      node.style.transform = `scale(${(1 + k * k * 0.55).toFixed(3)}) translateY(${(-k * k * 9).toFixed(1)}px)`;
    }
  };
  const reset = () => {
    for (const node of Array.from(bar.current?.querySelectorAll<HTMLElement>("[data-icon]") ?? []))
      node.style.transform = "";
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-[8000] flex justify-center pb-2">
      <div ref={bar} onPointerMove={magnify} onPointerLeave={reset}
        className="pointer-events-auto flex items-end gap-2 rounded-[20px] border border-white/15 bg-white/10 px-2.5 py-2 shadow-[0_12px_40px_-8px_rgba(0,0,0,.6)] backdrop-blur-2xl">
        {apps.map((a) => (
          <button key={a.id} onClick={() => onOpen(a.id)} title={a.label} aria-label={a.label}
            className="group relative flex flex-col items-center">
            <span data-icon className="block origin-bottom drop-shadow-lg transition-transform duration-100 ease-out">
              <MacIcon app={a.id} size={52} />
            </span>
            <span className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md bg-black/75 px-2 py-1 text-[12px] text-white opacity-0 backdrop-blur transition-opacity group-hover:opacity-100">
              {a.label}
            </span>
            <span className={`mt-1 h-1 w-1 rounded-full bg-white/80 ${running.has(a.id) ? "" : "opacity-0"}`} />
          </button>
        ))}
      </div>
    </div>
  );
}
