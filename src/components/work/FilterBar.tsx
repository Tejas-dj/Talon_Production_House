import Link from "next/link";
import type { VideoCategory } from "@/lib/content-types";

type FilterBarProps = {
  categories: VideoCategory[];
  active?: string;
};

/**
 * Category filter as plain links — Next's App Router already avoids a full
 * page reload on client-side navigation and keeps the URL shareable, so no
 * manual pushState/shallow-routing code is needed. "All" omits the query
 * param entirely (clean URL). Active state reuses the existing `btn`
 * utility's `[aria-current]` accent styling — no new interaction CSS.
 */
export function FilterBar({ categories, active }: FilterBarProps) {
  return (
    <nav aria-label="Filter by category">
      <ul className="flex flex-wrap gap-2">
        <li>
          <Link
            href="/work/motion"
            className="btn type-meta px-4 py-2"
            aria-current={!active ? "true" : undefined}
          >
            All
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category}>
            <Link
              href={`/work/motion?category=${encodeURIComponent(category)}`}
              className="btn type-meta px-4 py-2"
              aria-current={active === category ? "true" : undefined}
            >
              {category}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
