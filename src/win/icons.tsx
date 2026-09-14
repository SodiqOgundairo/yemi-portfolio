import type { IconProps, IconKey } from "../desktop/iconTypes";

/* Fluent icon language: no container at all, the artwork IS the icon. Flat,
   geometric, and two-tone: a saturated base plane with a lighter plane laid
   over it to imply depth. Drawn, never Microsoft's own artwork. */

export function FluentIcon({ app, size = 24, className = "" }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" className={className} aria-hidden>
      {ART[app]}
    </svg>
  );
}

const ART: Record<IconKey, React.ReactNode> = {
  // the amber folder with a lighter front flap is the single most Windows thing here
  /* Measured off the shipped 256px shell asset and divided by 8.
     Everything here is from the alpha map, not from instinct:
     - artwork is 87.5% x 68.75% and NOT vertically centred (34 top, 46 bottom)
     - every corner is r=12 at 256, i.e. 1.5 here
     - the tab's right edge is a straight 39.0-degree diagonal that meets the
       body's top edge in a HARD corner with no fillet, which is the detail a
       redraw always rounds and gets wrong
     - the front plate's step is 55.4 degrees, deliberately NOT parallel to it
     - both gradients run at 148.8deg
     - there is no stroke, no highlight and no shadow anywhere: the depth is
       only the two 4px reveal bands and the white paper sliver */
  finder: (
    <>
      <defs>
        <linearGradient id="wf-back" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0.5218" y2="0.8531">
          <stop offset="0" stopColor="#FFC016" /><stop offset="1" stopColor="#DFA32D" />
        </linearGradient>
        <linearGradient id="wf-front" gradientUnits="objectBoundingBox" x1="0" y1="0" x2="0.5218" y2="0.8531">
          <stop offset="0" stopColor="#FFEAAA" /><stop offset="1" stopColor="#FFC936" />
        </linearGradient>
        <linearGradient id="wf-p2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F4F5F6" /><stop offset="1" stopColor="#DEE0E2" />
        </linearGradient>
      </defs>
      {/* back plate: body plus the left tab, unioned */}
      <path d="M2 5.75A1.5 1.5 0 0 1 3.5 4.25h7.85a1.5 1.5 0 0 1 1.05.43L14.5 7.25H28.5A1.5 1.5 0 0 1 30 8.75v16A1.5 1.5 0 0 1 28.5 26.25h-25A1.5 1.5 0 0 1 2 24.75Z"
            fill="url(#wf-back)" />
      {/* two paper sheets, inset 4px from the plate edge */}
      <path d="M2.5 8.6h11.9v0.6H2.5Z" fill="url(#wf-p2)" />
      <path d="M2.5 7.75h12.1v0.5H2.5Z" fill="#FDFDFD" />
      {/* front plate: top edge steps DOWN on the tab side */}
      <path d="M2 9.2a1.4 1.4 0 0 1 .5-1.05V9.2Zm0 0 10.29.0 2.11-1.45H28.5A1.5 1.5 0 0 1 30 9.25v15A1.5 1.5 0 0 1 28.5 25.75h-25A1.5 1.5 0 0 1 2 24.25Z"
            fill="url(#wf-front)" />
    </>
  ),
  reader: (
    <>
      <path d="M7 4h11l7 7v17H7Z" fill="#e8eaed" />
      <path d="M18 4l7 7h-7Z" fill="#a9b0b8" />
      <path d="M11 17h10M11 21h10" stroke="#6f7680" strokeWidth="1.6" strokeLinecap="round" />
    </>
  ),
  terminal: (
    <>
      <rect x="2.5" y="5" width="27" height="22" rx="2.5" fill="#1f1f1f" />
      <rect x="2.5" y="5" width="27" height="4.5" rx="2.5" fill="#3a3a3a" />
      <path d="M8 15l4.5 4-4.5 4M15.5 23H23" stroke="#16c60c" strokeWidth="1.9" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  contact: (
    <>
      <rect x="2.5" y="7" width="27" height="18" rx="2.5" fill="#0067c0" />
      <path d="M3.5 9.2 16 18l12.5-8.8" fill="none" stroke="#8fd0ff" strokeWidth="1.9" strokeLinecap="round" />
    </>
  ),
  about: (
    <>
      <circle cx="16" cy="16" r="13" fill="#4cc2ff" />
      <path d="M16 14v8.5" stroke="#0b3d6b" strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="16" cy="9.6" r="1.5" fill="#0b3d6b" />
    </>
  ),
  experience: (
    <>
      <rect x="3" y="16" width="5.6" height="12" rx="1" fill="#2d7dd2" />
      <rect x="13.2" y="6" width="5.6" height="22" rx="1" fill="#4cc2ff" />
      <rect x="23.4" y="11" width="5.6" height="17" rx="1" fill="#8ad4ff" />
    </>
  ),
  education: (
    <>
      <path d="M16 5 2 11.5 16 18l14-6.5Z" fill="#107c41" />
      <path d="M8 15v6.4c0 2 3.6 3.6 8 3.6s8-1.6 8-3.6V15l-8 3.6Z" fill="#6ccb87" />
    </>
  ),
  skills: (
    <>
      <path d="M16 2c1 7 4.6 10.6 11.6 11.6C20.6 14.6 17 18.2 16 25.2 15 18.2 11.4 14.6 4.4 13.6 11.4 12.6 15 9 16 2Z" fill="#8661c5" />
      <path d="M25.5 20c.4 2.8 1.9 4.3 4.7 4.7-2.8.4-4.3 1.9-4.7 4.7-.4-2.8-1.9-4.3-4.7-4.7 2.8-.4 4.3-1.9 4.7-4.7Z" fill="#c9a0ff" />
    </>
  ),
  globe: (
    <>
      <circle cx="16" cy="16" r="13" fill="#0067c0" />
      <path d="M16 3c3.6 3.4 5.4 7.7 5.4 13S19.6 25.6 16 29c-3.6-3.4-5.4-7.7-5.4-13S12.4 6.4 16 3Z" fill="#4cc2ff" />
      <path d="M3.6 11.6h24.8M3.6 20.4h24.8" stroke="#8fd0ff" strokeWidth="1.5" />
    </>
  ),
  browser: (
    <>
      <circle cx="16" cy="16" r="13" fill="#0067c0" />
      <path d="M16 3c3.6 3.4 5.4 7.7 5.4 13S19.6 25.6 16 29c-3.6-3.4-5.4-7.7-5.4-13S12.4 6.4 16 3Z" fill="#4cc2ff" />
      <path d="M3.6 11.6h24.8M3.6 20.4h24.8" stroke="#8fd0ff" strokeWidth="1.5" />
    </>
  ),
};
