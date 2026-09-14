/* Windows 11's desktop is a translucent bloom of overlapping petals over a
   deep blue field. Drawn here rather than shipping Microsoft's wallpaper, but
   drawn as a bloom rather than a plain radial, which is what made this read
   as "a gradient" before. */
export default function Bloom() {
  const petals = Array.from({ length: 12 }, (_, i) => i * 30);
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <svg className="absolute left-1/2 top-1/2 h-[135%] w-[135%] -translate-x-1/2 -translate-y-1/2"
           viewBox="-500 -500 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden>
        <defs>
          <radialGradient id="w-petal" cx="50%" cy="18%" r="82%">
            <stop offset="0%" stopColor="#bfe6ff" stopOpacity=".50" />
            <stop offset="46%" stopColor="#4aa6f0" stopOpacity=".22" />
            <stop offset="100%" stopColor="#0b4c8c" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="w-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#eaf7ff" stopOpacity=".62" />
            <stop offset="100%" stopColor="#7ec8ff" stopOpacity="0" />
          </radialGradient>
        </defs>
        <g style={{ mixBlendMode: "screen" }}>
          {petals.map((deg, i) => (
            <path key={i} transform={`rotate(${deg})`} fill="url(#w-petal)"
              /* one long teardrop, repeated round the centre: the overlaps are
                 what make the bloom rather than the individual petal */
              d="M0 -30C118 -150 168 -300 0 -430C-168 -300 -118 -150 0 -30Z"
              opacity={i % 2 ? 0.72 : 1} />
          ))}
          {petals.map((deg, i) => (
            <path key={`s${i}`} transform={`rotate(${deg + 15})`} fill="url(#w-petal)"
              d="M0 -24C74 -110 104 -212 0 -290C-104 -212 -74 -110 0 -24Z" opacity=".55" />
          ))}
        </g>
        <circle r="150" fill="url(#w-core)" />
      </svg>
    </div>
  );
}
