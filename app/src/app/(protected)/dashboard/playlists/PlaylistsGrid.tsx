"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/Toast";

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
  hasInitialError = false,
}: {
  initialItems: SpotifyPlaylist[];
  initialNext: string | null;
  accessToken: string;
  hasInitialError?: boolean;
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
  const { showToast } = useToast();

  useEffect(() => {
    if (hasInitialError) {
      showToast({
        type: "error",
        message: "Failed to load your playlists.",
        action: { label: "Retry", onClick: () => window.location.reload() },
      });
    }
  }, [hasInitialError, showToast]);

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
        showToast({
          type: "error",
          message: "Failed to load more playlists.",
          action: { label: "Retry", onClick: () => loadMore() },
        });
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
      showToast({ type: "error", message: "Network error while loading more playlists.", action: { label: "Retry", onClick: () => loadMore() } });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {items?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {items.map((pl) => (
            <a href={`/dashboard/playlists/${pl.id}`} key={pl.id} className="block rounded-xl hover:scale-[1.01] transition-transform group">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3">
                 {pl.images?.[0]?.url ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img
                     src={pl.images[0].url}
                     alt={`${pl.name} cover`}
                     className="absolute inset-0 h-full w-full object-cover"
                   />
                 ) : (
                   <div
                     className="absolute inset-0"
                     style={{ background: "linear-gradient(135deg, rgba(139,92,246,.35), rgba(168,85,247,.25))" }}
                   />
                 )}
                 {/* Play overlay button */}
                 <button
                   aria-label={`Play ${pl.name}`}
                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* TODO: integrate player */ }}
                   className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-green-500 text-white grid place-items-center opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0 transition-all"
                 >
                   ▶
                 </button>
               </div>
               <div className="flex items-start justify-between gap-3">
                 <div className="min-w-0">
                   <div className="text-white/90 text-sm sm:text-base font-medium truncate">{pl.name}</div>
                   <div className="mt-1 text-white/60 text-[11px] sm:text-xs line-clamp-2">
                     {typeof pl.tracks?.total === "number" ? `${pl.tracks.total} tracks` : ""}
                     {pl.owner?.display_name ? ` • by ${pl.owner.display_name}` : ""}
                   </div>
                 </div>
                 {/* Context menu button */}
                 <button
                   aria-label={`More options for ${pl.name}`}
                   onClick={(e) => { e.preventDefault(); e.stopPropagation(); /* TODO: open context menu */ }}
                   className="rounded px-2 py-1 text-white/60 hover:text-white hover:bg-white/10"
                 >
                   •••
                 </button>
               </div>
             </a>
           ))}

           {loading &&
            Array.from({ length: 6 }).map((_, i) => (
              <div key={`skeleton-${i}`} className="rounded-xl animate-pulse">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-2 sm:mb-3">
                   <div className="absolute inset-0 bg-white/10" />
                 </div>
                <div className="h-3.5 sm:h-4 w-3/5 bg-white/10 rounded" />
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
            className="rounded-full px-5 py-2 text-sm text-white/90 disabled:opacity-60 bg-white/5 hover:bg-white/10 transition-colors"
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