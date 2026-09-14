import { useEffect } from "react";
import { DISCIPLINE_LABEL, type Project } from "../lib/supabase";

/* Quick Look. Space opens it on the selected item, space or escape closes it,
   and it never navigates: the whole point is to look without committing, which
   is exactly what a portfolio index needs and what the main site does with its
   hover preview. */
export default function QuickLook({
  project, canOpen, onOpen, onClose,
}: {
  project: Project; canOpen: boolean;
  onOpen: () => void; onClose: () => void;
}) {
  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.code === "Space") { e.preventDefault(); onClose(); }
      if (e.key === "Enter" && canOpen) { e.preventDefault(); onOpen(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose, onOpen, canOpen]);

  const metrics = Object.entries(project.metrics ?? {});

  return (
    <div
      className="fixed inset-0 z-[9700] grid place-items-center bg-black/45 p-6 backdrop-blur-[2px]"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-label={`Preview of ${project.title}`}
        onClick={(e) => e.stopPropagation()}
        className="ql-pop flex max-h-full w-full max-w-[620px] flex-col overflow-hidden rounded-[12px] border border-white/15 bg-[#232325]/90 shadow-[0_40px_90px_-20px_rgba(0,0,0,.8)] backdrop-blur-2xl"
      >
        <div className="flex h-[38px] shrink-0 items-center gap-2 border-b border-white/10 px-3">
          <button onClick={onClose} aria-label="Close preview"
            className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <span className="flex-1 truncate text-center text-[13px] font-medium text-white/90">{project.title}</span>
          <span className="w-3" />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {project.cover_url ? (
            <img src={project.cover_url} alt="" className="max-h-[300px] w-full object-cover" />
          ) : (
            <div className="grid h-[130px] place-items-center bg-white/[0.04] text-[12px] text-white/30">
              No preview image
            </div>
          )}
          <div className="px-5 py-4 text-[13px]">
            <p className="text-[11px] uppercase tracking-[0.16em] text-white/40">
              {DISCIPLINE_LABEL[project.discipline]}{project.role ? ` · ${project.role}` : ""}
            </p>
            {project.summary && <p className="pt-2 leading-relaxed text-white/75">{project.summary}</p>}
            {!!metrics.length && (
              <dl className="grid grid-cols-2 gap-3 pt-4 sm:grid-cols-4">
                {metrics.map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-[17px] font-semibold text-white">
                      {typeof v === "number" ? v.toLocaleString("en-GB") : String(v)}
                    </dt>
                    <dd className="text-[10px] uppercase tracking-wider text-white/40">{k.replace(/_/g, " ")}</dd>
                  </div>
                ))}
              </dl>
            )}
            {!!project.stack.length && (
              <p className="pt-4 text-[12px] text-white/45">{project.stack.join(" · ")}</p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 items-center justify-between border-t border-white/10 px-4 py-2.5">
          <span className="text-[11px] text-white/35">Space or Esc to close</span>
          {canOpen ? (
            <button onClick={onOpen} className="rounded-[6px] bg-[#0a58ca] px-4 py-1.5 text-[13px] text-white hover:bg-[#0b62e0]">
              Open
            </button>
          ) : (
            <span className="text-[11px] text-white/35">No case study written yet</span>
          )}
        </div>
      </div>
    </div>
  );
}
