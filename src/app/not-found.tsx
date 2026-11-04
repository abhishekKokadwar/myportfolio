import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 py-20 text-center">
      <div className="w-full max-w-md pop-card p-7 sm:p-8 text-left">
        <div className="flex items-center justify-between border-b border-border/60 pb-3 mb-4 font-mono text-xs text-foreground-subtle">
          <span>// 404 NOT FOUND</span>
          <span className="text-red-600">exit 127</span>
        </div>

        <p className="font-mono text-small text-foreground">
          <span className="text-accent mr-2 font-bold">❯</span>
          <span className="text-red-600">command not found:</span> target route
        </p>
        <p className="mt-2 font-mono text-xs text-foreground-muted leading-relaxed">
          The requested path does not exist in this environment.
        </p>

        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 pop-btn bg-accent text-accent-foreground px-4 py-2 font-mono text-xs font-medium transition-all"
          >
            <span>cd ~</span>
            <span>↵</span>
          </Link>
          <span className="font-mono text-xs text-foreground-subtle">
            status: unresolved
          </span>
        </div>
      </div>
    </div>
  );
}
