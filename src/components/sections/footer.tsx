import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { siteConfig } from "@/data/site.config";
import { EmailAction } from "@/components/ui/email-action";

const BTN =
  "inline-flex h-10 items-center gap-2 rounded-lg border border-border px-4 text-small font-medium text-foreground transition-colors hover:border-accent hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";

export function Footer() {
  return (
    <footer id="contact" className="border-t border-border/60 px-6 pb-8 pt-12 md:px-12 md:pt-16">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10">
        <div>
          <h2 className="max-w-[18ch] text-balance text-2xl font-semibold leading-tight tracking-tight text-foreground md:text-3xl">
            {siteConfig.availability}.
          </h2>
          <div className="mt-6 flex flex-wrap gap-2.5">
            <EmailAction
              aria-label="Copy email address"
              className="inline-flex h-10 items-center rounded-lg border border-accent bg-accent px-4 text-small font-semibold text-accent-foreground transition-colors hover:bg-accent-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {siteConfig.email}
            </EmailAction>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className={BTN}>
              <GithubIcon className="h-4 w-4" />
              GitHub
            </a>
            <a href={siteConfig.links.linkedin} target="_blank" rel="noopener noreferrer" className={BTN}>
              <LinkedinIcon className="h-4 w-4" />
              LinkedIn
            </a>
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 border-t border-border/60 pt-5 font-mono text-xs text-foreground-subtle">
          <span>
            © {new Date().getFullYear()} {siteConfig.name}
          </span>
          <a href="#main" className="transition-colors hover:text-accent">
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
