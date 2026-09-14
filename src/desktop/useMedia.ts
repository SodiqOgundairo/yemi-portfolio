import { useEffect, useState } from "react";

/** Shared by all three shells so "what counts as a phone" is decided once. */
export function useMedia(q: string) {
  const [on, setOn] = useState(() => typeof window !== "undefined" && window.matchMedia(q).matches);
  useEffect(() => {
    const m = window.matchMedia(q);
    const h = () => setOn(m.matches);
    m.addEventListener("change", h);
    return () => m.removeEventListener("change", h);
  }, [q]);
  return on;
}

export const COMPACT = "(max-width: 720px)";
