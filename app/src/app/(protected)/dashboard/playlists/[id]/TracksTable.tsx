"use client";

import { useEffect, useMemo, useState } from "react";

export type SimplifiedTrack = {
  id: string | null;
  name: string;
  artists: string[];
  albumName?: string;
  albumImage?: string | null;
  duration_ms: number;
  added_at?: string | null;
};

 type SortKey = "title" | "artist" | "duration" | "added";
 type SortState = { key: SortKey; dir: "asc" | "desc" };
 
 function msToMMSS(ms: number) {
   const totalSeconds = Math.floor(ms / 1000);
   const minutes = Math.floor(totalSeconds / 60);
   const seconds = totalSeconds % 60;
   return `${minutes}:${seconds.toString().padStart(2, "0")}`;
 }

// Deterministic date formatting to avoid SSR/CSR hydration mismatches
function formatDateUTC(dateISO?: string | null) {
  if (!dateISO) return "";
  try {
    const d = new Date(dateISO);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }).format(d);
  } catch {
    return "";
  }
}
 
 export default function TracksTable({ tracks }: { tracks: SimplifiedTrack[] }) {
   const [sort, setSort] = useState<SortState>({ key: "added", dir: "desc" });
   const [query, setQuery] = useState("");
   const [showArtist, setShowArtist] = useState(true);
   const [showAlbum, setShowAlbum] = useState(true);
   const [showAdded, setShowAdded] = useState(true);
   const [nowPlayingId, setNowPlayingId] = useState<string | null>(null);

   useEffect(() => {
     const onNow = (e: Event) => {
       const detail = (e as CustomEvent<{ trackId?: string | null; preview?: boolean }>).detail;
       if (!detail) return;
       if (detail.preview) {
         setNowPlayingId(null);
       } else {
         setNowPlayingId(detail.trackId ?? null);
       }
     };
     window.addEventListener("player:nowplaying", onNow as EventListener);
     return () => window.removeEventListener("player:nowplaying", onNow as EventListener);
   }, []);

   const toggleSort = (key: SortKey) => {
     setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
   };

   const filtered = useMemo(() => {
     const q = query.trim().toLowerCase();
     if (!q) return tracks;
     return tracks.filter((t) =>
       (t.name || "").toLowerCase().includes(q) ||
       (t.artists?.join(", ") || "").toLowerCase().includes(q)
     );
   }, [tracks, query]);

   const sorted = useMemo(() => {
     const arr = [...filtered];
     const dir = sort.dir === "asc" ? 1 : -1;
     const collator = new Intl.Collator();
     switch (sort.key) {
       case "title":
         arr.sort((a, b) => dir * collator.compare(a.name || "", b.name || ""));
         break;
       case "artist":
         arr.sort((a, b) => dir * collator.compare(a.artists?.[0] || "", b.artists?.[0] || ""));
         break;
       case "duration":
         arr.sort((a, b) => dir * ((a.duration_ms || 0) - (b.duration_ms || 0)));
         break;
       case "added":
         arr.sort((a, b) => dir * ((new Date(a.added_at || 0).getTime()) - (new Date(b.added_at || 0).getTime())));
         break;
       default:
         break;
     }
     return arr;
   }, [filtered, sort]);

   const playNow = (trackId: string | null, meta?: { title?: string; artist?: string; image?: string | null; duration_ms?: number }) => {
     if (!trackId) return;
     const title = meta?.title ?? "Untitled";
     const artist = meta?.artist ?? "";
     const image = meta?.image ?? undefined;
     const duration_ms = typeof meta?.duration_ms === "number" && meta.duration_ms > 0 ? meta.duration_ms : 180000;
     window.dispatchEvent(new CustomEvent("player:demo:load", { detail: { id: trackId, title, artist, image: image || undefined, duration_ms } }));
     window.dispatchEvent(new CustomEvent("player:nowplaying", { detail: { trackId, preview: false } }));
   };

   return (
     <div className="w-full overflow-x-auto">
       {/* Controls: column visibility + search */}
       <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text.white/70">
         <span className="text-white/60">Columns:</span>
         <label className="inline-flex items-center gap-2 cursor-pointer select-none">
           <input
             type="checkbox"
             checked={showArtist}
             onChange={(e) => setShowArtist(e.target.checked)}
             className="h-3 w-3 accent-white/80"
             aria-label="Toggle Artist column"
           />
           <span>Artist</span>
         </label>
         <label className="inline-flex items-center gap-2 cursor-pointer select-none">
           <input
             type="checkbox"
             checked={showAlbum}
             onChange={(e) => setShowAlbum(e.target.checked)}
             className="h-3 w-3 accent-white/80"
             aria-label="Toggle Album column"
           />
           <span>Album</span>
         </label>
         <label className="inline-flex items-center gap-2 cursor-pointer select-none">
           <input
             type="checkbox"
             checked={showAdded}
             onChange={(e) => setShowAdded(e.target.checked)}
             className="h-3 w-3 accent-white/80"
             aria-label="Toggle Added column"
           />
           <span>Added</span>
         </label>
         <input
           type="search"
           value={query}
           onChange={(e) => setQuery(e.target.value)}
           aria-label="Search tracks or artists"
           placeholder="Search tracks or artists"
           className="ml-auto w-full sm:w-64 rounded bg.white/10 px-3 py-2 text-sm text-white placeholder-white/40 focus:outline-none"
         />
       </div>

       <table className="min-w-full text-sm">
         <thead>
           <tr className="text-left text-white/60">
             <th className="w-10 px-2 sticky top-0 z-10 bg-black/40 backdrop-blur">#</th>
             <th className="px-2 cursor-pointer select-none sticky top-0 z-10 bg-black/40 backdrop-blur" onClick={() => toggleSort("title")}>Title</th>
             {showArtist ? (
               <th className="px-2 hidden sm:table-cell cursor-pointer select-none sticky top-0 z-10 bg-black/40 backdrop-blur" onClick={() => toggleSort("artist")}>Artist</th>
             ) : null}
             {showAlbum ? (
               <th className="px-2 hidden md:table-cell sticky top-0 z-10 bg-black/40 backdrop-blur">Album</th>
             ) : null}
             <th className="px-2 cursor-pointer select-none text-right sticky top-0 z-10 bg-black/40 backdrop-blur" onClick={() => toggleSort("duration")}>Duration</th>
             {showAdded ? (
               <th className="px-2 cursor-pointer select-none hidden lg:table-cell sticky top-0 z-10 bg-black/40 backdrop-blur" onClick={() => toggleSort("added")}>Added</th>
             ) : null}
             <th className="w-16 px-2 text-right sticky top-0 z-10 bg-black/40 backdrop-blur">Actions</th>
           </tr>
         </thead>
         <tbody>
            {sorted.map((t, idx) => (
              <tr
                key={`${t.id || idx}-${t.added_at || "na"}`}
                className={`hover:bg-white/5 cursor-pointer ${t.id && nowPlayingId && t.id === nowPlayingId ? "bg-white/10 ring-1 ring-white/20" : ""}`}
                onClick={() => playNow(t.id, { title: t.name, artist: t.artists?.join(", ") || "", image: t.albumImage || undefined, duration_ms: t.duration_ms })}
              >
                <td className="px-2 py-3 text.white/50">{idx + 1}</td>
               <td className="px-2 py-3">
                 <div className="flex items-center gap-3 min-w-0">
                   {t.albumImage ? (
                     // eslint-disable-next-line @next/next/no-img-element
                     <img src={t.albumImage} alt="cover" className="h-10 w-10 rounded object-cover" />
                   ) : (
                     <div className="h-10 w-10 rounded bg-white/10" />
                   )}
                   <div className="min-w-0">
                     <div className="text-white/90 truncate flex items-center gap-2">
                       <button
                         aria-label="Play"
                         className="h-6 w-6 rounded-full bg-primary/30 text-white/80 grid place-items-center text-[10px] hover:bg-primary/50"
                         title="Play"
                         onClick={(e) => { e.preventDefault(); e.stopPropagation(); playNow(t.id, { title: t.name, artist: t.artists?.join(", ") || "", image: t.albumImage || undefined, duration_ms: t.duration_ms }); }}
                       >
                         ▶
                       </button>
                       <span className="truncate">{t.name}</span>
                     </div>
                     <div className="text-white/60 text-xs truncate">
                       {t.artists?.join(", ")}
                     </div>
                   </div>
                 </div>
               </td>
               {showArtist ? (
                 <td className="px-2 py-3 hidden sm:table-cell text-white/70 truncate">{t.artists?.join(", ")}</td>
               ) : null}
               {showAlbum ? (
                 <td className="px-2 py-3 hidden md:table-cell text-white/60 truncate">{t.albumName || ""}</td>
               ) : null}
               <td className="px-2 py-3 text-white/70 text-right">{msToMMSS(t.duration_ms || 0)}</td>
               {showAdded ? (
                 <td className="px-2 py-3 hidden lg:table-cell text-white/50">{formatDateUTC(t.added_at)}</td>
               ) : null}
                <td className="px-2 py-3 text-right">
                  <button
                    aria-label="More"
                    className="rounded px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                    title="Context menu (placeholder)"
                  >
                    ···
                  </button>
                </td>
              </tr>
            ))}
         </tbody>
       </table>
     </div>
   );
 }