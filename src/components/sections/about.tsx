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
import { Section, SectionHeading } from "@/components/ui/section";
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

// Tile layout: the first item is the wide tile, the stat tile sits beside it,
// then two half tiles. Any item after the third becomes the status strip.
const TILE_STYLES = [
  "bg-surface",
  "bg-mint",
  "bg-blush",
];

export function About({
  data,
  skills,
  mergedPrs,
}: {
  data?: any;
  skills?: any[];
  mergedPrs?: number;
}) {
  // Use Sanity items if available, otherwise fall back to siteConfig.about
  const items: any[] =
    data?.items && data.items.length > 0 ? data.items : [...siteConfig.about];
  const tiles = items.slice(0, 3);
  const status = items[3];

  const tile = (item: any, i: number) => {
    const Icon = item.icon ? ICONS[item.icon] : null;
    return (
      <div
        key={item.specLabel || i}
        className={`pop-card flex h-full flex-col p-5 sm:p-6 ${TILE_STYLES[i]}`}
      >
        <span className="flex items-center gap-2 font-mono text-xs font-medium uppercase tracking-wider text-foreground">
          {Icon ? <Icon className="h-4 w-4 text-accent" aria-hidden /> : null}
          {item.specLabel}
        </span>
        <h3 className="mt-3 text-xl font-extrabold leading-tight tracking-tight text-foreground sm:text-2xl">
          {item.label}
        </h3>
        {item.meta ? (
          <p className="mt-1 font-mono text-xs text-foreground-muted">{item.meta}</p>
        ) : null}
        {item.description ? (
          <p className="mt-3 text-small leading-relaxed text-foreground">{item.description}</p>
        ) : null}
      </div>
    );
  };

  return (
    <Section id="about" variant="raised">
      <SectionHeading id="about">About</SectionHeading>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-6">
        <Reveal className="md:col-span-4">{tiles[0] ? tile(tiles[0], 0) : null}</Reveal>

        {mergedPrs ? (
          <Reveal className="md:col-span-2" delay={0.05}>
            <div className="pop-card flex h-full flex-col justify-between bg-sky p-5 sm:p-6">
              <span className="font-mono text-xs font-medium uppercase tracking-wider text-foreground">
                Open source
              </span>
              <div>
                <div className="font-mono text-6xl font-bold leading-none tracking-tight text-foreground">
                  {mergedPrs}
                </div>
                <p className="mt-2 text-small text-foreground">merged PRs in Kubeflow and Karmada</p>
              </div>
            </div>
          </Reveal>
        ) : null}

        {tiles[1] ? (
          <Reveal className="md:col-span-3" delay={0.1}>
            {tile(tiles[1], 1)}
          </Reveal>
        ) : null}
        {tiles[2] ? (
          <Reveal className="md:col-span-3" delay={0.15}>
            {tile(tiles[2], 2)}
          </Reveal>
        ) : null}
      </div>

      {status ? (
        <Reveal>
          <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 text-small text-foreground">
            <span className="pop-chip bg-mint px-3 py-1 font-mono text-xs font-medium">
              {status.label}
            </span>
            {status.meta ? <span className="font-mono text-xs">{status.meta}</span> : null}
          </p>
        </Reveal>
      ) : null}

      <SkillsStrip data={skills} />
    </Section>
  );
}
