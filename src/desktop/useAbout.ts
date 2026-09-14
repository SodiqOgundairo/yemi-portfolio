import { useEffect, useState } from "react";
import { listAbout, type About } from "../lib/supabase";

/** Kept as an alias so the shells and the landing page carry on importing
 *  `AboutRow` from here, while the shape has exactly one definition, next to
 *  the queries that write it. */
export type AboutRow = About;

/** The person, as opposed to the work. Lives in Supabase for the same reason
 *  the projects do: it has to be editable without a deploy, and it feeds the
 *  main site and all three shells from one place. */
export function useAbout() {
  const [rows, setRows] = useState<AboutRow[]>([]);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let alive = true;
    listAbout({ publishedOnly: true })
      .then((r) => { if (alive) { setRows(r); setLoaded(true); } })
      /* A read failure must not hold the page in a loading state forever:
         every consumer renders nothing when there are no rows. */
      .catch(() => { if (alive) setLoaded(true); });
    return () => { alive = false; };
  }, []);
  const of = (k: AboutRow["kind"]) => rows.filter((r) => r.kind === k);
  return { rows, loaded, of };
}
