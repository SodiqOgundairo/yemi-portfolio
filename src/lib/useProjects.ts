import { useEffect, useState } from "react";
import { supabase, listProjects, assertConfigured, DISCIPLINES, type Project, type Discipline } from "./supabase";

/** A project earns its own page when there is something to read or look at.
 *  Deriving this from the content rather than a toggle means a page can never
 *  exist and be empty, and writing a brief in the admin is the whole act of
 *  publishing one. Everything else is listed as a credit and opens nothing. */
export function hasPage(p: Project, imageCount = 0) {
  return Boolean(p.body && p.body.trim().length > 0) || imageCount > 0;
}

export type Group = { discipline: Discipline; projects: Project[] };

export type ProjectsState = {
  projects: Project[];
  groups: Group[];
  /** project_id -> gallery image count */
  images: Record<string, number>;
  error: string | null;
  loaded: boolean;
};

/** Published projects plus the gallery counts needed to know which of them
 *  open a page. Two bounded reads, once, on mount: no polling, no per-row
 *  fetches, nothing that can turn into a request storm. */
export function useProjects(): ProjectsState {
  const [projects, setProjects] = useState<Project[]>([]);
  const [images, setImages] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        /* Refuse before dialling. listProjects checks too, but the images
           read below is a direct call and would otherwise fire at a host
           that cannot resolve. */
        assertConfigured();
        /* Concurrent, not sequential. The gallery counts do not depend on the
           project rows, and awaiting one before starting the other added about
           600ms to the point where the page has its content. Still two bounded
           reads, once, on mount: no polling, no per-row fetches.
           The images read is one unfiltered pass over a tiny table, which
           beats 34 filtered ones. */
        const [rows, imgs] = await Promise.all([
          listProjects({ publishedOnly: true }),
          supabase.from("images").select("project_id"),
        ]);
        if (!alive) return;
        setProjects(rows);
        const { data } = imgs;
        const counts: Record<string, number> = {};
        for (const r of (data ?? []) as { project_id: string }[]) {
          counts[r.project_id] = (counts[r.project_id] ?? 0) + 1;
        }
        setImages(counts);
      } catch (e) {
        if (alive) setError((e as Error).message);
      } finally {
        if (alive) setLoaded(true);
      }
    })();
    return () => { alive = false; };
  }, []);

  // Fixed discipline order, and a discipline with nothing published is dropped
  // rather than rendered as an empty heading.
  const groups: Group[] = DISCIPLINES
    .map((discipline) => ({
      discipline,
      projects: projects
        /* `disciplines`, not `discipline`: a project appears on every shelf
           it genuinely belongs to. Falls back to the primary for any row
           written before the column existed. */
        .filter((p) => (p.disciplines?.length ? p.disciplines : [p.discipline]).includes(discipline))
        .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort - b.sort),
    }))
    .filter((g) => g.projects.length > 0);

  return { projects, groups, images, error, loaded };
}

/** The reflection atlas holds six. Prefer featured, require a cover (a blank
 *  card contributes nothing to a reflection), then fall back to sort order. */
export function boardProjects(all: Project[], limit = 6) {
  return all
    .filter((p) => p.cover_url)
    .sort((a, b) => Number(b.featured) - Number(a.featured) || a.sort - b.sort)
    .slice(0, limit);
}
