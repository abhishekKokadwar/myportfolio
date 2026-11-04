/** "2026-11-04 22:38Z" from an ISO timestamp; passes through anything unparseable. */
export function formatStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 16).replace("T", " ") + "Z";
}

/** Format date as ISO "YYYY-MM-DD" (§3). Engineers write dates that sort. */
export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().split("T")[0];
}
