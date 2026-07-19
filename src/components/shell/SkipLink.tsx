/* Skip-to-content: first tab stop on every page; visually hidden until
   focused, then a designed button in the top-left. */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="btn type-meta sr-only bg-page px-4 py-2 focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50"
    >
      Skip to content
    </a>
  );
}
