"use client";

import { useEffect, useRef, useState } from "react";

type BunnyPlayerProps = {
  /** Bunny Stream video GUID */
  videoId: string;
  /** Accessible label / used as the poster alt text */
  title: string;
  /** Cloudinary public id for the poster frame; falls back to Bunny's own thumbnail if omitted */
  posterImageId?: string;
  /** Hero use: silent, looping, autoplaying background video. Default: tap-to-play with sound. */
  autoPlayMuted?: boolean;
  className?: string;
};

/**
 * Bunny Stream HLS player on the Volume network, skinned to Talon's tokens
 * (no native browser chrome — a minimal custom play affordance instead).
 * Poster-first: nothing loads until the video element mounts with a poster
 * already in place. `playsInline` + `muted` are required together for
 * autoplay to be permitted on iOS Safari (Bible §7 media pipeline note).
 *
 * hls.js drives playback on browsers without native HLS (Chrome, Firefox,
 * Edge, Android); Safari/iOS get native `<video src>` HLS support directly,
 * since layering hls.js on top of a browser that already plays HLS natively
 * only adds a dependency for no benefit.
 */
export function BunnyPlayer({
  videoId,
  title,
  posterImageId,
  autoPlayMuted = false,
  className,
}: BunnyPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlayMuted);

  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
  const hlsSrc = pullZone ? `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8` : undefined;
  const posterSrc = posterImageId
    ? undefined // Phase 3: render <CloudinaryImage> above the video before play, or pass a resolved URL
    : pullZone
      ? `https://${pullZone}.b-cdn.net/${videoId}/thumbnail.jpg`
      : undefined;

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsSrc) return;
    if (!(playing || autoPlayMuted)) return;

    const canPlayNativeHls = video.canPlayType("application/vnd.apple.mpegurl") !== "";
    if (canPlayNativeHls) {
      video.src = hlsSrc;
      return;
    }

    let hls: import("hls.js").default | undefined;
    let cancelled = false;

    import("hls.js").then(({ default: Hls }) => {
      if (cancelled) return;
      if (Hls.isSupported()) {
        hls = new Hls();
        hls.loadSource(hlsSrc);
        hls.attachMedia(video);
      } else {
        // Last-resort fallback: attempt native playback anyway.
        video.src = hlsSrc;
      }
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [hlsSrc, playing, autoPlayMuted]);

  if (!pullZone) {
    return (
      <div className={`bg-surface flex items-center justify-center p-6 ${className ?? ""}`}>
        <p className="type-small text-muted">
          Video unavailable: NEXT_PUBLIC_BUNNY_PULL_ZONE is not set (see .env.example).
        </p>
      </div>
    );
  }

  return (
    <div className={`relative ${className ?? ""}`}>
      <video
        ref={videoRef}
        poster={posterSrc}
        controls={playing && !autoPlayMuted}
        playsInline
        muted={autoPlayMuted}
        loop={autoPlayMuted}
        autoPlay={autoPlayMuted}
        aria-label={title}
        className="h-full w-full"
      />
      {!playing && !autoPlayMuted && (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          className="btn type-meta absolute inset-0 flex items-center justify-center bg-transparent"
          aria-label={`Play: ${title}`}
        >
          Play
        </button>
      )}
    </div>
  );
}
