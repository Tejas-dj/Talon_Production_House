"use client";

import { useState } from "react";

const FILTERS = ["All", "Commercial", "Music Video", "Documentary", "Brand Film"];

/* Live demo of the filter-chip state machine: the selected chip carries the
   accent active state (Bible §4.2 — accent means "what you've chosen"). */
export function FilterChipsDemo() {
  const [active, setActive] = useState("All");

  return (
    <div className="flex flex-wrap gap-2">
      {FILTERS.map((label) => (
        <button
          key={label}
          type="button"
          aria-pressed={active === label}
          onClick={() => setActive(label)}
          className="btn type-meta px-4 py-2"
        >
          {label}
        </button>
      ))}
    </div>
  );
}
