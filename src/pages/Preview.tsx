import { useState } from "react";
import { Link } from "react-router-dom";
import { ProjectView } from "./Project";
import WorkIndex from "../ui/WorkIndex";
import { cases, fixtureGroups, type CaseName } from "../lib/fixtures";

/* Dev-only harness. Every template rendered against its floor and its ceiling,
   so the design can be settled before the content exists and content can then
   be poured in without moving anything. */

const TABS = ["index", "minimal", "typical", "maximal"] as const;
type Tab = (typeof TABS)[number];

export default function Preview() {
  const [tab, setTab] = useState<Tab>("index");

  return (
    <div className="min-h-[100svh] bg-void">
      <div className="fixed inset-x-0 top-0 z-50 flex flex-wrap items-center gap-2 border-b border-edge bg-ash px-gutter py-3">
        <span className="hud pr-3 text-bone">Fixtures</span>
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`hud border px-3 py-1.5 transition-colors ${
              tab === t ? "border-bone text-bone" : "border-edge hover:text-ghost"
            }`}
          >
            {t}
          </button>
        ))}
        <span className="flex-1" />
        <Link to="/" className="hud transition-colors hover:text-bone">Exit ↗</Link>
      </div>

      <div className="pt-16">
        {tab === "index" ? (
          <div className="mx-auto max-w-6xl px-gutter pb-32 pt-10">
            <WorkIndex groups={fixtureGroups} images={{}} total={6} />
          </div>
        ) : (
          <ProjectView p={cases[tab as CaseName]} imgs={[]} onWork={() => setTab("index")} />
        )}
      </div>
    </div>
  );
}
