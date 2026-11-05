import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

/** Tile tints, in order: mint, sky, blush. Dark text on each stays above 4.5:1. */
const TILE_FILLS = ["bg-mint", "bg-sky", "bg-blush"];

export function Experience({ data = [] }: { data?: any[] }) {
  // Map Sanity schema fields to component expectations
  const normalizedData = data.map((job: any) => {
    const org = job.company || job.org || "Unknown";
    return {
      ...job,
      org,
      period: job.duration || job.period,
      stack: job.tags || job.stack || [],
      highlights:
        job.highlights ||
        (job.description
          ? job.description.map((b: any) => b.children?.[0]?.text).filter(Boolean)
          : []),
      orgUrl:
        job.orgUrl ||
        (org === "HiGigAi"
          ? "https://www.tridentpublicschool.com/"
          : "https://trionixtechnologies.in/"),
      location: job.location || "Remote",
      engineerHighlights: job.engineerHighlights || [],
    };
  });

  // Reverse-chronological order: newest (order 1 / HiGigAi) first
  const sortedData = [...normalizedData].sort((a: any, b: any) => {
    if (a.order !== undefined && b.order !== undefined) return a.order - b.order;
    return 0;
  });

  return (
    <Section id="experience" variant="base">
      <SectionHeading id="experience">Experience</SectionHeading>

      {/* Timeline spine: a thick rule with one dot per role, content open on the page */}
      <div className="relative max-w-4xl pl-10 before:absolute before:bottom-0 before:left-[0.6rem] before:top-2 before:w-[5px] before:rounded-full before:bg-border sm:pl-12">
        {sortedData.map((job: any, i: number) => {
          const isLatest = i === 0;
          const hasTiles = job.metrics && job.metrics.length > 0;

          return (
            <Reveal
              key={job._id || `${job.org}-${job.period}-${i}`}
              delay={i * 0.05}
              className="relative pb-12 last:pb-0"
            >
              <span
                className={`absolute -left-10 top-1 h-[26px] w-[26px] rounded-full border-[5px] border-border sm:-left-12 sm:h-[30px] sm:w-[30px] ${
                  isLatest ? "bg-pink" : "bg-surface"
                }`}
                aria-hidden
              />

              <h3 className="text-2xl font-extrabold leading-tight tracking-tight text-foreground sm:text-3xl">
                {job.role}{" "}
                {job.orgUrl ? (
                  <a
                    href={job.orgUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    @ {job.org}
                  </a>
                ) : (
                  <span className="text-accent">@ {job.org}</span>
                )}
              </h3>
              <p className="mt-2 font-mono text-xs font-medium text-foreground">
                {isLatest ? "Most recent" : "Previous role"} · {job.location ? `${job.location} · ` : ""}
                {job.period}
              </p>

              {/* Impact tiles: three numbers lifted from the bullets */}
              {hasTiles ? (
                <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                  {job.metrics.slice(0, 3).map((m: any, idx: number) => (
                    <div
                      key={m._key || m.label}
                      className={`min-w-0 rounded-xl border-[3px] border-border p-2.5 sm:rounded-2xl sm:p-4 ${TILE_FILLS[idx % TILE_FILLS.length]}`}
                    >
                      <dd className="text-xl font-extrabold leading-none tracking-tight text-foreground tabular-nums sm:text-5xl">
                        {m.value}
                      </dd>
                      <dt className="mt-2 break-words text-xs leading-snug text-foreground sm:text-small">
                        {m.label}
                      </dt>
                    </div>
                  ))}
                </dl>
              ) : null}

              {/* Tech as plain text: one fewer set of boxes */}
              {job.stack && job.stack.length > 0 ? (
                <p className="mt-4 font-mono text-xs text-foreground-muted">{job.stack.join(" · ")}</p>
              ) : null}

              {/* Bullets: open for the latest role, tucked away for earlier ones */}
              <details className="group/details mt-2" open={isLatest || !hasTiles}>
                <summary className="flex min-h-11 w-fit cursor-pointer list-none items-center gap-2 rounded-md font-mono text-small font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent [&::-webkit-details-marker]:hidden">
                  <span
                    className="inline-block transition-transform duration-200 ease-out group-open/details:rotate-90"
                    aria-hidden
                  >
                    ▸
                  </span>
                  Read the details
                </summary>
                <ul className="mt-2 flex flex-col gap-2.5">
                  {job.highlights.map((point: string, idx: number) => (
                    <li
                      key={`${idx}-${point.substring(0, 10)}`}
                      className="flex gap-3 text-body leading-relaxed text-foreground"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
                {job.engineerHighlights && job.engineerHighlights.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2 border-l-[3px] border-border pl-4">
                    {job.engineerHighlights.map((point: string) => (
                      <li key={point} className="text-small text-foreground">
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </details>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
