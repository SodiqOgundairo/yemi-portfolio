import { useCallback, useMemo } from "react";
import { useProjects, hasPage } from "../lib/useProjects";
import { useAbout } from "./useAbout";
import { useWindows, type AppId, type Titles, type Win } from "./useWindows";
import { Finder, Reader, Mail, Terminal, type Shell } from "./apps";
import { Experience, Education, Skills, Summary } from "./panes";
import type { Project } from "../lib/supabase";

/* Everything the three shells have in common: the data, the window manager,
   and which component answers for which app. A shell is then only chrome,
   which is the whole reason a second and third one is affordable. */
export function useDesktop(
  titles: Titles,
  onQuickLook: (p: Project) => void,
  defaultScope: "all" | "product" | "brand" | "engineering" = "all",
  shell: Shell = "mac",
) {
  const { projects, groups, images, loaded } = useProjects();
  const about = useAbout();
  const wm = useWindows(titles);

  const openReader = useCallback(
    (slug: string, title: string) => wm.open("reader", { slug, title }),
    [wm],
  );

  const counts = useMemo(() => ({
    total: projects.length,
    open: projects.filter((p) => hasPage(p, images[p.id] ?? 0)).length,
    disciplines: groups.length,
  }), [projects, images, groups]);

  const render = useCallback((w: Win) => {
    switch (w.app) {
      case "finder": return <Finder groups={groups} images={images} onOpen={openReader} onQuickLook={onQuickLook} defaultScope={defaultScope} shell={shell} />;
      case "reader": return <Reader slug={w.slug!} />;
      case "about": return <Summary rows={about.of("summary")} counts={counts} />;
      case "experience": return <Experience rows={about.of("experience")} />;
      case "education": return <Education rows={about.of("education")} teaching={about.of("teaching")} />;
      case "skills": return <Skills rows={about.of("skills")} />;
      case "contact": return <Mail />;
      case "terminal": return <Terminal groups={groups} onOpen={openReader} />;
    }
  }, [groups, images, openReader, onQuickLook, about, counts, defaultScope, shell]);

  return { ...wm, projects, groups, images, loaded, counts, about, openReader, render };
}

export type { AppId, Win, Titles };
