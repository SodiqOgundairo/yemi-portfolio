import { Link } from "react-router-dom";
import { DISCIPLINE_LABEL, type Discipline } from "../lib/supabase";

/* The doors. Three ways into the same work, and each one is named for the
   DISCIPLINE it holds rather than for the desktop it imitates: Yemi's call,
   14/09/2026, on top of the standing rule never to name an operating system
   in copy. The drawn thumbnail already tells you the three are different
   environments, so the words do not have to.

   Each still carries everything and merely opens on its own discipline, so
   nobody is ever shown a third of the portfolio. */

const SHELLS: { to: string; holds: Discipline; chrome: React.ReactNode; tint: string }[] = [
  { to: "/mac", holds: "product",
    chrome: <MacChrome />, tint: "linear-gradient(150deg,#241a4a,#14102c 60%,#0c0a1c)" },
  { to: "/ubuntu", holds: "engineering",
    chrome: <UbuntuChrome />, tint: "linear-gradient(150deg,#2c001e,#1d0716 60%,#140510)" },
  { to: "/windows", holds: "brand",
    chrome: <WinChrome />, tint: "linear-gradient(160deg,#06283f,#041a2c)" },
];

export default function Shells({ counts }: { counts?: Partial<Record<Discipline, number>> }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {SHELLS.map((s) => (
        <li key={s.to}>
          <Link to={s.to}
            className="group block overflow-hidden rounded-[10px] border border-edge transition-colors duration-[var(--dur-move)] hover:border-bone">
            <span className="relative block aspect-[16/10] overflow-hidden" style={{ background: s.tint }}>
              <span className="absolute inset-0 transition-transform duration-[var(--dur-slow)] ease-[var(--ease-glide)] group-hover:scale-[1.04]">
                {s.chrome}
              </span>
            </span>
            <span className="flex items-baseline justify-between gap-3 border-t border-edge px-4 py-3">
              <span className="text-[15px] text-bone">{DISCIPLINE_LABEL[s.holds]}</span>
              {/* The count replaces the old "Opens on X", which just repeated
                  the name once the name became the discipline. */}
              <span className="hud text-right">
                {counts?.[s.holds] ? `${counts[s.holds]} projects` : "Open"}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

/* Tiny drawn impressions, not screenshots: enough to recognise the shape of
   each one without shipping anybody's artwork. */
function Win({ x, y, w, h, bar }: { x: string; y: string; w: string; h: string; bar: string }) {
  return (
    <span className="absolute overflow-hidden rounded-[3px] border border-white/25 bg-black/45"
          style={{ left: x, top: y, width: w, height: h }}>
      <span className="block h-[6px] w-full" style={{ background: bar }} />
    </span>
  );
}

function MacChrome() {
  return (
    <>
      <span className="absolute inset-x-0 top-0 h-[7px] bg-black/45" />
      <Win x="18%" y="22%" w="58%" h="52%" bar="rgba(255,255,255,.22)" />
      <span className="absolute bottom-[8%] left-1/2 flex -translate-x-1/2 gap-[3px] rounded-[5px] bg-white/12 px-[5px] py-[3px]">
        {["#4da3ff", "#3a3a3c", "#66b9ff", "#8e8e93"].map((c, i) => (
          <span key={i} className="h-[9px] w-[9px] rounded-[3px]" style={{ background: c }} />
        ))}
      </span>
    </>
  );
}
function UbuntuChrome() {
  return (
    <>
      <span className="absolute inset-x-0 top-0 h-[7px] bg-black/55" />
      <span className="absolute bottom-0 left-0 top-[7px] w-[13%] bg-black/45" />
      <span className="absolute left-[3%] top-[16%] flex w-[7%] flex-col gap-[3px]">
        {["#e95420", "#77216f", "#aea79f"].map((c, i) => (
          <span key={i} className="h-[9px] w-full rounded-[2px]" style={{ background: c }} />
        ))}
      </span>
      <Win x="24%" y="24%" w="58%" h="52%" bar="#3b3234" />
    </>
  );
}
function WinChrome() {
  return (
    <>
      <Win x="20%" y="18%" w="58%" h="52%" bar="#2b2b2b" />
      <span className="absolute inset-x-0 bottom-0 h-[13%] bg-black/55" />
      <span className="absolute bottom-[3%] left-1/2 flex -translate-x-1/2 items-center gap-[4px]">
        <span className="grid grid-cols-2 gap-[1.5px]">
          {[0, 1, 2, 3].map((i) => <span key={i} className="h-[4px] w-[4px] rounded-[1px] bg-[#4cc2ff]" />)}
        </span>
        {["#ffd36b", "#4cc2ff", "#6ccb87"].map((c, i) => (
          <span key={i} className="h-[9px] w-[9px] rounded-[2px]" style={{ background: c }} />
        ))}
      </span>
    </>
  );
}
