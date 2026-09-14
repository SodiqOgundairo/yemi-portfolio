import { useCallback, useRef, useState } from "react";

export type AppId =
  | "finder" | "reader" | "about" | "contact" | "terminal"
  | "experience" | "education" | "skills";

export type Win = {
  id: string;
  app: AppId;
  title: string;
  /** reader only: which project slug to show */
  slug?: string;
  x: number; y: number; w: number; h: number;
  z: number;
  minimised: boolean;
};

/* Each shell names its own apps: Finder, Files and File Explorer are the same
   window with a different label, and getting that wrong is the first thing
   anyone who uses the real OS would notice. */
export type Titles = Record<AppId, string>;

/* Window management, deliberately small. Position and size live here because
   they have to survive a re-render; the DRAG itself does not go through React
   at all (see Window.tsx) or every pointermove would re-render the desktop. */
export function useWindows(TITLES: Titles) {
  const [wins, setWins] = useState<Win[]>([]);
  const [focused, setFocused] = useState<string | null>(null);
  const zTop = useRef(10);
  const opened = useRef(0);

  const focus = useCallback((id: string) => {
    zTop.current += 1;
    const z = zTop.current;
    setWins((w) => w.map((x) => (x.id === id ? { ...x, z, minimised: false } : x)));
    setFocused(id);
  }, []);

  const open = useCallback((app: AppId, opts: { slug?: string; title?: string } = {}) => {
    // one window per project, and one per single-instance app
    const key = app === "reader" ? `reader:${opts.slug}` : app;
    let existing: Win | undefined;
    setWins((w) => {
      existing = w.find((x) => x.id === key);
      if (existing) return w;
      zTop.current += 1;
      const n = opened.current++;
      const vw = window.innerWidth, vh = window.innerHeight;
      /* Finder is the app people actually read in, so it opens larger than
         the rest. Not maximised: a window that fills the screen stops
         reading as a window. */
      const wide = app === "reader" || app === "finder";
      const width = Math.min(wide ? 1010 : 560, vw - 48);
      const height = Math.min(wide ? 700 : 460, vh - 130);
      return [...w, {
        id: key, app, title: opts.title ?? TITLES[app], slug: opts.slug,
        // cascade, then wrap, so windows never stack exactly
        x: Math.max(16, Math.min(vw - width - 16, 90 + (n % 5) * 34)),
        y: Math.max(44, Math.min(vh - height - 100, 74 + (n % 5) * 30)),
        w: width, h: height, z: zTop.current, minimised: false,
      }];
    });
    // focus whether it was new or already open
    requestAnimationFrame(() => focus(key));
  }, [focus, TITLES]);

  const close = useCallback((id: string) => {
    setWins((w) => w.filter((x) => x.id !== id));
    setFocused((f) => (f === id ? null : f));
  }, []);

  const minimise = useCallback((id: string) => {
    setWins((w) => w.map((x) => (x.id === id ? { ...x, minimised: true } : x)));
    setFocused((f) => (f === id ? null : f));
  }, []);

  const move = useCallback((id: string, x: number, y: number) => {
    setWins((w) => w.map((v) => (v.id === id ? { ...v, x, y } : v)));
  }, []);

  return { wins, focused, open, close, minimise, focus, move };
}
