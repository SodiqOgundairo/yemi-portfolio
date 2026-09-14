import type { AboutRow } from "./useAbout";

/* The person: experience, education, skills, teaching. Shared by every shell
   and styled entirely from --os-* tokens, so a shell changes its look by
   setting variables rather than by owning a copy of these. */

export function Scroll({ children }: { children: React.ReactNode }) {
  return <div className="h-full overflow-y-auto bg-[var(--os-bg)] px-6 py-5 text-[13px] text-[var(--os-text)]">{children}</div>;
}

export function Head({ children }: { children: React.ReactNode }) {
  return <h2 className="pb-4 text-[11px] uppercase tracking-[0.18em] text-[var(--os-dim)]">{children}</h2>;
}

export function Experience({ rows }: { rows: AboutRow[] }) {
  return (
    <Scroll>
      <Head>Professional experience</Head>
      <ol className="relative border-l border-[var(--os-line)] pl-5">
        {rows.map((r) => (
          <li key={r.id} className="relative pb-7 last:pb-0">
            <span className="absolute -left-[25px] top-[5px] h-[9px] w-[9px] rounded-full bg-[var(--os-accent)]" />
            <p className="text-[14px] font-semibold">{r.subtitle}</p>
            <p className="pt-[2px] text-[13px] text-[var(--os-text)] opacity-80">
              {r.title}{r.meta ? ` · ${r.meta}` : ""}
            </p>
            <p className="pt-[2px] text-[11px] uppercase tracking-wider text-[var(--os-dim)]">{r.period}</p>
            {!!r.items.length && (
              <ul className="list-disc space-y-1.5 pl-4 pt-2.5 text-[12.5px] leading-relaxed text-[var(--os-text)] opacity-75 marker:text-[var(--os-dim)]">
                {r.items.map((b, i) => <li key={i}>{b}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </Scroll>
  );
}

export function Education({ rows, teaching }: { rows: AboutRow[]; teaching: AboutRow[] }) {
  return (
    <Scroll>
      <Head>Education and certifications</Head>
      <dl>
        {rows.map((r) => (
          <div key={r.id} className="flex flex-wrap items-baseline gap-x-3 border-b border-[var(--os-line)] py-2.5 last:border-0">
            <dt className="text-[13.5px] font-medium">{r.subtitle}</dt>
            <dd className="text-[12.5px] opacity-70">{r.title}{r.meta ? `, ${r.meta}` : ""}</dd>
            <dd className="ml-auto text-[11px] uppercase tracking-wider text-[var(--os-dim)]">{r.period}</dd>
          </div>
        ))}
      </dl>
      {teaching.map((t) => (
        <div key={t.id} className="pt-8">
          <Head>{t.title}</Head>
          <ul className="list-disc space-y-1.5 pl-4 text-[12.5px] leading-relaxed opacity-75 marker:text-[var(--os-dim)]">
            {t.items.map((b, i) => <li key={i}>{b}</li>)}
          </ul>
        </div>
      ))}
    </Scroll>
  );
}

export function Skills({ rows }: { rows: AboutRow[] }) {
  return (
    <Scroll>
      <Head>Core skills</Head>
      <div className="space-y-5">
        {rows.map((r) => (
          <div key={r.id}>
            <p className="pb-2 text-[12px] font-semibold">{r.title}</p>
            <ul className="flex flex-wrap gap-1.5">
              {r.items.map((s) => (
                <li key={s} className="rounded-[5px] border border-[var(--os-line)] bg-[var(--os-panel)] px-2 py-[3px] text-[11.5px] opacity-85">
                  {s}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Scroll>
  );
}

export function Summary({
  rows, counts,
}: { rows: AboutRow[]; counts: { total: number; open: number } }) {
  const s = rows[0];
  return (
    <Scroll>
      <div className="flex flex-col items-center pb-6 pt-2 text-center">
        <span className="grid h-[70px] w-[70px] place-items-center rounded-[18px] bg-[var(--os-accent)] text-[28px] font-semibold text-white">Y</span>
        <p className="pt-3 text-[19px] font-semibold">Yemi Ogundairo</p>
        <p className="pt-1 text-[12.5px] text-[var(--os-dim)]">Design Engineer · Product Designer</p>
      </div>
      {s?.items.map((para, i) => (
        <p key={i} className="pb-3 text-[13px] leading-relaxed opacity-80">{para}</p>
      ))}
      <dl className="mt-4 grid grid-cols-2 gap-3 border-t border-[var(--os-line)] pt-4">
        <Stat n={counts.total} label="projects listed" />
        <Stat n={counts.open} label="written up" />
      </dl>
      <p className="pt-6 text-[11px] text-[var(--os-dim)]">
        Ogun, Nigeria · open to remote
      </p>
    </Scroll>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div>
      <dt className="text-[22px] font-semibold">{n}</dt>
      <dd className="text-[10px] uppercase tracking-wider text-[var(--os-dim)]">{label}</dd>
    </div>
  );
}
