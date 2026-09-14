import type { IconProps, IconKey } from "../desktop/iconTypes";

/* Yaru icon language: a flat rounded square, one solid colour from Ubuntu's
   own palette, no gradient and no gloss, with a plain white glyph. Yaru is
   deliberately matte, which is most of what separates it from macOS on a
   dock. Drawn, never Canonical's own artwork. */

const FILL: Record<IconKey, string> = {
  browser: "#2b2529",
  finder: "#f7f7f5", reader: "#d9d5d2", terminal: "#2c001e",
  contact: "#0b7ec4", about: "#5e5b58", experience: "#e95420",
  education: "#77216f", skills: "#aea79f", globe: "#e95420",
};
const INK: Record<IconKey, string> = {
  browser: "#ffffff",
  finder: "#5e5b58", reader: "#5e5b58", terminal: "#8ae234",
  contact: "#ffffff", about: "#ffffff", experience: "#ffffff",
  education: "#ffffff", skills: "#ffffff", globe: "#ffffff",
};

export function YaruIcon({ app, size = 46, className = "" }: IconProps) {
  const ink = INK[app];
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden>
      <rect x="2" y="2" width="60" height="60" rx="15" fill={FILL[app]} />
      <rect x="2.5" y="2.5" width="59" height="59" rx="14.5" fill="none" stroke="#000" strokeOpacity=".16" />
      <g transform="translate(16 16)" fill="none" stroke={ink} strokeWidth="2.8"
         strokeLinecap="round" strokeLinejoin="round">
        {glyph(app, ink)}
      </g>
    </svg>
  );
}

function glyph(app: IconKey, ink: string): React.ReactNode {
  switch (app) {
    case "finder":  return (
      <g stroke="none">
        <path d="M1 6.5A2.5 2.5 0 0 1 3.5 4h7.2l2.6 3H28.5A2.5 2.5 0 0 1 31 9.5V11H1Z" fill="#5e5b58" />
        <path d="M1 10h30v15.5A2.5 2.5 0 0 1 28.5 28h-25A2.5 2.5 0 0 1 1 25.5Z" fill="#8b8683" />
      </g>
    );
    case "reader":  return <><path d="M7 2h12l6 6v22H7Z" /><path d="M19 2v6h6" /><path d="M12 19h8M12 24h8" /></>;
    case "terminal":return <><path d="M6 10l7 6-7 6" /><path d="M17 22h9" /></>;
    case "contact": return <><rect x="3" y="7" width="26" height="18" rx="2" /><path d="m4 9 12 9 12-9" /></>;
    case "about":   return <><circle cx="16" cy="16" r="13" /><path d="M16 14v9" /><circle cx="16" cy="9.6" r=".3" strokeWidth="3.4" /></>;
    case "experience": return <path d="M4 27V15M12 27V6M20 27v-8M28 27H2" />;
    case "education":  return <><path d="M16 4 2 11l14 7 14-7Z" /><path d="M8 15v7c0 2 3.6 3.6 8 3.6s8-1.6 8-3.6v-7" /></>;
    case "skills":  return <path d="M16 2c1 6.6 4.4 10 11 11-6.6 1-10 4.4-11 11-1-6.6-4.4-10-11-11 6.6-1 10-4.4 11-11Z" fill={ink} stroke="none" />;
    case "browser": return (
      <g stroke="none">
        <circle cx="16" cy="16" r="13" fill="#e95420" />
        <circle cx="16" cy="16" r="7.5" fill="#77216f" />
        <circle cx="16" cy="16" r="3" fill="#f7f7f5" />
      </g>
    );
    case "globe":   return <><circle cx="16" cy="16" r="13" /><ellipse cx="16" cy="16" rx="5.4" ry="13" /><path d="M3.4 11.6h25.2M3.4 20.4h25.2" /></>;
  }
}
