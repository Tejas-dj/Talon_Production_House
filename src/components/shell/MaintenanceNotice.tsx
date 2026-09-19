"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiVolume2, FiVolumeX } from "react-icons/fi";
import { BunnyPlayer } from "@/components/media/BunnyPlayer";
import { useDialogBehavior } from "@/lib/use-dialog";

/**
 * Site-wide maintenance notice. Opens itself shortly after the first page
 * load of a session, says plainly that parts of the site are still being
 * rebuilt, points at Contact, and uses the remaining half of the panel to
 * put the newest release in front of the visitor with sound one tap away.
 *
 * Session-scoped, not per-navigation and not forever: sessionStorage means a
 * visitor sees it once per visit, and a genuine return visit tomorrow is told
 * again (the site is, after all, still under maintenance). localStorage would
 * hide the notice from a returning visitor who never saw it finish; showing
 * it on every route change would be an advert, not a notice.
 */

const DISMISSED_KEY = "talon:maintenance-notice-seen";
/** Long enough for the page's own P1 reveals to land first, short enough that
 *  it still reads as "on load" rather than as an interruption. */
const OPEN_DELAY_MS = 900;

/* Latest release — content/projects.json, slug below. Inlined rather than
   read through the content layer because this is a client component and the
   notice is a deliberately hand-picked moment, not a feed. */
const FEATURE = {
  href: "/work/motion/jhumki-official-music-video-tanmay-gururaj",
  bunnyVideoId: "e66190ce-cb87-4850-ac37-6cfafb8eb763",
  title: "Jhumki",
  meta: "Tanmay Gururaj · Official Music Video",
} as const;

export function MaintenanceNotice() {
  const [open, setOpen] = useState(false);
  const [muted, setMuted] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let dismissed = false;
    try {
      dismissed = sessionStorage.getItem(DISMISSED_KEY) === "1";
    } catch {
      // Private-mode / blocked storage: fall through and show it. A notice
      // shown twice is a smaller failure than a notice never shown.
    }
    if (dismissed) return;

    const timer = window.setTimeout(() => setOpen(true), OPEN_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try {
      sessionStorage.setItem(DISMISSED_KEY, "1");
    } catch {
      // Nothing to do — worst case the notice returns on the next page load.
    }
  }, []);

  useDialogBehavior({ open, onClose: close, containerRef });

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-scrim p-3 backdrop-blur-md md:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
    >
      <div
        ref={containerRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="maintenance-notice-title"
        aria-describedby="maintenance-notice-body"
        className="notice-panel bg-surface relative max-h-[calc(100svh-24px)] w-full max-w-[1000px] overflow-y-auto border border-rule"
      >
        {/* Header strip: label left, dismiss right — the same hairline
            vocabulary the rest of the site divides with. Sticky because the
            panel scrolls internally on a short viewport (a 320x640 phone, a
            landscape phone), and Close must never scroll out of reach. */}
        <div className="hairline-b bg-surface sticky top-0 z-10 flex items-center justify-between gap-3 px-3 py-2 md:px-4">
          <p className="type-meta text-muted">Site Notice</p>
          <button type="button" onClick={close} className="btn type-meta px-4 py-2">
            Close
          </button>
        </div>

        <div className="grid gap-5 p-3 md:grid-cols-[1.05fr_0.95fr] md:gap-4 md:p-4">
          <div className="flex flex-col justify-between gap-4">
            <div>
              <h2 id="maintenance-notice-title" className="type-headline">
                The site is still in the edit.
              </h2>
              <p id="maintenance-notice-body" className="type-body text-muted mt-3 max-w-[52ch]">
                We&rsquo;re rebuilding parts of Talon Production House, so a few pages and links
                won&rsquo;t behave yet. Everything on screen is real work. Everything missing is on
                its way back.
              </p>
              <p className="type-body text-muted mt-2 max-w-[52ch]">
                Briefs, bookings and studio rental are running as normal. Come straight to us.
              </p>
            </div>

            <div>
              <Link href="/contact" onClick={close} className="btn btn-cta type-meta px-4 py-3">
                Contact us
              </Link>
            </div>
          </div>

          {/* Latest work. Plays silent on open; the cue below nudges for sound. */}
          <div className="flex flex-col gap-3">
            <p className="type-meta text-muted">Latest work</p>

            <div className="relative aspect-video w-full overflow-hidden border border-rule">
              <BunnyPlayer
                videoId={FEATURE.bunnyVideoId}
                title={`${FEATURE.title}, ${FEATURE.meta}`}
                autoPlayMuted
                muted={muted}
                maxHeight={480}
                className="absolute inset-0 h-full w-full"
              />

              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-pressed={!muted}
                aria-label={muted ? `Unmute ${FEATURE.title}` : `Mute ${FEATURE.title}`}
                className={`btn btn-scrim type-meta absolute bottom-2 left-2 gap-2 px-3 py-2 ${
                  muted ? "cue-nudge" : ""
                }`}
              >
                {muted ? (
                  <FiVolume2 size={14} aria-hidden="true" />
                ) : (
                  <FiVolumeX size={14} aria-hidden="true" />
                )}
                {muted ? "Tune in" : "Mute"}
              </button>
            </div>

            <div>
              <p className="type-subhead">{FEATURE.title}</p>
              <p className="type-meta text-muted mt-1">{FEATURE.meta}</p>
              <Link
                href={FEATURE.href}
                onClick={close}
                className="link-draw type-meta mt-3 inline-block"
              >
                Watch the full video
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
