"use client";

import { useState } from "react";

type SpotifyImage = { url: string; height: number | null; width: number | null };

type SpotifyPlaylist = {
  id: string;
  name: string;
  images: SpotifyImage[];
  tracks: { total: number };
  description?: string;
  owner?: { display_name?: string };
  public?: boolean | null;
};

type PlaylistsResponse = {
  items: SpotifyPlaylist[];
  next: string | null;
};

export default function PlaylistsGrid({
  initialItems,
  initialNext,
  accessToken,
}: {
  initialItems: SpotifyPlaylist[];
  initialNext: string | null;
  accessToken: string;
}) {
  // Deduplicate initial items by id
  const [items, setItems] = useState<SpotifyPlaylist[]>(() => {
    const seen = new Set<string>();
    return initialItems.filter((pl) => {
      if (!pl?.id || seen.has(pl.id)) return false;
      seen.add(pl.id);
      return true;
    });
  });
  const [idSet, setIdSet] = useState<Set<string>>(() => new Set(items.map((pl) => pl.id)));

  const [next, setNext] = useState<string | null>(initialNext);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadMore = async () => {
    if (!next || loading || !accessToken) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(next, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      if (!res.ok) {
        setError("Failed to load more playlists.");
        return;
      }
      const data: PlaylistsResponse = await res.json();
      const uniqueNew = (data.items || []).filter((pl) => pl?.id && !idSet.has(pl.id));
      if (uniqueNew.length) {
        setItems((prev) => [...prev, ...uniqueNew]);
        setIdSet((prev) => new Set([...prev, ...uniqueNew.map((p) => p.id)]));
      }
      setNext(data.next ?? null);
    } catch {
      setError("Network error while loading more playlists.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {items?.length ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((pl) => (
            <a href={`/playlists/${pl.id}`} key={pl.id} className="block glass rounded-xl p-5 hover:scale-[1.01] transition-transform">
               {pl.images?.[0]?.url ? (
                 // eslint-disable-next-line @next/next/no-img-element
                 <img
                   src={pl.images[0].url}
                   alt={`${pl.name} cover`}
                   className="h-36 w-full rounded-lg mb-4 object-cover"
                 />
               ) : (
                 <div
                   className="h-36 w-full rounded-lg mb-4"
                   style={{ background: "linear-gradient(135deg, rgba(139,92,246,.35), rgba(168,85,247,.25))" }}
                 />
               )}
               <div className="text-white/90 font-medium truncate">{pl.name}</div>
               <div className="mt-1 text-white/60 text-xs line-clamp-2">
                 {typeof pl.tracks?.total === "number" ? `${pl.tracks.total} tracks` : ""}
                 {pl.owner?.display_name ? ` • by ${pl.owner.display_name}` : ""}
               </div>
            </a>
           ))}

          {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="glass rounded-xl p-5 animate-pulse">
                <div className="h-36 w-full rounded-lg mb-4 bg-white/10" />
                <div className="h-4 w-3/5 bg-white/10 rounded" />
                <div className="mt-2 h-3 w-2/5 bg-white/10 rounded" />
              </div>
            ))}
        </div>
      ) : (
        <div className="text-white/60 text-sm">No playlists found. Make sure your Spotify account has playlists or check scopes.</div>
      )}

      {error ? <div className="mt-4 text-xs text-red-300">{error}</div> : null}

      <div className="mt-8 flex justify-center">
        {next ? (
          <button
            onClick={loadMore}
            disabled={loading || !next}
            className="glass rounded-full px-5 py-2 text-sm text-white/90 disabled:opacity-60"
          >
            {loading ? "Loading..." : "Load more"}
          </button>
        ) : items.length ? (
          <div className="text-white/50 text-xs">You’ve reached the end.</div>
        ) : null}
      </div>
    </div>
  );
}