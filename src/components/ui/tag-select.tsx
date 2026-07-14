"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

type TagSelectProps = {
  options: string[];
  defaultSelected?: string[];
};

export function TagSelect({
  options,
  defaultSelected = [],
}: TagSelectProps) {
  const [selected, setSelected] = useState<string[]>(defaultSelected);

  function toggleTag(option: string) {
    setSelected((current) =>
      current.includes(option)
        ? current.filter((value) => value !== option)
        : [...current, option],
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <button
              key={option}
              type="button"
              onClick={() => toggleTag(option)}
              className={cn(
                "rounded-full border px-3 py-2 text-sm transition",
                active
                  ? "border-[var(--accent)] bg-[var(--accent)]/15 text-white"
                  : "border-white/10 bg-white/5 text-[var(--muted-foreground)] hover:border-white/20 hover:text-white",
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      <p className="text-xs text-[var(--muted-foreground)]">
        Selected: {selected.length ? selected.join(", ") : "None yet"}
      </p>
    </div>
  );
}
