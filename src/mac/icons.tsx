import type { IconProps, IconKey } from "../desktop/iconTypes";

/* macOS icon language: a squircle tile, a top-lit vertical gradient, a hairline
   highlight along the top edge and a soft drop shadow, with a light-weight
   rounded glyph sitting on it. Drawn, never Apple's own artwork. */

const TILE: Record<IconKey, [string, string]> = {
  finder:     ["#5cb2ff", "#1668d8"],
  reader:     ["#f4f4f6", "#c3c3ca"],
  terminal:   ["#4a4a4c", "#161617"],
  contact:    ["#74c0ff", "#0a72e8"],
  about:      ["#a0a0a6", "#5a5a60"],
  experience: ["#ffc266", "#e08a1e"],
  education:  ["#8fd8a2", "#2f9e58"],
  skills:     ["#c9a6ff", "#7a3fd4"],
  globe:      ["#8ad4ff", "#1d7fd1"],
  browser:    ["#8ad4ff", "#1d7fd1"],
};

const BARE = new Set<IconKey>(["finder", "reader"]);

export function MacIcon({ app, size = 52, className = "" }: IconProps) {
  /* Folders and documents are drawn as themselves. Only real applications get
     the squircle tile, which is the actual macOS rule and the thing that was
     making a folder look like an app. */
  if (BARE.has(app)) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
        {app === "finder" ? <MacFolder /> : <MacDoc />}
      </svg>
    );
  }
  const [a, b] = TILE[app];
  const id = `m-${app}`;
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={a} /><stop offset="100%" stopColor={b} />
        </linearGradient>
      </defs>
      {/* the squircle, not a rounded rect: the corner curvature is the tell */}
      {/* the tile is 824 of a 1024 canvas, a 100px inset all round, so it
          never fills its box. Scaling the 60-unit squircle by 51.5/60. */}
      <g transform="translate(32 32) scale(0.8583) translate(-32 -32)">
        <path d="M32 2c14.5 0 20.4 1.2 24.6 5.4C60.8 11.6 62 17.5 62 32s-1.2 20.4-5.4 24.6C52.4 60.8 46.5 62 32 62s-20.4-1.2-24.6-5.4C3.2 52.4 2 46.5 2 32S3.2 11.6 7.4 7.4C11.6 3.2 17.5 2 32 2Z"
              fill={`url(#${id})`} />
        <path d="M32 2c14.5 0 20.4 1.2 24.6 5.4 2.4 2.4 3.9 5.3 4.7 10.3C58.6 10.6 51.4 7.6 32 7.6S5.4 10.6 2.7 17.7c.8-5 2.3-7.9 4.7-10.3C11.6 3.2 17.5 2 32 2Z"
              fill="#fff" opacity=".28" />
      </g>
      <g transform="translate(18.3 18.3) scale(0.8583)" fill="none" stroke="#fff" strokeWidth="2.6"
         strokeLinecap="round" strokeLinejoin="round" opacity=".97">
        {GLYPH[app]}
      </g>
    </svg>
  );
}

/* The traditional Finder folder: a darker back plate whose top edge rises on
   the left into a wide, generously rounded tab, and a lighter front plate
   sitting over the lower two thirds. Straight on, no perspective. */
function MacFolder() {
  /* Measured from NSWorkspace.icon(forFile:) at 1024px and divided by 16.
     The folder is 940x755 in a 1024 canvas: WIDER than an app tile can be
     (824), which is the proof it is never a tile with a folder inside.
     Tab sits top-LEFT, 214px wide at the top and splaying to 374px at its
     base. Light and dark are byte-identical: there is no dark variant. */
  return (
    <>
      <defs>
        <linearGradient id="mf-back" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#92DAF4" />
          <stop offset="45%" stopColor="#68C6EA" />
          <stop offset="100%" stopColor="#45B7E3" />
        </linearGradient>
        <linearGradient id="mf-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#9DE1FA" />
          <stop offset="2%" stopColor="#87DAFA" />
          <stop offset="97%" stopColor="#56BEE8" />
          <stop offset="100%" stopColor="#4BADD4" />
        </linearGradient>
      </defs>
      {/* back plate: tab from x 2.6 to 16.0 at the top, splaying to 26.0 by
          y 12.6, then full width to the right edge */}
      <path d="M2.63 10.3a1.9 1.9 0 0 1 1.9-1.93h9.6a1.9 1.9 0 0 1 1.5.74l3.9 4.9a1.9 1.9 0 0 0 1.5.73h38.4a1.9 1.9 0 0 1 1.9 1.9v35.7a3.9 3.9 0 0 1-3.9 3.9H6.53a3.9 3.9 0 0 1-3.9-3.9Z"
            fill="url(#mf-back)" />
      {/* front flap: top edge at y 16.8, bottom corners r 3.9 */}
      <path d="M2.63 18.2a1.4 1.4 0 0 1 1.4-1.4h55.54a1.4 1.4 0 0 1 1.4 1.4v33.4a3.9 3.9 0 0 1-3.9 3.9H6.53a3.9 3.9 0 0 1-3.9-3.9Z"
            fill="url(#mf-front)" />
    </>
  );
}

function MacDoc() {
  return (
    <>
      <path d="M13 8a3 3 0 0 1 3-3h20l15 15v36a3 3 0 0 1-3 3H16a3 3 0 0 1-3-3Z" fill="#f3f4f6" />
      <path d="M36 5l15 15H39a3 3 0 0 1-3-3Z" fill="#b9bcc2" />
      <path d="M21 33h22M21 41h22M21 49h14" stroke="#9aa0a8" strokeWidth="2.4" strokeLinecap="round" />
    </>
  );
}

const GLYPH: Record<IconKey, React.ReactNode> = {
  finder:     <path d="M1 6.5A2 2 0 0 1 3 4.5h6l2.4 2.6H29a2 2 0 0 1 2 2V27a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2Z" fill="#fff" stroke="none" />,
  reader:     <><path d="M7 2h12l6 6v22H7Z" /><path d="M19 2v6h6" /><path d="M12 18h8M12 24h8" /></>,
  terminal:   <><path d="M6 10l7 6-7 6" /><path d="M17 22h9" /></>,
  contact:    <><rect x="3" y="7" width="26" height="18" rx="3" /><path d="m4 9 12 9 12-9" /></>,
  about:      <><circle cx="16" cy="16" r="13" /><path d="M16 14v9" /><circle cx="16" cy="9.6" r=".3" strokeWidth="3.2" /></>,
  experience: <path d="M4 27V15M12 27V6M20 27v-8M28 27H2" />,
  education:  <><path d="M16 4 2 11l14 7 14-7Z" /><path d="M8 15v7c0 2 3.6 3.6 8 3.6s8-1.6 8-3.6v-7" /></>,
  skills:     <path d="M16 2c1 6.6 4.4 10 11 11-6.6 1-10 4.4-11 11-1-6.6-4.4-10-11-11 6.6-1 10-4.4 11-11Z" fill="#fff" stroke="none" />,
  globe:      <><circle cx="16" cy="16" r="13" /><ellipse cx="16" cy="16" rx="5.4" ry="13" /><path d="M3.4 11.6h25.2M3.4 20.4h25.2" /></>,
  browser:    <><circle cx="16" cy="16" r="13" /><ellipse cx="16" cy="16" rx="5.4" ry="13" /><path d="M3.4 11.6h25.2M3.4 20.4h25.2" /></>,
};
