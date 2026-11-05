"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { RefreshCw } from "lucide-react";
import type { ContributionData, ContributionDay } from "@/lib/data/github";
import { formatStamp } from "@/lib/format";

// Emerald intensity ramp, level 0-4. Level 0 is an empty cell.
const LEVEL_CLASS = [
  "bg-foreground/10",
  "bg-accent/25",
  "bg-accent/50",
  "bg-accent/75",
  "bg-accent",
];

const DAY_LABELS = ["", "Mon", "", "Wed", "", "Fri", ""];

const MONTH_NAMES = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

type CalendarMonth = {
  key: string;
  label: string;
  year: number;
  columns: (ContributionDay | null)[][];
};

function buildCalendarMonths(weeks: ContributionDay[][]): CalendarMonth[] {
  const allDays = weeks.flat();
  if (allDays.length === 0) return [];

  // Group strictly by calendar month (YYYY-MM)
  const monthKeys: string[] = [];
  for (const d of allDays) {
    const m = d.date.slice(0, 7);
    if (!monthKeys.includes(m)) monthKeys.push(m);
  }

  // If the leading month has <= 2 days (e.g. trailing Aug 31 from previous year),
  // omit it so the calendar starts clean on the 1st of the full month
  const validMonthKeys = monthKeys.filter((mKey, idx) => {
    const count = allDays.filter((d) => d.date.startsWith(mKey)).length;
    if (idx === 0 && count <= 2) return false;
    return true;
  });

  return validMonthKeys.map((mKey) => {
    const [yearStr, monthStr] = mKey.split("-");
    const year = parseInt(yearStr, 10);
    const monthIdx = parseInt(monthStr, 10) - 1;

    const monthDays = allDays.filter((d) => d.date.startsWith(mKey));

    const columns: (ContributionDay | null)[][] = [];
    let currentCol: (ContributionDay | null)[] = new Array(7).fill(null);

    for (const day of monthDays) {
      const parts = day.date.split("-");
      const dateObj = new Date(
        Date.UTC(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10))
      );
      const dayOfWeek = dateObj.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat

      currentCol[dayOfWeek] = day;

      if (dayOfWeek === 6) {
        columns.push(currentCol);
        currentCol = new Array(7).fill(null);
      }
    }

    if (currentCol.some((d) => d !== null)) {
      columns.push(currentCol);
    }

    return {
      key: mKey,
      label: MONTH_NAMES[monthIdx],
      year,
      columns,
    };
  });
}

export function Heatmap({
  data,
  updatedAt = "",
  rating,
  ratingLabel = "LeetCode contest rating",
}: {
  data: ContributionData;
  updatedAt?: string;
  activeDays?: number;
  longestStreak?: number;
  /** Shown as the fourth number in the strip above the calendar. */
  rating?: number | string;
  ratingLabel?: string;
}) {
  const [calendar, setCalendar] = useState<ContributionData>(data);
  const [timeLabel, setTimeLabel] = useState<string>(updatedAt);
  const [isSyncing, setIsSyncing] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [syncStatus, setSyncStatus] = useState<"idle" | "live">("idle");

  const syncLive = async () => {
    setIsSyncing(true);
    try {
      const res = await fetch("/api/activity");
      if (res.ok) {
        const json = await res.json();
        if (json.success && json.contributions) {
          setCalendar(json.contributions);
          setTimeLabel(json.updatedAt || new Date().toISOString());
          setSyncStatus("live");
        }
      }
    } catch {
      // keep current data on failure
    } finally {
      setIsSyncing(false);
    }
  };

  // Derive metrics strictly from the active calendar array
  const { activeDays, longestStreak, total } = useMemo(() => {
    const days = calendar.weeks.flat();
    const active = days.filter((d) => d.count > 0).length;
    let longest = 0;
    let curr = 0;
    for (const d of days) {
      if (d.count > 0) {
        curr++;
        if (curr > longest) longest = curr;
      } else {
        curr = 0;
      }
    }
    const tot = days.reduce((sum, d) => sum + (d.count || 0), 0);
    return { activeDays: active, longestStreak: longest, total: tot };
  }, [calendar]);

  // Build true calendar months with exact day counts and centered headers
  const calendarMonths = useMemo(() => {
    return buildCalendarMonths(calendar.weeks);
  }, [calendar.weeks]);

  // Show the latest weeks first; the calendar scrolls left, not right.
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollLeft = el.scrollWidth;
  }, [calendarMonths]);

  const stat = (value: string, label: string, i: number) => (
    <div
      key={label}
      className={`py-4 ${i === 0 ? "pr-4 sm:pr-5" : "pl-4 pr-4 sm:pl-5 sm:pr-5"} ${
        i > 0 ? "border-l-[3px] border-border" : ""
      } ${i >= 2 ? "max-sm:border-t-[3px] max-sm:border-border" : ""} ${
        i === 2 ? "max-sm:border-l-0 max-sm:pl-0" : ""
      }`}
    >
      <div className="text-4xl font-extrabold leading-none tracking-tight text-foreground tabular-nums sm:text-5xl lg:text-6xl">
        {value}
      </div>
      <div className="mt-2 text-small text-foreground">{label}</div>
    </div>
  );

  return (
    <div>
      {/* Numbers first: open on the page, live with the calendar */}
      <div className="mb-8 grid grid-cols-2 border-y-[3px] border-border sm:grid-cols-4">
        {[
          [total.toLocaleString(), "contributions, past 52 weeks"],
          [String(activeDays), "active days"],
          [String(longestStreak), "day longest streak"],
          ...(rating !== undefined ? [[String(rating), ratingLabel]] : []),
        ].map(([v, l], i) => stat(v, l, i))}
      </div>

      <div className="pop-card p-5">
      {/* Header: updated time + Sync button */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-border pb-3">
        <span className="font-mono text-xs text-foreground">
          Past 52 weeks · updated {timeLabel ? formatStamp(timeLabel) : "—"}
        </span>

        <button
          type="button"
          onClick={syncLive}
          disabled={isSyncing}
          title="Sync live activity from GitHub"
          className="group inline-flex min-h-11 items-center gap-1.5 rounded-full border-2 border-border bg-surface px-3 font-mono text-xs text-foreground transition-colors hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent disabled:opacity-50 cursor-pointer"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${
              isSyncing ? "animate-spin text-accent" : "transition-transform group-hover:rotate-180"
            }`}
          />
          <span>{isSyncing ? "Syncing..." : syncStatus === "live" ? "Live" : "Sync"}</span>
        </button>
      </div>

      {/* Horizontally scrollable calendar with true calendar months */}
      <div ref={scrollRef} className="pop-scroll mt-4 overflow-x-auto pb-3">
        <div className="mx-auto flex min-w-max items-start">
          {/* Day of week labels on left (Mon, Wed, Fri) aligned with 7 dot rows */}
          <div className="w-7 sm:w-8 shrink-0 flex flex-col font-mono text-xs text-foreground-subtle select-none">
            {/* Header spacer to match month labels row height */}
            <div className="mb-1.5 h-4" />
            <div className="flex flex-col gap-1 sm:gap-1.5">
              {DAY_LABELS.map((dayLabel, idx) => (
                <span
                  key={idx}
                  className="h-2.5 sm:h-3 flex items-center leading-none text-right justify-end pr-1.5"
                >
                  {dayLabel}
                </span>
              ))}
            </div>
          </div>

          {/* Month Groups with exact calendar days and centered month headers */}
          <div
            className="flex items-start gap-2 sm:gap-3"
            role="img"
            aria-label={`${total} contributions on GitHub`}
          >
            {calendarMonths.map((month) => (
              <div key={month.key} className="flex flex-col shrink-0">
                {/* Month Name Header - PROPERLY CENTERED */}
                <div className="mb-1.5 flex h-4 items-center justify-center text-center">
                  <span className="font-mono text-xs font-medium text-foreground-subtle select-none">
                    {month.label}
                  </span>
                </div>

                {/* Week Columns of Dots for this Month */}
                <div className="flex gap-1 sm:gap-1.5">
                  {month.columns.map((col, colIdx) => (
                    <div key={colIdx} className="flex flex-col gap-1 sm:gap-1.5">
                      {col.map((day, rowIdx) => {
                        if (!day) {
                          return (
                            <span
                              key={`empty-${rowIdx}`}
                              className="h-2.5 sm:h-3 w-2.5 sm:w-3 invisible pointer-events-none"
                              aria-hidden="true"
                            />
                          );
                        }

                        const breakdownParts: string[] = [];
                        if (day.githubCount) {
                          breakdownParts.push(
                            `${day.githubCount} commit${day.githubCount > 1 ? "s" : ""}`
                          );
                        }
                        if (day.codolioCount) {
                          breakdownParts.push(
                            `${day.codolioCount} DSA solve${day.codolioCount > 1 ? "s" : ""}`
                          );
                        }
                        const detail =
                          breakdownParts.length > 0
                            ? ` (${breakdownParts.join(" · ")})`
                            : "";
                        const tooltip =
                          day.count > 0
                            ? `${day.count} activit${
                                day.count === 1 ? "y" : "ies"
                              } on ${day.date}${detail}`
                            : `No activity on ${day.date}`;

                        return (
                          <span
                            key={day.date}
                            title={tooltip}
                            className={`h-2.5 sm:h-3 w-2.5 sm:w-3 rounded-[2px] transition-transform hover:scale-125 ${
                              LEVEL_CLASS[day.level]
                            }`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer: Less -> More ramp */}
      <div className="mt-4 flex items-center justify-end gap-1.5 border-t-2 border-border pt-3 text-xs text-foreground">
        <span>Less</span>
        {LEVEL_CLASS.map((cls, i) => (
          <span key={i} className={`h-2.5 w-2.5 rounded-[2px] ${cls}`} />
        ))}
        <span>More</span>
      </div>
      </div>
    </div>
  );
}
