import type { Project } from "./supabase";
import type { Group } from "./useProjects";

/* Fixtures exist so the templates can be judged against the EXTREMES rather
   than a comfortable average. Designing against imaginary typical content is
   how a layout breaks the first time a real title runs to sixty characters or
   a project turns up with no cover.
   Dev only: the /preview route is stripped from the production build. */

const base: Project = {
  id: "fixture", slug: "fixture", title: "", discipline: "product", disciplines: ["product"],
  role: null, summary: null, body: null, stack: [], metrics: {},
  live_url: null, repo_url: null, cover_url: null, year: null, kind: null,
  featured: false, sort: 0, published: true,
};

const make = (over: Partial<Project>): Project => ({ ...base, ...over });

/** Floor: the least content a page can be built from and still look deliberate. */
export const minimal = make({
  slug: "minimal", title: "Brief", discipline: "brand", disciplines: ["brand"],
  body: "A short note on a piece of work that does not need a full case study. Two sentences and a link is a complete thought, and the page should look finished at that length rather than empty.",
});

export const typical = make({
  slug: "typical", title: "Flock", discipline: "product", disciplines: ["product"], year: 2025,
  role: "Lead Product Designer",
  summary: "A rota and shift-swap tool for hospitality teams who were running the whole thing on a group chat.",
  stack: ["React", "TypeScript", "Supabase", "Tailwind"],
  live_url: "https://example.com",
  metrics: { venues: 12, shifts_filled: 4180 },
  cover_url: null,
  body: [
    "The brief arrived as a complaint rather than a spec. Shift swaps were happening in a group chat, the rota lived in a spreadsheet, and nobody could tell which of the two was true on any given morning.",
    "## What was actually wrong",
    "Two sources of truth is not a feature gap, it is a trust problem. Staff checked the chat because the sheet was stale, and managers rewrote the sheet because the chat was noise.",
    "- One rota, one state, visible to everyone\n- A swap is a request against that state, never a message\n- The manager approves or it does not happen",
    "Collapsing it to a single object meant the interface could be almost nothing: a week, a set of shifts, and a request queue.",
    "The result held because the model was right, not because the screens were clever.",
  ].join("\n\n"),
});

/** Ceiling: the longest title, role and body the contract permits, plus a full
 *  metric row and a gallery. If this reads, nothing real can break it. */
export const maximal = make({
  slug: "maximal", discipline: "engineering", disciplines: ["engineering"], year: 2024,
  title: "Gr8QM Technovates Learning Platform",
  role: "Design Engineer and Lead Front-end",
  summary:
    "A fourteen-module multi-tenant SaaS covering admissions, timetabling, assessment and reporting, designed and built as one system rather than fourteen features bolted to a shared login.",
  stack: ["React", "TypeScript", "Supabase", "Tailwind", "Motion"],
  live_url: "https://example.com",
  repo_url: "https://example.com",
  metrics: { modules: 14, tenants: 6, active_users: 2840, uptime: "99.9%" },
  cover_url: null,
  body: Array.from({ length: 9 }, (_, i) =>
    i === 2
      ? "## The part that decided everything"
      : i === 5
        ? "- Tenancy resolved once, at the edge\n- Every module reads the same permission set\n- No module owns its own navigation"
        : "Fourteen modules is not fourteen products. The moment each one is allowed its own navigation, its own permission model and its own idea of what a term is, the platform stops being a platform and becomes a folder of applications that happen to share a domain name. Most of the work was refusing that, repeatedly, in small decisions nobody would notice if it went right.",
  ).join("\n\n"),
});

export const cases = { minimal, typical, maximal } as const;
export type CaseName = keyof typeof cases;

/** Index extremes: a long title, a row with no role and no year, and a mix of
 *  openable and inert so the two tiers can be compared side by side. */
export const fixtureGroups: Group[] = [
  {
    discipline: "product",
    projects: [
      make({ id: "f1", slug: "maximal", title: "Gr8QM Technovates Learning Platform", role: "Design Engineer and Lead Front-end", year: 2024, body: "x" }),
      make({ id: "f2", slug: "typical", title: "Flock", role: "Lead Product Designer", year: 2025, body: "x" }),
      make({ id: "f3", slug: "n1", title: "A Project With No Role And No Year At All" }),
      make({ id: "f4", slug: "n2", title: "OutOut", role: "Product Designer", year: 2024, summary: "Events and social for people who make plans badly. Listed as a credit until there is something worth reading." }),
    ],
  },
  {
    discipline: "brand",
    projects: [
      make({ id: "f5", slug: "minimal", title: "Brief", discipline: "brand", disciplines: ["brand"], year: 2023, body: "x" }),
      make({ id: "f6", slug: "n3", title: "Identity Work", discipline: "brand", disciplines: ["brand"] }),
    ],
  },
];
