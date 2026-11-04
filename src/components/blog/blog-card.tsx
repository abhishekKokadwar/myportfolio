import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { formatDate } from "@/lib/format";

export function BlogCard({ post }: { post: PostMeta }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group pop-card pop-press flex touch-manipulation flex-col p-6 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-accent md:p-8"
    >
      <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 font-mono text-xs text-foreground-subtle">
        <time dateTime={post.date}>{formatDate(post.date)}</time>
        <span aria-hidden>·</span>
        <span>{post.readingTime} min</span>
      </div>

      <h3 className="mt-3 flex items-start justify-between gap-3 text-title font-semibold tracking-tight text-foreground">
        <span className="transition-colors group-hover:text-accent">
          {post.title}
        </span>
        <ArrowRight
          className="mt-1.5 h-4 w-4 shrink-0 text-accent transition-transform group-hover:translate-x-1"
          aria-hidden
        />
      </h3>

      {post.description ? (
        <p className="mt-3 max-w-2xl text-body text-foreground-muted leading-relaxed">
          {post.description}
        </p>
      ) : null}

      {post.tags.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="pop-chip px-3 py-1 font-mono text-xs text-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </Link>
  );
}
