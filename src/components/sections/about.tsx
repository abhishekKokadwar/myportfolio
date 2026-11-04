import {
  MapPin,
  Code2,
  ShieldCheck,
  Rocket,
  GraduationCap,
  Trophy,
  Terminal,
  Brain,
  type LucideIcon,
} from "lucide-react";
import { RailSection } from "@/components/ui/rail";
import { Reveal } from "@/components/ui/reveal";
import { siteConfig } from "@/data/site.config";
import { SkillsStrip } from "@/components/sections/skills";

const ICONS: Record<string, LucideIcon> = {
  "map-pin": MapPin,
  code: Code2,
  shield: ShieldCheck,
  rocket: Rocket,
  graduation: GraduationCap,
  trophy: Trophy,
  terminal: Terminal,
  brain: Brain,
};

type AboutItem = {
  specLabel?: string;
  label: string;
  meta?: string;
  description?: string;
  icon?: string;
};

export function About({
  data,
  skills,
}: {
  data?: { items?: AboutItem[] } | null;
  skills?: any[];
}) {
  const items: readonly AboutItem[] =
    data?.items && data.items.length > 0 ? data.items : siteConfig.about;

  return (
    <RailSection id="about" index="01" label="About">
      <div className="border-y border-border/60 divide-y divide-border/60">
        {items.map((item, i) => {
          const Icon = item.icon ? ICONS[item.icon] : null;
          return (
            <Reveal key={item.specLabel || i} delay={i * 0.04}>
              <div className="grid grid-cols-1 gap-2 py-5 md:grid-cols-[150px_1fr] md:gap-6">
                <span className="pt-0.5 font-mono text-xs uppercase tracking-[0.04em] text-foreground-subtle">
                  {item.specLabel}
                </span>
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                    <h3 className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-foreground">
                      {Icon ? <Icon className="h-[18px] w-[18px] shrink-0 text-accent" aria-hidden /> : null}
                      {item.label}
                    </h3>
                    {item.meta ? (
                      <span className="font-mono text-xs text-foreground-subtle">{item.meta}</span>
                    ) : null}
                  </div>
                  {item.description ? (
                    <p className="mt-1.5 max-w-[62ch] text-small leading-relaxed text-foreground-muted">
                      {item.description}
                    </p>
                  ) : null}
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>

      <SkillsStrip data={skills} />
    </RailSection>
  );
}
