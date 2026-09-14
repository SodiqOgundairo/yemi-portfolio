import { useEffect, useRef, type ReactNode } from "react";

export type Item =
  | { kind: "divider" }
  | { kind?: "item"; label: string; hint?: string; disabled?: boolean; checked?: boolean; onSelect?: () => void };

/* One dropdown primitive for every menu on the bar.
 *
 * The behaviour people notice is the handover: once one menu is open, moving
 * the pointer across the bar opens the next without a second click. That is
 * why `open` and `setOpen` are owned by the bar rather than by each menu. */
export default function Menu({
  id, label, items, open, setOpen, align = "left", children, width = 210,
}: {
  id: string; label?: string; items: Item[];
  open: string | null; setOpen: (v: string | null) => void;
  align?: "left" | "right"; children?: ReactNode; width?: number;
}) {
  const isOpen = open === id;
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const away = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(null);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(null);
    // pointerdown, not click: matches the bar closing the instant you press
    document.addEventListener("pointerdown", away);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", away);
      document.removeEventListener("keydown", esc);
    };
  }, [isOpen, setOpen]);

  return (
    <div ref={ref} className="relative">
      <button
        onPointerDown={(e) => { e.preventDefault(); setOpen(isOpen ? null : id); }}
        onPointerEnter={() => open && !isOpen && setOpen(id)}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        className={`flex h-[28px] items-center gap-1.5 rounded-[5px] px-2.5 ${
          isOpen ? "bg-white/22" : "hover:bg-white/10"
        }`}
      >
        {children}
        {label && <span>{label}</span>}
      </button>

      {isOpen && (
        <div
          role="menu"
          style={{ width }}
          className={`absolute top-[26px] z-[9500] overflow-hidden rounded-[10px] border border-white/15 bg-[#2F2F2F]/[0.668] py-[5px] px-1.5 shadow-[0_18px_50px_-10px_rgba(0,0,0,.75)] backdrop-blur-2xl ${
            align === "right" ? "right-0" : "left-0"
          }`}
        >
          {items.map((it, i) =>
            "kind" in it && it.kind === "divider" ? (
              <div key={i} className="my-[5px] h-px bg-white/12" />
            ) : (
              <button
                key={i}
                role="menuitem"
                disabled={(it as { disabled?: boolean }).disabled}
                onClick={() => { (it as { onSelect?: () => void }).onSelect?.(); setOpen(null); }}
                className="flex h-[24px] w-full items-center gap-2 rounded-[4px] px-2.5 text-left text-[13px] text-white/90 disabled:text-white/25 enabled:hover:bg-[var(--os-menu-sel)] enabled:hover:text-white"
              >
                <span className="w-3 shrink-0 text-[11px]">
                  {(it as { checked?: boolean }).checked ? "✓" : ""}
                </span>
                <span className="flex-1 truncate">{(it as { label: string }).label}</span>
                {(it as { hint?: string }).hint && (
                  <span className="shrink-0 text-white/35">{(it as { hint?: string }).hint}</span>
                )}
              </button>
            ),
          )}
        </div>
      )}
    </div>
  );
}
