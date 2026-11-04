import { FileText, Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/data/site.config";
import { EmailAction } from "@/components/ui/email-action";

const EXPLORING = [
  { label: "AI Security", fill: "bg-pink" },
  { label: "Agent Systems", fill: "bg-mint" },
  { label: "Distributed Systems", fill: "bg-sky" },
];

/** Square icon button: white on the black band, presses down on hover. */
const ICON_BTN =
  "inline-flex h-12 w-12 touch-manipulation items-center justify-center rounded-xl border-[3px] border-white bg-foreground text-white shadow-[4px_4px_0_#fff] transition-[transform,box-shadow] duration-150 hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground";

export function Footer({ resumeUrl }: { resumeUrl?: string }) {
  return (
    <footer
      id="contact"
      className="border-t-[3px] border-border bg-foreground px-6 py-16 text-white md:px-12 md:py-24"
    >
      <div className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 font-mono text-xs text-white/80">Currently exploring</span>
          {EXPLORING.map((t) => (
            <span
              key={t.label}
              className={`rounded-full border-2 border-white px-3 py-1 font-mono text-xs font-medium text-foreground ${t.fill}`}
            >
              {t.label}
            </span>
          ))}
        </div>

        <p className="mt-10 font-mono text-sm text-mint">
          <span aria-hidden>$ </span>git commit -m &quot;let&apos;s build&quot;
        </p>
        <h2 className="mt-3 text-5xl font-extrabold leading-[0.95] tracking-tight sm:text-6xl md:text-8xl">
          Open to{" "}
          <span className="inline-block -rotate-1 rounded-xl bg-pink px-3 text-foreground">
            internships
          </span>
          .
        </h2>

        <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-5">
          <EmailAction
            aria-label="Copy email address"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl border-[3px] border-white bg-accent px-5 font-bold text-white shadow-[4px_4px_0_#fff] transition-[transform,box-shadow] duration-150 hover:translate-x-1 hover:translate-y-1 hover:shadow-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-foreground"
          >
            <Mail className="h-5 w-5" aria-hidden />
            <span className="font-mono text-small sm:text-body">{siteConfig.email}</span>
          </EmailAction>

          <div className="flex items-center gap-3">
            <a
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              className={ICON_BTN}
            >
              <GithubIcon className="h-5 w-5" />
            </a>
            <a
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className={ICON_BTN}
            >
              <LinkedinIcon className="h-5 w-5" />
            </a>
            <a
              href={resumeUrl || siteConfig.links.resume}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Résumé"
              className={ICON_BTN}
            >
              <FileText className="h-5 w-5" aria-hidden />
            </a>
          </div>
        </div>

        <div className="mt-16 flex items-center justify-between gap-4 border-t-2 border-white/25 pt-6 font-mono text-xs text-white/80">
          <p className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} {siteConfig.name}</span>
            <span aria-hidden>·</span>
            <span>exit 0</span>
          </p>
          <a
            href="#main"
            className="inline-flex min-h-11 items-center transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            cd ~ ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
