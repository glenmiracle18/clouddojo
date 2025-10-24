"use client";

import { Button } from "@/components/ui/button";
import { TimeRangeOption } from "../types";

interface TimeRangeSelectorProps {
  timeRange: TimeRangeOption;
  onTimeRangeChange: (range: TimeRangeOption) => void;
}

/**
 * Renders a compact button group to choose the leaderboard time range.
 *
 * @param timeRange - The currently selected time range option.
 * @param onTimeRangeChange - Handler invoked with the new `TimeRangeOption` when a button is clicked.
 */
export function TimeRangeSelector({
  timeRange,
  onTimeRangeChange,
}: TimeRangeSelectorProps) {
  return (
    <div className="flex justify-end mb-6">
      <div className="inline-flex rounded-lg border border-border overflow-hidden">
        <Button
          variant={timeRange === "daily" ? "default" : "ghost"}
          className="rounded-none border-r border-border px-4"
          onClick={() => onTimeRangeChange("daily")}
        >
          Daily
        </Button>
        <Button
          variant={timeRange === "weekly" ? "default" : "ghost"}
          className="rounded-none border-r border-border px-4"
          onClick={() => onTimeRangeChange("weekly")}
        >
          Weekly
        </Button>
        <Button
          variant={timeRange === "monthly" ? "default" : "ghost"}
          className="rounded-none px-4"
          onClick={() => onTimeRangeChange("monthly")}
        >
          Monthly
        </Button>
        <Button
          variant={timeRange === "all" ? "default" : "ghost"}
          className="rounded-none border-r border-border px-4"
          onClick={() => onTimeRangeChange("all")}
        >
          All Time
        </Button>
      </div>
    </div>
  );
}