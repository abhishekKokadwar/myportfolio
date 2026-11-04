import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";
import { journey as fallbackJourney } from "@/data/journey";

function Milestones({ data }: { data: any[] }) {
  const items = data.length > 0 ? data : fallbackJourney;
  const years = [...new Set(items.map((m: any) => m.year || "2023"))].sort(
    (a, b) => Number(a) - Number(b)
  );
  return (
    <details className="group mx-auto mt-8 max-w-4xl">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-small text-foreground-muted transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
        <span className="transition-transform group-open:rotate-90" aria-hidden>▸</span>
        Earlier milestones ({items.length})
      </summary>
      <div className="mt-4 flex flex-col divide-y divide-border/40 border-y border-border/40">
        {years.map((y) => (
          <div key={y} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-12 md:gap-8">
            <span className="font-mono text-small font-semibold text-foreground md:col-span-2">{y}</span>
            <ul className="flex flex-col gap-3 md:col-span-10">
              {items
                .filter((m: any) => (m.year || "2023") === y)
                .map((m: any, i: number) => (
                  <li key={m._id || `${y}-${i}`} className="text-small leading-relaxed text-foreground-muted">
                    <span className="font-medium text-foreground">{m.title}</span>
                    {m.summary ? <> — {m.summary}</> : null}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

export function Experience({ data = [], journey = [] }: { data?: any[]; journey?: any[] }) {
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
                className={`relative overflow-hidden rounded-2xl transition-all ${
                  isLatest
                    ? "border border-border/90 bg-[#17181c] p-6 sm:p-8 shadow-2xl shadow-black/30 ring-1 ring-white/[0.06] before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-accent/50 before:to-transparent hover:border-accent/40"
                    : "border border-border/40 bg-surface/30 p-6 sm:p-8 hover:bg-surface/50 hover:border-border/60"
                }`}
              >
                {/* Status Indicator & Period */}
                <div className="mb-2.5 flex items-center justify-between">
                  {isLatest ? (
                    <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-accent">
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

                {/* Bullet Points with Substantive Accomplishments */}
                <ul className="mt-5 flex flex-col gap-2.5">
                  {job.highlights.map((point: string, idx: number) => (
                    <li
                      key={`${idx}-${point.substring(0, 10)}`}
                      className="flex gap-3 text-body text-foreground-muted leading-relaxed"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {job.engineerHighlights && job.engineerHighlights.length > 0 ? (
                  <ul className="mt-3 flex flex-col gap-2 border-l-2 border-border pl-4">
                    {job.engineerHighlights.map((point: string) => (
                      <li key={point} className="text-small text-foreground-muted">
                        {point}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {/* Tech Stack Tags */}
                {job.stack && job.stack.length > 0 ? (
                  <div className="mt-5 flex flex-wrap gap-2 pt-2 border-t border-border/30">
                    {job.stack.map((tech: string) => (
                      <span
                        key={tech}
                        className="rounded-full border border-border/80 bg-background px-3 py-1 font-mono text-xs text-foreground-subtle"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                ) : null}
              </article>
            </Reveal>
          );
        })}
      </div>

      <Reveal>
        <Milestones data={journey} />
      </Reveal>
    </Section>
  );
}
