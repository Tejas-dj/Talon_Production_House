"use client";

import { useEffect, useRef, useState } from "react";
import { CloudinaryImage } from "@/components/media/CloudinaryImage";
import { bunnyThumbnailUrl } from "@/lib/media/bunny";

const playlistCache = new Map<string, Promise<string>>();

function resolveRenditionUrl(
  masterUrl: string,
  maxHeight?: number,
): Promise<string> {
  const cacheKey = `${masterUrl}|${maxHeight ?? ""}`;
  let promise = playlistCache.get(cacheKey);
  if (!promise) {
    promise = fetchAndResolveRendition(masterUrl, maxHeight).catch((err) => {
      playlistCache.delete(cacheKey);
      throw err;
    });
    playlistCache.set(cacheKey, promise);
  }
  return promise;
}

async function fetchAndResolveRendition(
  masterUrl: string,
  maxHeight?: number,
): Promise<string> {
  const res = await fetch(masterUrl);
  const text = await res.text();
  const lines = text.split("\n").map((line) => line.trim());

  type Rendition = { height: number; pixels: number; url: string };
  const renditions: Rendition[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.startsWith("#EXT-X-STREAM-INF")) continue;

    const uri = lines[i + 1];
    if (!uri || uri.startsWith("#")) continue;

    const resolutionMatch = line.match(/RESOLUTION=(\d+)x(\d+)/);
    const bandwidthMatch = line.match(/BANDWIDTH=(\d+)/);
    const height = resolutionMatch ? Number(resolutionMatch[2]) : 0;
    const pixels = resolutionMatch
      ? Number(resolutionMatch[1]) * Number(resolutionMatch[2])
      : (bandwidthMatch ? Number(bandwidthMatch[1]) : 0);

    renditions.push({
      height,
      pixels,
      url: new URL(uri, masterUrl).toString(),
    });
  }

  if (renditions.length === 0) return masterUrl;

  if (maxHeight != null) {
    renditions.sort((a, b) => a.height - b.height);
    const fit = renditions.find((r) => r.height >= maxHeight);
    return (fit ?? renditions[renditions.length - 1]).url;
  }

  let best = renditions[0];
  for (const r of renditions) {
    if (r.pixels > best.pixels) best = r;
  }
  return best.url;
}

type BunnyPlayerProps = {
  /** Bunny Stream video GUID */
  videoId: string;
  /** Accessible label / used as the poster alt text */
  title: string;
  /** Cloudinary public id for the poster frame; falls back to Bunny's own thumbnail if omitted */
  posterImageId?: string;
  /** Hero use: silent, looping, autoplaying background video. Default: tap-to-play with sound. */
  autoPlayMuted?: boolean;
  /** Cap the HLS rendition height for muted previews (e.g. 480 for small
   *  cards). Ignored for click-to-play; when omitted on autoPlayMuted a
   *  viewport-aware default (480p mobile / 720p desktop) kicks in. */
  maxHeight?: number;
  /** Stop looping after this many plays. Only applies when autoPlayMuted. */
  maxLoops?: number;
  /** Start playback from this many seconds into the video */
  startTime?: number;
  /** External play/pause control — when true the video plays, when false it pauses. */
  active?: boolean;
  /** LCP hint — set to "high" only for an above-the-fold instance (e.g. Hero). */
  fetchPriority?: "high" | "low" | "auto";
  className?: string;
};

export function BunnyPlayer({
  videoId,
  title,
  posterImageId,
  autoPlayMuted = false,
  maxHeight,
  maxLoops,
  startTime,
  active,
  fetchPriority,
  className,
}: BunnyPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(autoPlayMuted);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const startTimeApplied = useRef(false);
  const loopCount = useRef(0);

  const shouldAutoPlay = active != null ? active : autoPlayMuted;

  const pullZone = process.env.NEXT_PUBLIC_BUNNY_PULL_ZONE;
  const hlsSrc = pullZone ? `https://${pullZone}.b-cdn.net/${videoId}/playlist.m3u8` : undefined;
  const bunnyThumbnail = bunnyThumbnailUrl(videoId);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hlsSrc) return;
    if (!(playing || autoPlayMuted)) return;

    let hls: import("hls.js").default | undefined;
    let cancelled = false;

    const capHeight = autoPlayMuted
      ? (maxHeight ?? (window.innerWidth < 768 ? 480 : 720))
      : undefined;

    resolveRenditionUrl(hlsSrc, capHeight)
      .catch(() => hlsSrc)
      .then((topSrc) => {
        if (cancelled || !video) return;

        const canPlayNativeHls = video.canPlayType("application/vnd.apple.mpegurl") !== "";
        if (canPlayNativeHls) {
          video.src = topSrc;
          return;
        }

        import("hls.js").then(({ default: Hls }) => {
          if (cancelled) return;
          if (Hls.isSupported()) {
            hls = new Hls();
            hls.loadSource(topSrc);
            hls.attachMedia(video);
          } else {
            video.src = topSrc;
          }
        });
      });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [hlsSrc, playing, autoPlayMuted, maxHeight]);

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

  useEffect(() => {
    if (!autoPlayMuted || maxLoops == null) return;
    const video = videoRef.current;
    if (!video) return;
    const onEnded = () => {
      loopCount.current++;
      if (loopCount.current < maxLoops) {
        video.currentTime = 0;
        video.play().catch(() => {});
      }
    };
    video.addEventListener("ended", onEnded);
    return () => video.removeEventListener("ended", onEnded);
  }, [autoPlayMuted, maxLoops]);

  // Respond to external active prop changes.
  useEffect(() => {
    if (active == null) return;
    const video = videoRef.current;
    if (!video) return;
    if (active) {
      if (maxLoops != null) loopCount.current = 0;
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
  }, [active, maxLoops]);

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
        {...{ fetchPriority }}
        controls={playing && !autoPlayMuted}
        playsInline
        muted={autoPlayMuted}
        loop={autoPlayMuted && maxLoops == null}
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
