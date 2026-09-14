import type { Win, AppId } from "../desktop/useWindows";
import { MacIcon } from "./icons";

/* Stage Manager's parked cards are not flat rectangles. They sit in
   perspective, angled away toward the screen edge, and each one carries its
   app's icon. Getting that wrong is the difference between "a list of windows"
   and the thing people recognise.

   The rotation pivots on the RIGHT edge, the one facing the centre of the
   screen, so the card recedes outwards rather than pivoting about its middle.
   Each card also shows a miniature of the kind of window it is, because a grey
   box with a title reads as a placeholder however well it is lit. */

export default function StageRail({ wins, onPick }: { wins: Win[]; onPick: (id: string) => void }) {
  return (
    <div
      className="absolute bottom-24 left-2 top-10 z-[500] flex w-[128px] flex-col justify-center gap-4"
      style={{ perspective: "900px", perspectiveOrigin: "right center" }}
    >
      {wins.map((w) => (
        <button
          key={w.id}
          onClick={() => onPick(w.id)}
          title={w.title}
          className="stage-card relative flex h-[84px] w-full flex-col origin-right overflow-hidden rounded-[8px] border border-white/20 bg-[#1c1c1e]/90 text-left shadow-[0_10px_26px_-6px_rgba(0,0,0,.75)] backdrop-blur-md"
        >
          <span className="flex h-[13px] items-center gap-[3px] border-b border-black/40 bg-[#3a3a3c] px-1.5">
            <span className="h-[4px] w-[4px] rounded-full bg-[#ff5f57]" />
            <span className="h-[4px] w-[4px] rounded-full bg-[#febc2e]" />
            <span className="h-[4px] w-[4px] rounded-full bg-[#28c840]" />
          </span>

          {/* a miniature of the kind of window this is */}
          <span className="block flex-1 overflow-hidden px-2 pt-1.5">
            <Mini app={w.app} />
          </span>

          {/* laid out as a row rather than two absolutely positioned things,
              which is what had the icon sitting on top of the label */}
          <span className="flex h-[20px] shrink-0 items-center gap-1.5 border-t border-white/10 bg-black/25 px-1.5">
            <MacIcon app={w.app} size={15} className="shrink-0" />
            <span className="min-w-0 flex-1 truncate text-[9px] leading-none text-white/75">{w.title}</span>
          </span>
        </button>
      ))}
    </div>
  );
}

function Bar({ w, dim = false }: { w: string; dim?: boolean }) {
  return <span className="mb-[3px] block h-[3px] rounded-full" style={{ width: w, background: dim ? "rgba(255,255,255,.16)" : "rgba(255,255,255,.3)" }} />;
}

function Mini({ app }: { app: AppId }) {
  if (app === "terminal")
    return (
      <span className="block">
        <span className="mb-[3px] block h-[3px] w-[42%] rounded-full bg-[#5fd35f]/70" />
        <Bar w="72%" dim /><Bar w="58%" dim /><Bar w="34%" dim />
      </span>
    );
  if (app === "contact")
    return (
      <span className="block">
        <Bar w="80%" /><Bar w="52%" dim />
        <span className="mt-[5px] block h-[14px] rounded-[2px] bg-white/[0.06]" />
      </span>
    );
  if (app === "about")
    return (
      <span className="flex flex-col items-center pt-[2px]">
        <span className="mb-[4px] h-[12px] w-[12px] rounded-full bg-white/25" />
        <Bar w="60%" dim /><Bar w="44%" dim />
      </span>
    );
  if (app === "experience" || app === "education")
    return (
      <span className="block">
        <Bar w="66%" /><Bar w="88%" dim /><Bar w="52%" dim />
        <span className="mt-[3px] block h-[1px] bg-white/10" />
        <span className="mt-[3px] block"><Bar w="60%" /><Bar w="80%" dim /></span>
      </span>
    );
  if (app === "skills")
    return (
      <span className="flex flex-wrap gap-[3px] pt-[2px]">
        {[16, 22, 13, 19, 25, 15, 20].map((w, i) => (
          <span key={i} className="h-[6px] rounded-full bg-white/20" style={{ width: w }} />
        ))}
      </span>
    );
  if (app === "reader")
    return (
      <span className="block">
        <span className="mb-[4px] block h-[11px] rounded-[2px] bg-white/[0.10]" />
        <Bar w="86%" dim /><Bar w="74%" dim /><Bar w="46%" dim />
      </span>
    );
  // finder: a sidebar and rows
  return (
    <span className="flex gap-[4px]">
      <span className="block w-[22px] shrink-0">
        <Bar w="100%" dim /><Bar w="80%" dim /><Bar w="90%" dim />
      </span>
      <span className="block flex-1">
        <Bar w="100%" /><Bar w="88%" dim /><Bar w="94%" dim /><Bar w="70%" dim />
      </span>
    </span>
  );
}
