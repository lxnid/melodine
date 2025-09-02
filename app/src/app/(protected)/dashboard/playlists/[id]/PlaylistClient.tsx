"use client";

import { useEffect } from "react";
import { useToast } from "@/components/ui/Toast";
import TracksTable from "./TracksTable";

// Types
type SpotifyImage = { url: string; height: number | null; width: number | null };
type SpotifyUser = { display_name?: string };
type SimplifiedTrack = {
  id: string | null;
  name: string;
  artists: string[];
  albumName?: string;
  albumImage?: string | null;
  duration_ms: number;
  added_at?: string | null;
};

type PlaylistDetails = {
  id: string;
  name: string;
  description?: string | null;
  images: SpotifyImage[];
  owner: SpotifyUser;
  tracksTotal: number;
};

function msToTime(ms: number) {
  const totalMinutes = Math.floor(ms / 1000 / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
}

export default function PlaylistClient({
  header,
  tracks,
  hasHeaderError,
  hasTracksError,
}: {
  header: PlaylistDetails | null;
  tracks: SimplifiedTrack[];
  hasHeaderError: boolean;
  hasTracksError: boolean;
}) {
  const { showToast } = useToast();

  useEffect(() => {
    if (hasHeaderError) {
      showToast({
        type: "error",
        message: "Failed to load playlist details.",
        action: {
          label: "Reload",
          onClick: () => window.location.reload(),
        },
      });
    }
    if (hasTracksError) {
      showToast({
        type: "error",
        message: "Failed to load some tracks. Some content may be missing.",
        action: {
          label: "Reload",
          onClick: () => window.location.reload(),
        },
      });
    }
  }, [hasHeaderError, hasTracksError, showToast]);

  if (!header) {
    return (
      <main className="px-6 pt-6 pb-24">
        <div className="text-center text-white/60">
          <p>Failed to load playlist details.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded-full px-4 py-2 text-sm text-white/90 hover:bg-white/10 transition-colors"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  const totalDuration = tracks.reduce((acc, t) => acc + (t.duration_ms || 0), 0);

  return (
    <main className="px-6 pt-6 pb-24">
      {/* Header with gradient background */}
      <section className="relative overflow-hidden rounded-xl mb-8">
        {/* Background image/gradient overlay */}
        <div className="absolute inset-0">
          {header.images?.[0]?.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={header.images[0].url}
              alt=""
              className="h-full w-full object-cover opacity-30 blur-sm scale-110"
            />
          ) : null}
          <div className="absolute inset-0 bg-gradient-to-b from-purple-900/60 via-black/80 to-black" />
        </div>
        
        {/* Header content */}
        <div className="relative px-6 py-10 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            {/* Cover image */}
            <div className="relative flex-shrink-0">
              <div className="h-48 w-48 rounded-lg overflow-hidden">
                {header.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={header.images[0].url}
                    alt={`${header.name} cover`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div
                    className="h-full w-full"
                    style={{ background: "linear-gradient(135deg, rgba(139,92,246,.6), rgba(168,85,247,.4))" }}
                  />
                )}
              </div>
            </div>
            
            {/* Playlist info */}
            <div className="flex-1 min-w-0">
              <div className="text-xs text-white/80 font-medium uppercase tracking-wide mb-2">Playlist</div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
                {header.name}
              </h1>
              <div className="flex flex-wrap items-center gap-1 text-sm text-white/90 mb-3">
                {header.owner?.display_name ? (
                  <>
                    <span className="font-medium">{header.owner.display_name}</span>
                    <span className="text-white/60">•</span>
                  </>
                ) : null}
                <span>{header.tracksTotal.toLocaleString()} songs</span>
                <span className="text-white/60">•</span>
                <span className="text-white/70">{msToTime(totalDuration)}</span>
              </div>
              {header.description ? (
                <p className="text-white/80 text-sm leading-relaxed max-w-2xl line-clamp-3">
                  {stripHtml(header.description)}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <h2 className="text-xl font-semibold text-white/90">Tracks</h2>
          <div className="text-xs text-white/50">Total: {tracks.length}</div>
        </div>
        <TracksTable tracks={tracks} />
      </section>
    </main>
  );
}