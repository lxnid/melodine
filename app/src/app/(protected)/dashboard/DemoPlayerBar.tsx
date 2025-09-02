"use client";

import { useEffect, useRef, useState } from "react";

type DemoTrack = {
  id: string;
  title: string;
  artist: string;
  image?: string;
  duration_ms: number;
};

export default function DemoPlayerBar() {
  const [current, setCurrent] = useState<DemoTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [positionMs, setPositionMs] = useState(0);
  const [volume, setVolume] = useState(100);
  const tickerRef = useRef<number | null>(null);

  // Load demo track on global event
  useEffect(() => {
    const onLoad = (e: Event) => {
      const detail = (e as CustomEvent<DemoTrack>).detail;
      if (!detail || !detail.id) return;
      setCurrent(detail);
      setPositionMs(0);
      setIsPlaying(true);
      try {
        window.dispatchEvent(new CustomEvent("player:nowplaying", { detail: { trackId: detail.id, preview: false } }));
      } catch {}
    };
    window.addEventListener("player:demo:load", onLoad as EventListener);
    return () => window.removeEventListener("player:demo:load", onLoad as EventListener);
  }, []);

  // Advance timeline while playing
  useEffect(() => {
    if (!current || !isPlaying) {
      if (tickerRef.current) cancelAnimationFrame(tickerRef.current);
      tickerRef.current = null;
      return;
    }
    let last = performance.now();
    const tick = (now: number) => {
      const dt = now - last;
      last = now;
      setPositionMs((p) => {
        const next = p + dt;
        if (!current) return p;
        if (next >= current.duration_ms) {
          // Stop at end
          setIsPlaying(false);
          return current.duration_ms;
        }
        return next;
      });
      tickerRef.current = requestAnimationFrame(tick);
    };
    tickerRef.current = requestAnimationFrame(tick);
    return () => {
      if (tickerRef.current) cancelAnimationFrame(tickerRef.current);
      tickerRef.current = null;
    };
  }, [current, isPlaying]);

  const playPause = () => {
    if (!current) return;
    // If at end, restart
    if (!isPlaying && positionMs >= (current.duration_ms || 0)) {
      setPositionMs(0);
    }
    setIsPlaying((p) => !p);
  };

  const seek = (ms: number) => {
    if (!current) return;
    const clamped = Math.max(0, Math.min(ms, current.duration_ms || 0));
    setPositionMs(clamped);
  };

  const changeVolume = (percent: number) => {
    const clamped = Math.min(100, Math.max(0, Math.round(percent)));
    setVolume(clamped);
  };

  const prevTrack = () => {
    // No-op in demo
  };

  const nextTrack = () => {
    // No-op in demo
  };

  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const r = s % 60;
    return `${m}:${r.toString().padStart(2, "0")}`;
  };

  if (!current) return null;

  const title = current.title || "Untitled";
  const artist = current.artist || "";
  const image = current.image;
  const durationMs = current.duration_ms || 0;

  return (
    <div className="fixed inset-x-0 bottom-12 lg:bottom-0 z-50 bg-black border-t border-white/10">
      <div className="relative mx-auto max-w-7xl px-4 py-3">
        {/* Centered transport (absolute to be truly centered irrespective of left/right widths) */}
        <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-3">
              <button onClick={prevTrack} className="rounded-full h-9 w-9 flex items-center justify-center bg-white/10 text-white/90 hover:bg-white/20" aria-label="Previous">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M4.75 4a.75.75 0 01.75.75v10.5a.75.75 0 01-1.5 0V4.75A.75.75 0 014.75 4zM6.4 10.6l8.3 5.9a.75.75 0 001.2-.6V4.1a.75.75 0 00-1.2-.6l-8.3 5.9a.75.75 0 000 1.2z"/></svg>
              </button>
              <button
                onClick={playPause}
                className="rounded-full h-10 w-10 flex items-center justify-center bg-white text-black hover:bg-white/90"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6 4.75A.75.75 0 016.75 4h1.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-1.5A.75.75 0 016 15.25V4.75zM11 4.75A.75.75 0 0111.75 4h1.5a.75.75 0 01.75.75v10.5a.75.75 0 01-.75.75h-1.5a.75.75 0 01-.75-.75V4.75z"/></svg>
                ) : (
                  <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 4.94a.75.75 0 011.2-.6l7.01 5.06a.75.75 0 010 1.2l-7 5.06a.75.75 0 01-1.21-.6V4.94z"/></svg>
                )}
              </button>
              <button onClick={nextTrack} className="rounded-full h-9 w-9 flex items-center justify-center bg-white/10 text-white/90 hover:bg-white/20" aria-label="Next">
                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M15.25 4a.75.75 0 00-.75.75v10.5a.75.75 0 001.5 0V4.75a.75.75 0 00-.75-.75zM13.6 10.6l-8.3 5.9a.75.75 0 01-1.2-.6V4.1a.75.75 0 011.2-.6l8.3 5.9a.75.75 0 010 1.2z"/></svg>
              </button>
            </div>

            <div className="w-[62vw] max-w-[640px] min-w-[220px] flex items-center gap-3">
              <span className="text-[10px] text-white/60 w-10 tabular-nums text-right">{fmt(positionMs)}</span>
              <input
                type="range"
                min={0}
                max={Math.max(0, durationMs)}
                value={Math.min(Math.max(0, positionMs), Math.max(0, durationMs))}
                onChange={(e) => seek(Number(e.currentTarget.value))}
                className="w-full h-1 cursor-pointer accent-white/80"
                aria-label="Seek"
              />
              <span className="text-[10px] text-white/60 w-10 tabular-nums">{fmt(durationMs)}</span>
            </div>
          </div>
        </div>

        {/* Flow content: left and right sections reserve space but center stays fixed */}
        <div className="flex items-center gap-4">
          {/* Left: Now playing */}
          <div className="flex items-center gap-3 min-w-0 flex-[1.2]">
            <div className="h-12 w-12 rounded overflow-hidden bg-white/10 flex-shrink-0">
              {image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={image} alt={title} className="h-full w-full object-cover" />
              ) : (
                <div className="h-full w-full" style={{ background: "linear-gradient(135deg, rgba(139,92,246,.6), rgba(168,85,247,.4))" }} />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-white/90 text-sm font-medium">{title}</div>
              <div className="truncate text-white/60 text-xs">{artist}</div>
            </div>
          </div>

          {/* Spacer to balance center absolute block height */}
          <div className="flex-1" />

          {/* Right: Volume */}
          <div className="hidden md:flex items-center gap-2 w-44 justify-end">
            <svg className="w-4 h-4 text-white/70" viewBox="0 0 20 20" fill="currentColor"><path d="M3 7.75A.75.75 0 013.75 7h2.69l3.1-2.58A1 1 0 0111 5.23v9.54a1 1 0 01-1.46.82L6.44 13H3.75A.75.75 0 013 12.25v-4.5z"/></svg>
            <input
              type="range"
              min={0}
              max={100}
              value={volume}
              onChange={(e) => changeVolume(Number(e.currentTarget.value))}
              className="w-full h-1 accent-white/80 cursor-pointer"
              aria-label="Volume"
            />
          </div>
        </div>
      </div>
    </div>
  );
}