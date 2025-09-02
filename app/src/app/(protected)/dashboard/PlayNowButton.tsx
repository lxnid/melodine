"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/Toast";

export default function PlayNowButton({ accessToken, trackId, className = "" }: { accessToken: string; trackId: string; className?: string }) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const playNow = async () => {
    if (!trackId || !accessToken) return;
    try {
      setLoading(true);
      const uri = `spotify:track:${trackId}`;
      const res = await fetch("https://api.spotify.com/v1/me/player/play", {
        method: "PUT",
        headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
        body: JSON.stringify({ uris: [uri] }),
      });
      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        if (res.status === 404 || res.status === 403) {
          showToast({ type: "info", message: "Open Spotify on an active device and try again." });
        } else {
          showToast({ type: "error", message: `Couldn't start playback (${res.status}). ${errText}`.slice(0, 140) });
        }
        return;
      }
      window.dispatchEvent(new Event("player:refresh"));
      showToast({ type: "success", message: "Playing on your active device" });
    } catch (e) {
      showToast({ type: "error", message: "Network error while starting playback" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); playNow(); }}
      disabled={loading}
      aria-label="Play now"
      className={`h-10 w-10 rounded-full bg-green-500 text-white grid place-items-center shadow-md hover:scale-105 transition-all ${className}`}
      title="Play"
    >
      {/* Play icon */}
      <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor"><path d="M6.3 4.94a.75.75 0 011.2-.6l7.01 5.06a.75.75 0 010 1.2l-7 5.06a.75.75 0 01-1.21-.6V4.94z"/></svg>
    </button>
  );
}