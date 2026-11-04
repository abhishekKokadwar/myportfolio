import { RailSection } from "@/components/ui/rail";
import { Reveal } from "@/components/ui/reveal";
import { journey as fallbackJourney } from "@/data/journey";

type Job = {
  _id?: string;
  company: string;
  role: string;
  duration?: string;
  order?: number;
  description?: { children?: { text?: string }[] }[];
  tags?: string[];
};

type Milestone = {
  _id?: string;
  year?: string;
  title: string;
  summary?: string;
  detail?: string;
  tags?: string[];
  link?: { label: string; href: string };
};

function Milestones({ data }: { data: Milestone[] }) {
  const items = data.length > 0 ? data : (fallbackJourney as unknown as Milestone[]);
  const years = [...new Set(items.map((m) => m.year || "2023"))].sort((a, b) => Number(a) - Number(b));
  return (
    <details className="group mt-6">
      <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-small text-foreground-muted transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
        <span className="transition-transform group-open:rotate-90" aria-hidden>▸</span>
        Earlier milestones ({items.length})
      </summary>
      <div className="mt-4 flex flex-col divide-y divide-border/60 border-y border-border/60">
        {years.map((y) => (
          <div key={y} className="grid grid-cols-1 gap-2 py-4 md:grid-cols-[150px_1fr] md:gap-6">
            <span className="font-mono text-xs text-foreground-subtle">{y}</span>
            <ul className="flex flex-col gap-3">
              {items
                .filter((m) => (m.year || "2023") === y)
                .map((m, i) => (
                  <li key={m._id || `${y}-${i}`} className="text-small leading-relaxed text-foreground-muted">
                    <span className="font-medium text-foreground">{m.title}</span>
                    {m.summary ? <> — {m.summary}</> : null}
                    {m.detail || m.link || (m.tags && m.tags.length > 0) ? (
                      <details className="mt-1.5 rounded-lg border border-border/60 px-3 py-2">
                        <summary className="cursor-pointer font-mono text-xs text-foreground-subtle hover:text-accent">more</summary>
                        {m.detail ? <p className="mt-2">{m.detail}</p> : null}
                        {m.tags && m.tags.length > 0 ? (
                          <p className="mt-2 font-mono text-xs text-foreground-subtle">{m.tags.join(" · ")}</p>
                        ) : null}
                        {m.link ? (
                          <a href={m.link.href} className="mt-2 inline-block text-xs font-semibold text-accent hover:text-accent-hover">
                            {m.link.label} →
                          </a>
                        ) : null}
                      </details>
                    ) : null}
                  </li>
                ))}
            </ul>
          </div>
        ))}
      </div>
    </details>
  );
}

export function Experience({ data = [], journey = [] }: { data?: Job[]; journey?: Milestone[] }) {
  const jobs = [...data].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  return (
    <RailSection id="experience" index="03" label="Experience">
      <ul className="flex flex-col">
        {jobs.map((job, i) => {
          const points = (job.description ?? [])
            .map((b) => b.children?.[0]?.text)
            .filter((t): t is string => Boolean(t));
          const [lead, ...rest] = points;
          return (
            <Reveal key={job._id || `${job.company}-${i}`} delay={i * 0.04}>
              <li className="grid grid-cols-1 gap-1.5 border-b border-border/60 py-5 first:pt-0 md:grid-cols-[150px_1fr] md:gap-6">
                <span className="pt-0.5 font-mono text-xs text-foreground-subtle">{job.duration}</span>
                <div className="min-w-0">
                  <h3 className="text-base font-semibold tracking-tight text-foreground">
                    {job.role}, {job.company}
                  </h3>
                  {lead ? (
                    <p className="mt-1.5 max-w-[62ch] text-small leading-relaxed text-foreground-muted">{lead}</p>
                  ) : null}
                  {rest.length > 0 ? (
                    <details className="group mt-2">
                      <summary className="inline-flex cursor-pointer list-none items-center gap-2 font-mono text-xs text-foreground-subtle transition-colors hover:text-accent [&::-webkit-details-marker]:hidden">
                        <span className="transition-transform group-open:rotate-90" aria-hidden>▸</span>
                        {rest.length} more
                      </summary>
                      <ul className="mt-2 flex max-w-[62ch] flex-col gap-2 text-small leading-relaxed text-foreground-muted">
                        {rest.map((t) => (
                          <li key={t.slice(0, 24)} className="flex gap-3">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden />
                            <span>{t}</span>
                          </li>
                        ))}
                      </ul>
                      {job.tags && job.tags.length > 0 ? (
                        <p className="mt-3 font-mono text-xs text-foreground-subtle">{job.tags.join(" · ")}</p>
                      ) : null}
                    </details>
                  ) : null}
                </div>
              </li>
            </Reveal>
          );
        })}
      </ul>
      <Milestones data={journey} />
    </RailSection>
  );
}
