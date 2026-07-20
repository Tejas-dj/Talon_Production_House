"use client";

/**
 * The root-layout-level fallback: if RootLayout itself fails to render, this
 * replaces it entirely (Next's global-error.tsx convention), so it can't
 * depend on the token layer, Tailwind's build output, or any component that
 * might itself be implicated in the failure. Inline CSS only, hardcoded hex
 * (copied from Bible §4.3, not the CSS custom properties — those live in
 * globals.css, which this page deliberately doesn't import), light/dark
 * handled by a plain prefers-color-scheme media query since there's no
 * theme system available here.
 */
export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <html lang="en">
      <head>
        <title>Something Broke — Talon Production House</title>
        <style>{`
          :root { --bg: #EDE7DC; --fg: #171614; --muted: #655F56; --rule: #C9C0B2; }
          @media (prefers-color-scheme: dark) {
            :root { --bg: #000000; --fg: #F4F0E8; --muted: #8A857D; --rule: #1F1F1F; }
          }
          * { box-sizing: border-box; }
          body {
            margin: 0;
            min-height: 100svh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            padding: 48px 20px;
            background: var(--bg);
            color: var(--fg);
            font-family: Arial, "Helvetica Neue", sans-serif;
          }
          .wrap { max-width: 640px; }
          .eyebrow {
            font-size: 0.75rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            font-weight: 600;
            color: var(--muted);
            margin: 0 0 8px;
          }
          h1 {
            font-size: clamp(2.5rem, 8vw, 4.5rem);
            line-height: 0.95;
            letter-spacing: -0.02em;
            font-weight: 800;
            text-transform: uppercase;
            margin: 0 0 16px;
          }
          p { font-size: 1rem; line-height: 1.55; color: var(--muted); margin: 0 0 24px; max-width: 50ch; }
          a { color: var(--fg); }
          button {
            font-family: inherit;
            font-size: 0.75rem;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            font-weight: 600;
            border: 1px solid var(--rule);
            background: transparent;
            color: var(--fg);
            padding: 12px 20px;
            cursor: pointer;
          }
        `}</style>
      </head>
      <body>
        <div className="wrap">
          <p className="eyebrow">Error</p>
          <h1>Something Broke</h1>
          <p>
            The site failed to load. Try again, or reach us directly at{" "}
            <a href="mailto:Talonproductionhouse@gmail.com">Talonproductionhouse@gmail.com</a>.
          </p>
          <button type="button" onClick={() => reset()}>
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
