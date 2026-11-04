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

      <div className="flex flex-col gap-6 max-w-4xl mx-auto">
        {sortedData.map((job: any, i: number) => {
          const isLatest = i === 0;

          return (
            <Reveal key={job._id || `${job.org}-${job.period}-${i}`} delay={i * 0.05}>
              <article
                className={`relative overflow-hidden ${
                  isLatest
                    ? "pop-card bg-surface p-6 sm:p-8"
                    : "pop-card bg-surface p-6 sm:p-8"
                }`}
              >
                {/* Status Indicator & Period */}
                <div className="mb-2.5 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                  {isLatest ? (
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap font-mono text-xs font-semibold text-accent">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
                      Most Recent
                    </span>
                  ) : (
                    <span className="font-mono text-xs text-foreground-subtle">
                      Previous Role
                    </span>
                  )}
                  <span className="font-mono text-xs text-foreground-subtle">
                    {job.location ? `${job.location} · ` : ""}{job.period}
                  </span>
                </div>

                {/* Left-Aligned Header */}
                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-x-4 gap-y-1">
                  <h3 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">
                    {job.role}{" "}
                    {job.orgUrl ? (
                      <a
                        href={job.orgUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent underline-offset-4 transition-colors hover:text-accent-hover hover:underline"
                      >
                        @ {job.org}
                      </a>
                    ) : (
                      <span className="text-accent">@ {job.org}</span>
                    )}
                  </h3>
                </div>

                {/* Impact tiles: three numbers lifted from the bullets */}
                {job.metrics && job.metrics.length > 0 ? (
                  <dl className="mt-5 grid grid-cols-3 gap-2 sm:gap-3">
                    {job.metrics.slice(0, 3).map((m: any, idx: number) => (
                      <div
                        key={m._key || m.label}
                        className={`min-w-0 rounded-xl border-[3px] border-border p-2.5 sm:rounded-2xl sm:p-4 ${TILE_FILLS[idx % TILE_FILLS.length]}`}
                      >
                        <dd className="text-xl font-extrabold leading-none tracking-tight text-foreground tabular-nums sm:text-5xl">
                          {m.value}
                        </dd>
                        <dt className="mt-2 break-words text-xs leading-snug text-foreground sm:text-small">{m.label}</dt>
                      </div>
                    ))}
                  </dl>
                ) : null}

                {/* Tech Stack Tags */}
                {job.stack && job.stack.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {job.stack.map((tech: string) => (
                      <span
                        key={tech}
                        className="pop-chip px-3 py-1 font-mono text-xs text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}

                {/* Full bullets. With no tiles there is nothing to lead with, so show them open. */}
                <details
                  className="group/details mt-4"
                  open={!(job.metrics && job.metrics.length > 0)}
                >
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
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
