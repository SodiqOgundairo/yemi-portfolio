import { DISCIPLINE_LABEL, DISCIPLINES, type Project } from "./supabase";
import type { ReactNode } from "react";

/* A deliberately tiny subset, not a markdown library.
 *
 *   ## heading
 *   - bullet
 *   **bold**
 *   blank line = new paragraph
 *
 * The case study body is written by one person in a textarea. A parser this
 * size cannot produce a layout the template has not been designed for, which
 * is the whole reason for the content contract: nothing arrives in a shape
 * the page cannot hold. */

function inline(text: string, key: string): ReactNode[] {
  return text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g).map((part, i) => {
    const k = `${key}-${i}`;
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={k}>{part.slice(2, -2)}</strong>;
    // backticks were rendering as literal characters in the body copy
    if (part.startsWith("`") && part.endsWith("`")) return <code key={k}>{part.slice(1, -1)}</code>;
    return <span key={k}>{part}</span>;
  });
}

/** Draft notes are opt-in, via `?notes` on any case study URL in dev.
 *  Read per call rather than cached so toggling needs a reload, not a
 *  restart. Guarded because this also runs where there is no window. */
function showDraftNotes() {
  if (typeof window === "undefined") return false;
  try { return new URLSearchParams(window.location.search).has("notes"); }
  catch { return false; }
}

export function renderBody(body: string): ReactNode[] {
  return body
    .trim()
    .split(/\n{2,}/)
    .filter(Boolean)
    .map((block, i) => {
      const key = `b${i}`;
      const lines = block.split("\n").map((l) => l.trim()).filter(Boolean);

      /* An open question to the author, left in a draft where only he can
         answer it. Marked so sixty of them across thirty projects can be
         found and cleared, and it disappears from the page the moment the
         paragraph is deleted. */
      if (lines[0]?.startsWith("[YEMI:")) {
        /* Questions to the author. They were rendering on all ten published
           case studies (/work/lightlife showed three, labelled "NEEDS YOU")
           so they are now OFF by default everywhere, and returning null keeps
           the text out of the DOM rather than merely hiding it.

           They are still the record of what each case study is missing, so
           they are not deleted: append ?notes to any URL in dev to read them
           again when there is time to answer them. Production never shows
           them, with or without the flag. */
        if (!import.meta.env.DEV || !showDraftNotes()) return null;
        return <p key={key} className="draft-note">{inline(lines.join(" ").replace(/^\[YEMI:\s*/, "").replace(/\]$/, ""), key)}</p>;
      }
      if (lines[0]?.startsWith("## ")) {
        return <h2 key={key}>{inline(lines[0].slice(3), key)}</h2>;
      }
      if (lines.every((l) => l.startsWith("- "))) {
        return (
          <ul key={key}>
            {lines.map((l, j) => <li key={`${key}-${j}`}>{inline(l.slice(2), `${key}-${j}`)}</li>)}
          </ul>
        );
      }
      return <p key={key}>{inline(lines.join(" "), key)}</p>;
    });
}

/** Rough reading time, floored at one minute so a two-line brief does not
 *  claim "0 min read". */
export function readingTime(body: string) {
  return Math.max(1, Math.round(body.trim().split(/\s+/).length / 220));
}

/* Every discipline a project belongs to, not just the primary one.
   Showing only `discipline` meant 19 of the 24 projects in the Engineering
   folder announced themselves as Product & UI, because the folders filter on
   `disciplines` while the label read the singular field beside it. */
export function disciplinesOf(p: Pick<Project, "discipline" | "disciplines">) {
  const list = p.disciplines?.length ? p.disciplines : [p.discipline];
  // the primary leads, the rest follow in the canonical order
  const ordered = [p.discipline, ...DISCIPLINES.filter((d) => d !== p.discipline)]
    .filter((d) => list.includes(d));
  return ordered.map((d) => DISCIPLINE_LABEL[d]).join(" · ");
}

/* A reading time only earns its place when it varies. 33 of 38 briefs round
   to "1 min" because of the floor in readingTime, so below two minutes it is
   a constant pretending to be information. */
export function readingLabel(body: string | null) {
  if (!body?.trim()) return null;
  const mins = readingTime(body);
  return mins >= 2 ? `${mins} min` : null;
}
