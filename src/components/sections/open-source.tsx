import { ArrowUpRight } from "lucide-react";
import { Section, SectionHeading } from "@/components/ui/section";
import { Reveal } from "@/components/ui/reveal";

type Contribution = {
  _id: string;
  kind?: "pr" | "membership";
  repo: string;
  number?: number;
  title: string;
  url: string;
  status: "merged" | "open" | "closed";
  date?: string;
  impact?: string;
  featured?: boolean;
};

const ALL_MERGED =
  "https://github.com/pulls?q=is%3Apr+is%3Amerged+author%3AabhishekKokadwar+-user%3AabhishekKokadwar+-repo%3Anabrahma%2FMCP_Zero-Trust_Gateway_BTP";

export function OpenSource({ data = [] }: { data?: Contribution[] }) {
  const merged = data.filter((c) => c.kind !== "membership" && c.status === "merged");
  if (merged.length === 0) return null;

  const projects = new Set(merged.map((c) => c.repo.split("/")[1]));
  const orgs = new Set(merged.map((c) => c.repo.split("/")[0]));
  const isMember = data.some((c) => c.kind === "membership");
  const featured = data.filter((c) => c.featured && c.kind !== "membership");

  return (
    <Section id="open-source" variant="raised">
      <SectionHeading id="open-source">Open Source</SectionHeading>

      <Reveal>
        <p className="max-w-2xl text-body-lg text-foreground-muted leading-relaxed">
          <span className="font-semibold text-foreground">{merged.length} merged PRs</span> across{" "}
          {projects.size} projects in {[...orgs].join(" and ")}
          {isMember ? ", and a Kubeflow organization member" : ""}. Each went through maintainer code review.
        </p>
      </Reveal>

      <div className="mt-8 border-y border-black/[0.06] dark:border-white/[0.06] divide-y divide-black/[0.06] dark:divide-white/[0.06]">
        {featured.map((c, i) => (
          <Reveal key={c._id} delay={i * 0.04}>
            <a
              href={c.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group grid grid-cols-1 gap-2 px-2 py-5 sm:px-3 -mx-2 sm:-mx-3 rounded-lg transition-colors hover:bg-surface/30 md:grid-cols-12 md:gap-8"
            >
              <div className="md:col-span-4 flex items-center gap-2 font-mono text-xs text-foreground-muted">
                <span className="truncate">{c.repo}</span>
                {c.number ? <span className="text-foreground-subtle">#{c.number}</span> : null}
              </div>
              <div className="md:col-span-8 flex flex-col gap-1.5">
                <h3 className="flex items-start justify-between gap-3 text-body font-semibold tracking-tight text-foreground">
                  <span>{c.title}</span>
                  <ArrowUpRight
                    className="mt-1 h-4 w-4 shrink-0 text-foreground-subtle transition-colors group-hover:text-accent"
                    aria-hidden
                  />
                </h3>
                {c.impact ? (
                  <p className="text-small text-foreground-muted leading-relaxed">{c.impact}</p>
                ) : null}
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      <Reveal>
        <a
          href={ALL_MERGED}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-1.5 font-mono text-small text-foreground-muted transition-colors hover:text-accent"
        >
          All {merged.length} merged PRs on GitHub
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden />
        </a>
      </Reveal>
    </Section>
  );
}
