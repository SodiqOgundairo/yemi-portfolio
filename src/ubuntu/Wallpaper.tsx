/* Ubuntu 26.04 "Resolute Raccoon", redrawn from measurements of the shipped
   `warty-final-ubuntu.png` (3840x2160). It is NOT a low-poly wireframe: it is
   a flat two-tone vector sunburst, 60 spokes around a front-facing raccoon
   face, dead centre on an aubergine field.

   Measured facts this is built from:
   - roundel centre (1919, 1079), R = 216, i.e. diameter is exactly H/5
   - spokes run r 218 -> 435, so the outer ring is exactly 2R
   - exactly 60 spokes at a 6.0 degree pitch
   - each spoke is a ~6px hairline the full length PLUS a thicker 11-18px bar
     that stops at a randomised radius. Constant width, not a tapering wedge
   - there is NO disc: the "circle" is just ground showing between the spokes
   - ground #652648, ink #b192a3, and no vignette anywhere */

const CX = 1919, CY = 1079;
const R_IN = 218, R_OUT = 435;
const INK = "#b192a3";

/* Deterministic per-spoke variation, so it is stable across renders rather
   than shimmering on every mount. */
function bar(i: number) {
  const h = Math.sin(i * 12.9898) * 43758.5453;
  const a = h - Math.floor(h);
  const g = Math.sin(i * 78.233) * 12345.6789;
  const b = g - Math.floor(g);
  return { w: 11 + a * 7.6, end: R_IN + (0.62 + b * 0.38) * (R_OUT - R_IN) };
}

/** Row runs of light ink, measured every 12px off the shipped PNG. */
const HEAD: [number, [number, number][]][] = [
  [-114, [[-101, -80], [81, 102]]],
  [-102, [[-108, -69], [70, 109]]],
  [-90, [[-113, -59], [-40, 41], [60, 114]]],
  [-78, [[-118, 119]]],
  [-66, [[-121, 122]]],
  [-54, [[-123, -50], [-30, 31], [51, 124]]],
  [-42, [[-130, -74], [-25, 26], [75, 131]]],
  [-30, [[-141, -91], [-22, 23], [92, 142]]],
  [-18, [[-151, -103], [-68, -47], [-20, 21], [48, 69], [104, 152]]],
  [-6, [[-154, -113], [-66, -49], [-17, 18], [50, 67], [115, 155]]],
  [6, [[-152, -121], [-33, 34], [122, 153]]],
  [18, [[-148, -128], [-55, 56], [129, 149]]],
  [30, [[-144, -133], [-68, 69], [134, 145]]],
  [42, [[-138, -137], [-78, -24], [24, 79], [138, 139]]],
  [54, [[-84, -17], [18, 85]]],
  [66, [[-89, -8], [9, 90]]],
  [78, [[-92, 93]]],
  [90, [[-93, 94]]],
  [102, [[-82, 83]]],
  [114, [[-58, 59]]],
];

export default function Wallpaper() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 3840 2160"
           preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          {/* the two very large soft lobes. The top-right one is dominant:
              a shadow band inside its edge, a rose highlight outside it. */}
          <radialGradient id="u-tr" cx="93%" cy="4%" r="62%">
            <stop offset="0%" stopColor="#b64a64" />
            <stop offset="42%" stopColor="#873356" />
            <stop offset="100%" stopColor="#652648" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="u-shadow" cx="78%" cy="0%" r="46%">
            <stop offset="0%" stopColor="#3a1424" stopOpacity=".95" />
            <stop offset="100%" stopColor="#3a1424" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="u-bl" cx="4%" cy="96%" r="46%">
            <stop offset="0%" stopColor="#6c2749" stopOpacity=".55" />
            <stop offset="100%" stopColor="#652648" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="3840" height="2160" fill="#652648" />
        <rect width="3840" height="2160" fill="url(#u-shadow)" />
        <rect width="3840" height="2160" fill="url(#u-tr)" />
        <rect width="3840" height="2160" fill="url(#u-bl)" />

        <g transform={`translate(${CX} ${CY})`} fill={INK}>
          {/* 60 spokes: a hairline the whole way, a thicker bar part way */}
          {Array.from({ length: 60 }, (_, i) => {
            const { w, end } = bar(i);
            return (
              <g key={i} transform={`rotate(${i * 6})`}>
                <rect x={R_IN} y={-3} width={R_OUT - R_IN} height={6} />
                <rect x={R_IN} y={-w / 2} width={end - R_IN} height={w} />
              </g>
            );
          })}

          {/* the face, built from the measured row runs */}
          {HEAD.map(([y, runs]) =>
            runs.map(([x0, x1], j) => (
              <rect key={`${y}-${j}`} x={x0} y={y - 6} width={x1 - x0} height={12} />
            )),
          )}
          {/* eyes are light discs, 23 across */}
          <circle cx={-57.5} cy={-14} r={11.5} />
          <circle cx={59} cy={-14} r={11.5} />
          {/* the nose is ground, not ink: a downward triangle knocked out */}
          <path d="M-23 36H24L0.5 73Z" fill="#652648" />
        </g>
      </svg>
    </div>
  );
}
