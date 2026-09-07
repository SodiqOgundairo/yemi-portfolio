import { useEffect, useState } from "react";
import World from "./three/World";
import Cursor from "./ui/Cursor";
import Preloader from "./ui/Preloader";
import Station from "./ui/Station";
import { useScrollProgress } from "./lib/useScrollProgress";
import { initSmoothScroll } from "./lib/smooth";

export default function App() {
  const progress = useScrollProgress();
  const [ready, setReady] = useState(false);

  // Stations 01 and 02 fly close, so the subject spills across the left where
  // the type lives. Ramp the scrim through that stretch only.
  // Station 01 flies close and needs heavy cover. Station 02 does NOT: its
  // subject is bright screenshots sitting well right of the type, and a strong
  // scrim there just dims the work, which is the one thing that must stay lit.
  const scrimK = (() => {
    const p = progress;
    if (p < 0.10) return 0;
    if (p < 0.26) return (p - 0.10) / 0.16;
    if (p < 0.34) return 1;
    if (p < 0.42) return 1 - ((p - 0.34) / 0.08) * 0.7;
    if (p < 0.62) return 0.3;
    if (p < 0.76) return 0.3 * (1 - (p - 0.62) / 0.14);
    return 0;
  })();
  useEffect(() => initSmoothScroll(), []);

  return (
    <>
      <Preloader ready={ready} />
      <Cursor />
      <World progress={progress} onReady={() => setReady(true)} />
      <div
        className="scrim pointer-events-none fixed inset-0 z-[1] transition-[--scrim-k] duration-300"
        style={{ ["--scrim-k" as string]: scrimK.toFixed(3) }}
      />

      {/* fixed chrome: reads as an instrument panel, always on */}
      <header className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="hud text-bone">Ogundairo</span>
        <span className="hud hidden sm:block">Design Engineer</span>
        <a href="#contact" className="hud transition-colors hover:text-bone">Contact</a>
      </header>
      <div className="pointer-events-none fixed bottom-6 left-6 z-40 hidden sm:block">
        <span className="hud">{String(Math.round(progress * 100)).padStart(3, "0")}</span>
      </div>

      <main className="relative z-10">
        <Station id="hero" index="00" label="Design Engineer">
          <h1 data-reveal className="display text-[13vw] leading-[0.86] sm:text-[9vw] lg:text-[7.5rem]">
            Yemi<br />Ogundairo
          </h1>
          <p data-reveal className="max-w-md text-lg leading-relaxed text-ghost">
            I design the system, then ship it. Design systems, multi-tenant SaaS,
            mobile and native desktop.
          </p>
        </Station>

        <Station id="about" index="01" label="Approach" align="right">
          <h2 data-reveal className="display max-w-xl text-4xl sm:text-6xl">
            Design and engineering are one job.
          </h2>
          <p data-reveal className="max-w-md text-lg leading-relaxed text-ghost">
            A decade in design, four years shipping the code behind it. The handoff
            never happens because there is nobody to hand off to.
          </p>
        </Station>

        <Station id="work" index="02" label="Selected Work">
          <h2 data-reveal className="display max-w-xl text-4xl sm:text-6xl">Things I built and shipped.</h2>
          <p data-reveal className="max-w-md text-lg leading-relaxed text-ghost">
            Fourteen-module SaaS. A published component library. Two apps on the store.
            Native desktop in Electron and Tauri.
          </p>
        </Station>

        <Station id="craft" index="03" label="Craft" align="center">
          <h2 data-reveal className="display max-w-2xl text-4xl sm:text-6xl">
            Built alone, mostly. Taught to three hundred.
          </h2>
        </Station>

        <Station id="contact" index="04" label="Contact" align="center">
          <h2 data-reveal className="display text-5xl sm:text-7xl">Let's talk.</h2>
          <a data-reveal href="mailto:ogundairosodiq954@gmail.com"
             className="text-lg text-ghost underline-offset-8 transition-colors hover:text-bone hover:underline">
            ogundairosodiq954@gmail.com
          </a>
        </Station>
      </main>
    </>
  );
}
