import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { RailSection } from "@/components/ui/rail";
import { Reveal } from "@/components/ui/reveal";
import { formatDate } from "@/lib/format";
import type { PostMeta } from "@/lib/blog";

export function Blog({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <RailSection id="writing" index="04" label="Writing">
      <ul className="flex flex-col">
        {posts.slice(0, 3).map((post, i) => (
          <Reveal key={post.slug} delay={i * 0.04}>
            <li className="group relative grid grid-cols-1 gap-1.5 border-b border-border/60 py-5 first:pt-0 md:grid-cols-[150px_1fr] md:gap-6">
              <span className="pt-0.5 font-mono text-xs text-foreground-subtle">
                {formatDate(post.date)} · {post.readingTime} min
              </span>
              <div className="min-w-0">
                <h3 className="text-base font-semibold tracking-tight text-foreground transition-colors group-hover:text-accent">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-lg focus-visible:after:ring-2 focus-visible:after:ring-accent"
                  >
                    {post.title}
                  </Link>
                </h3>
                {post.description ? (
                  <p className="mt-1.5 max-w-[62ch] text-small leading-relaxed text-foreground-muted">{post.description}</p>
                ) : null}
              </div>
            </li>
          </Reveal>
        ))}
      </ul>
      <Link
        href="/blog"
        className="mt-5 inline-flex items-center gap-1.5 font-mono text-small text-foreground-muted transition-colors hover:text-accent"
      >
        All posts
        <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </Link>
    </RailSection>
  );
}
