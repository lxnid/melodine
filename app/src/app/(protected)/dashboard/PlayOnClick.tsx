"use client";

import { ReactNode, useEffect, useState } from "react";

export default function PlayOnClick({
  trackId,
  title,
  artist,
  image,
  duration_ms,
  className = "",
  children,
}: {
  trackId: string;
  title: string;
  artist: string;
  image?: string;
  duration_ms?: number;
  className?: string;
  children: ReactNode;
}) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    const onNowPlaying = (e: Event) => {
      const detail = (e as CustomEvent<{ trackId?: string | null; preview?: boolean }>).detail;
      if (!detail) return;
      setActive(detail.trackId === trackId && !detail.preview);
    };
    window.addEventListener("player:nowplaying", onNowPlaying as EventListener);
    return () => {
      window.removeEventListener("player:nowplaying", onNowPlaying as EventListener);
    };
  }, [trackId]);

  const handleClick = () => {
    if (!trackId) return;
    const dur = typeof duration_ms === "number" && duration_ms > 0 ? duration_ms : 180000;
    // Dispatch demo load event with metadata and mark now playing
    window.dispatchEvent(
      new CustomEvent("player:demo:load", {
        detail: { id: trackId, title, artist, image, duration_ms: dur },
      })
    );
    window.dispatchEvent(new CustomEvent("player:nowplaying", { detail: { trackId, preview: false } }));
  };

  const combinedClass = `cursor-pointer ${className} ${active ? "bg-white/10 ring-1 ring-white/20" : ""}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleClick();
        }
      }}
      className={combinedClass}
      aria-pressed={active}
    >
      {children}
    </div>
  );
}