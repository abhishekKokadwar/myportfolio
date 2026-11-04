"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Keeps an open tab fresh: re-fetches the server-rendered page every `everyMs`
 * and whenever the tab becomes visible again. The server side is ISR-cached
 * (5 min), so this only pulls in data that has already been revalidated.
 */
export function LiveRefresh({ everyMs = 300_000 }: { everyMs?: number }) {
  const router = useRouter();
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") router.refresh();
    };
    const id = setInterval(refresh, everyMs);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, [router, everyMs]);
  return null;
}
