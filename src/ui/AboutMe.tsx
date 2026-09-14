import Reveal from "./Reveal";
import { useAbout, type AboutRow } from "../desktop/useAbout";
import { HEADLINE_CLAIM, spell } from "../lib/claims";

/* The person, on the front door. Reads the same `about` table the shells do,
   so it is written once and appears everywhere.

   The split the site is built on: this page carries the PERSON, the shells
   carry the WORK. So the whole CV belongs here, not a teaser for it. It is
   also the only crawlable surface, since the work index is hidden and the
   shells sit behind a lock screen. */
export default function AboutMe() {
  const { of, loaded } = useAbout();
  const summary = of("summary")[0];
  const experience = of("experience");
  const education = of("education");
  const teaching = of("teaching");
  const skills = of("skills");

  if (!loaded || (!summary && !experience.length)) return null;

  return (
    <section id="about" className="relative z-10 bg-void px-gutter pt-act">
      <div className="mx-auto max-w-6xl">
        <Reveal className="flex flex-col gap-6 pb-12">
          <div data-reveal className="flex items-center gap-4">
            <span className="hud text-bone">03</span>
            <span className="hairline w-16" />
            <span className="hud">About</span>
          </div>
          {/* Every other section leads with a display headline; without one
              this read as a paragraph rather than a section. The claim is
              deliberately NOT the decade/four-years line from Act I: it says
              the thing nothing else on the page says. */}
          <h2 data-reveal className="display max-w-3xl text-section">
            {spell(HEADLINE_CLAIM.countries)} countries. {spell(HEADLINE_CLAIM.teams)} teams. More than {spell(HEADLINE_CLAIM.trained).toLowerCase()} people trained.
          </h2>
          {summary?.items.slice(0, 2).map((para, i) => (
            <p key={i} data-reveal className="max-w-2xl text-lead leading-relaxed text-ghost">
              {para}
            </p>
          ))}
        </Reveal>

        {!!experience.length && (
          <Reveal stagger={0.05}>
            <Label>Experience</Label>
            <ol className="border-t border-edge/60">
              {experience.map((r) => (
                <li key={r.id} data-reveal className="border-b border-edge/60 py-6">
                  <div className="grid gap-x-8 gap-y-1 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
                    <div>
                      <p className="text-row leading-tight text-bone">{r.subtitle}</p>
                      <p className="pt-1 text-small text-ghost">
                        {r.title}{r.meta ? ` · ${r.meta}` : ""}
                      </p>
                      <p className="hud pt-2">{r.period}</p>
                    </div>
                    {!!r.items.length && <Bullets items={r.items} />}
                  </div>
                </li>
              ))}
            </ol>
          </Reveal>
        )}

        {/* Skills as flowed rows rather than pills. Thirty-three chips would
            be the loudest thing on a page built from hairlines, and a label
            plus one flowed line reads faster anyway. */}
        {!!skills.length && (
          <Reveal stagger={0.04}>
            <Label className="pt-16">Skills</Label>
            <dl className="border-t border-edge/60">
              {skills.map((r) => (
                <div key={r.id} data-reveal
                  className="grid gap-x-8 gap-y-1 border-b border-edge/60 py-5 sm:grid-cols-[minmax(0,10rem)_minmax(0,1fr)]">
                  <dt className="text-small text-bone">{r.title}</dt>
                  <dd className="text-small leading-relaxed text-faint">
                    {r.items.join(" · ")}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        )}

        {(!!education.length || !!teaching.length) && (
          <div className="grid gap-x-16 gap-y-12 pt-16 lg:grid-cols-2">
            {!!education.length && (
              <Reveal stagger={0.04}>
                <Label>Education and certifications</Label>
                <dl className="border-t border-edge/60">
                  {education.map((r) => (
                    <div key={r.id} data-reveal
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-edge/60 py-4">
                      <dt className="min-w-0 flex-1 text-small leading-snug text-bone">{r.subtitle}</dt>
                      <dd className="hud shrink-0">{r.period}</dd>
                      <dd className="w-full text-small text-ghost">
                        {r.title}{r.meta ? `, ${r.meta}` : ""}
                      </dd>
                    </div>
                  ))}
                </dl>
              </Reveal>
            )}

            {teaching.map((t) => (
              <Reveal key={t.id} stagger={0.04}>
                <Label>{t.title}</Label>
                <div className="border-t border-edge/60 pt-5">
                  <Bullets items={t.items} />
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p data-reveal className={`hud pb-5 ${className}`}>{children}</p>;
}

/* A middot, not a dash: the house rule bans em dashes in anything a reader
   sees, and a hyphen at this weight reads as a stray character. */
function Bullets({ items }: { items: AboutRow["items"] }) {
  return (
    <ul className="space-y-1.5 pt-2 sm:pt-0">
      {items.map((b, i) => (
        <li key={i} className="flex gap-2.5 text-small leading-relaxed text-faint">
          <span aria-hidden className="select-none pt-[2px] text-bone/25">·</span>
          <span>{b}</span>
        </li>
      ))}
    </ul>
  );
}
