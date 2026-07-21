"use client";

import { useEffect, useRef, useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { bunnyThumbnailUrl } from "@/lib/media/bunny";

type BunnyPlayerProps = {
  /** Bunny Stream video GUID */
  videoId: string;
  /** Accessible label / used as the poster alt text */
  title: string;
  /** Cloudinary public id for the poster frame; falls back to Bunny's own thumbnail if omitted */
  posterImageId?: string;
  /** Hero use: silent, looping, autoplaying background video. Default: tap-to-play with sound. */
  autoPlayMuted?: boolean;
  /** Start playback from this many seconds into the video */
  startTime?: number;
  /** External play/pause control — when true the video plays, when false it pauses. */
  active?: boolean;
  className?: string;
};

export function BunnyPlayer({
  videoId,
  title,
  posterImageId,
  autoPlayMuted = false,
  startTime,
  active,
  className,
}: BunnyPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlayMuted);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const startTimeApplied = useRef(false);

  const shouldAutoPlay = active != null ? active : autoPlayMuted;

  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
  const hlsSrc = pullZone ? `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8` : undefined;
  const bunnyThumbnail = bunnyThumbnailUrl(videoId);

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
        video.src = hlsSrc;
      }
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [hlsSrc, playing, autoPlayMuted]);

  useEffect(() => {
    if (startTime == null || startTimeApplied.current) return;
    const video = videoRef.current;
    if (!video) return;
    const onLoadedMetadata = () => {
      video.currentTime = startTime;
      startTimeApplied.current = true;
    };
    video.addEventListener("loadedmetadata", onLoadedMetadata);
    return () => video.removeEventListener("loadedmetadata", onLoadedMetadata);
  }, [startTime]);

  // Respond to external active prop changes.
  useEffect(() => {
    if (active == null) return;
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      const tryPlay = () => video.play().catch(() => {});
      if (video.readyState >= 2) {
        tryPlay();
      } else {
        video.addEventListener("canplay", tryPlay, { once: true });
        return () => video.removeEventListener("canplay", tryPlay);
      }
    } else {
      video.pause();
    }
  }, [active]);

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
    <div className={`relative overflow-hidden ${className ?? ""}`}>
      <video
        ref={videoRef}
        poster={posterImageId ? undefined : bunnyThumbnail}
        controls={playing && !autoPlayMuted}
        playsInline
        muted={autoPlayMuted}
        loop={autoPlayMuted}
        autoPlay={shouldAutoPlay}
        onPlaying={() => setVideoPlaying(true)}
        aria-label={title}
        className="h-full w-full object-cover"
      />
      {posterImageId && (
        <CloudinaryImage
          id={posterImageId}
          preset="poster"
          alt=""
          aria-hidden="true"
          fill
          priority
          className={`absolute inset-0 object-cover transition-opacity duration-[320ms] ease-veil ${
            videoPlaying ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        />
      )}
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
