import { useEffect, useState } from "react";
import Menu, { type Item } from "./Menu";
import type { Win } from "../desktop/useWindows";

/* The bar is the one element always on screen, so it is where fidelity is
   cheapest and most noticed. Everything on it now opens: the menus, the
   battery, the Wi-Fi and control centre. A decorative menu bar is the tell
   that the whole thing is a picture of an interface rather than one. */

function useClock() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  return now;
}

export default function MenuBar({
  appName, wins, stage, onAction,
}: {
  appName: string;
  wins: Win[];
  stage: boolean;
  onAction: (a: { type: string; id?: string }) => void;
}) {
  const [open, setOpen] = useState<string | null>(null);
  const now = useClock();
  const [volume, setVolume] = useState(62);
  const [bright, setBright] = useState(80);

  const stamp = new Intl.DateTimeFormat("en-GB", {
    weekday: "short", day: "numeric", month: "short",
    hour: "2-digit", minute: "2-digit", hour12: false,
  }).format(now);

  const go = (type: string, id?: string) => () => onAction({ type, id });

  const rootMenu: Item[] = [
    { label: "About This Designer", onSelect: go("about") },
    { kind: "divider" },
    { label: "Main site", hint: "↗", onSelect: go("home") },
    /* These named operating systems and did nothing, which broke the rule
       that the desktops are never called by an OS name in copy. They are
       named for the discipline they hold now, and they actually go there. */
    { label: "Engineering desktop", hint: "↗", onSelect: go("shell", "/ubuntu") },
    { label: "Brand desktop", hint: "↗", onSelect: go("shell", "/windows") },
    { kind: "divider" },
    { label: "Lock Screen", hint: "⌃⌘Q", onSelect: go("lock") },
  ];
  const fileMenu: Item[] = [
    { label: "New Finder Window", hint: "⌘N", onSelect: go("finder") },
    { label: "Open Terminal", hint: "⌘T", onSelect: go("terminal") },
    { label: "New Message", onSelect: go("contact") },
    { kind: "divider" },
    { label: "Close Window", hint: "⌘W", disabled: !wins.length, onSelect: go("close") },
  ];
  const editMenu: Item[] = [
    { label: "Undo", hint: "⌘Z", disabled: true },
    { label: "Redo", hint: "⇧⌘Z", disabled: true },
    { kind: "divider" },
    { label: "Cut", hint: "⌘X", disabled: true },
    { label: "Copy", hint: "⌘C", disabled: true },
    { label: "Paste", hint: "⌘V", disabled: true },
  ];
  const viewMenu: Item[] = [
    { label: "Use Stage Manager", checked: stage, onSelect: go("toggle-stage") },
    { kind: "divider" },
    { label: "Quick Look", hint: "Space", onSelect: go("quicklook") },
  ];
  const windowMenu: Item[] = [
    { label: "Minimise", hint: "⌘M", disabled: !wins.length, onSelect: go("minimise") },
    { label: "Close All", disabled: !wins.length, onSelect: go("close-all") },
    { kind: "divider" },
    ...(wins.length
      ? wins.map<Item>((w) => ({ label: w.title, onSelect: go("focus", w.id) }))
      : [{ label: "No open windows", disabled: true } as Item]),
  ];
  const helpMenu: Item[] = [
    { label: "How this was built", onSelect: go("about") },
    { label: "GitHub", hint: "↗", onSelect: go("github") },
    { kind: "divider" },
    { label: "Not affiliated with Apple", disabled: true },
  ];

  return (
    <div className="pointer-events-auto fixed inset-x-0 top-0 z-[9000] flex h-[24px] items-center bg-black/35 pl-[10px] pr-2 text-[13px] text-white/90 backdrop-blur-2xl">
      <Menu id="root" items={rootMenu} open={open} setOpen={setOpen} width={220}>
        {/* not the Apple mark: that is a trademark and this is a public page */}
        <span aria-hidden className="grid h-[16px] w-[16px] place-items-center rounded-[4px] bg-white/85 text-[10px] font-bold leading-none text-black">Y</span>
      </Menu>

      <span className="px-[10.5px] font-bold">{appName}</span>

      <span className="hidden sm:contents">
        <Menu id="file" label="File" items={fileMenu} open={open} setOpen={setOpen} />
        <Menu id="edit" label="Edit" items={editMenu} open={open} setOpen={setOpen} width={180} />
        <Menu id="view" label="View" items={viewMenu} open={open} setOpen={setOpen} />
        <Menu id="window" label="Window" items={windowMenu} open={open} setOpen={setOpen} width={240} />
        <Menu id="help" label="Help" items={helpMenu} open={open} setOpen={setOpen} width={230} />
      </span>

      <span className="flex-1" />

      <span className="hidden items-center gap-0.5 sm:flex">
        <Menu id="battery" open={open} setOpen={setOpen} align="right" width={230}
          items={[
            { label: "Battery: 80%", disabled: true },
            { label: "Power Source: Battery", disabled: true },
            { kind: "divider" },
            { label: "Low Power Mode", onSelect: go("noop") },
          ]}>
          <Battery />
        </Menu>

        <Menu id="wifi" open={open} setOpen={setOpen} align="right" width={250}
          items={[
            { label: "Wi-Fi: On", disabled: true },
            { kind: "divider" },
            { label: "Gr8QM-Studio", checked: true, onSelect: go("noop") },
            { label: "AIENAI-Guest", onSelect: go("noop") },
            { label: "Flock-Sanctuary-5G", onSelect: go("noop") },
            { kind: "divider" },
            { label: "Network Settings…", onSelect: go("about") },
          ]}>
          <Wifi />
        </Menu>

        <Menu id="cc" open={open} setOpen={setOpen} align="right" width={250}
          items={[]}>
          <Control />
        </Menu>
        {open === "cc" && (
          <div className="absolute right-2 top-[26px] z-[9600] w-[250px] rounded-[10px] border border-white/15 bg-[#2b2b2d]/85 p-3 shadow-[0_18px_50px_-10px_rgba(0,0,0,.75)] backdrop-blur-2xl">
            <Slider label="Display" value={bright} onChange={setBright} />
            <Slider label="Sound" value={volume} onChange={setVolume} />
            <p className="pt-1 text-[11px] text-white/35">These do exactly what you would expect: nothing.</p>
          </div>
        )}
      </span>

      <span className="pl-2 pr-1 tabular-nums">{stamp}</span>
    </div>
  );
}

function Slider({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label className="block pb-3 last:pb-1">
      <span className="block pb-1.5 text-[12px] text-white/70">{label}</span>
      <input type="range" min={0} max={100} value={value} aria-label={label}
        onChange={(e) => onChange(+e.target.value)}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-white/20 accent-white
                   [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none
                   [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white" />
    </label>
  );
}

function Battery() {
  return (
    <svg width="26" height="13" viewBox="0 0 26 13" aria-label="Battery" role="img">
      <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" fill="none" stroke="currentColor" opacity=".5" />
      <rect x="2" y="2" width="15" height="9" rx="2" fill="currentColor" />
      <path d="M23 4.5v4a2.5 2.5 0 0 0 0-4Z" fill="currentColor" opacity=".5" />
    </svg>
  );
}
function Wifi() {
  return (
    <svg width="16" height="12" viewBox="0 0 16 12" aria-label="Wi-Fi" role="img" fill="currentColor">
      <path d="M8 10.6 6.3 8.8a2.4 2.4 0 0 1 3.4 0L8 10.6Z" />
      <path d="M4.6 7.1 3.3 5.8a6.7 6.7 0 0 1 9.4 0l-1.3 1.3a4.9 4.9 0 0 0-6.8 0Z" opacity=".85" />
      <path d="M1.6 4.1.3 2.8a10.9 10.9 0 0 1 15.4 0l-1.3 1.3a9.1 9.1 0 0 0-12.8 0Z" opacity=".6" />
    </svg>
  );
}
function Control() {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" aria-label="Control Centre" role="img" fill="none" stroke="currentColor" strokeWidth="1.3">
      <path d="M1 3h13M1 9h13" />
      <circle cx="5" cy="3" r="1.9" fill="currentColor" stroke="none" />
      <circle cx="10" cy="9" r="1.9" fill="currentColor" stroke="none" />
    </svg>
  );
}
