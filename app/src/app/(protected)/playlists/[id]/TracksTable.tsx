"use client";

import { useMemo, useState } from "react";

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

export default function TracksTable({ tracks }: { tracks: SimplifiedTrack[] }) {
  const [sort, setSort] = useState<SortState>({ key: "added", dir: "desc" });
  const toggleSort = (key: SortKey) => {
    setSort((s) => (s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "asc" }));
  };

  const sorted = useMemo(() => {
    const arr = [...tracks];
    arr.sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      switch (sort.key) {
        case "title":
          return dir * a.name.localeCompare(b.name);
        case "artist":
          return dir * (a.artists?.[0]?.localeCompare(b.artists?.[0] || "") || 0);
        case "duration":
          return dir * ((a.duration_ms || 0) - (b.duration_ms || 0));
        case "added":
          return dir * ((new Date(a.added_at || 0).getTime()) - (new Date(b.added_at || 0).getTime()));
        default:
          return 0;
      }
    });
    return arr;
  }, [tracks, sort]);

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full text-sm">
        <thead>
          <tr className="text-left text-white/60">
            <th className="w-10 px-2">#</th>
            <th className="px-2 cursor-pointer select-none" onClick={() => toggleSort("title")}>Title</th>
            <th className="px-2 hidden sm:table-cell cursor-pointer select-none" onClick={() => toggleSort("artist")}>Artist</th>
            <th className="px-2 hidden md:table-cell">Album</th>
            <th className="px-2 cursor-pointer select-none text-right" onClick={() => toggleSort("duration")}>Duration</th>
            <th className="px-2 cursor-pointer select-none hidden lg:table-cell" onClick={() => toggleSort("added")}>Added</th>
            <th className="w-16 px-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((t, idx) => (
            <tr key={`${t.id || idx}-${t.added_at || "na"}`} className="border-t border-white/10 hover:bg-white/5">
              <td className="px-2 py-3 text-white/50">{idx + 1}</td>
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
                        className="h-6 w-6 rounded-full bg-primary/30 text-white/80 grid place-items-center text-[10px]"
                        title="Play/Pause (placeholder)"
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
              <td className="px-2 py-3 hidden sm:table-cell text-white/70 truncate">{t.artists?.join(", ")}</td>
              <td className="px-2 py-3 hidden md:table-cell text-white/60 truncate">{t.albumName || ""}</td>
              <td className="px-2 py-3 text-white/70 text-right">{msToMMSS(t.duration_ms || 0)}</td>
              <td className="px-2 py-3 hidden lg:table-cell text-white/50">{t.added_at ? new Date(t.added_at).toLocaleDateString() : ""}</td>
              <td className="px-2 py-3 text-right">
                <button
                  aria-label="More"
                  className="rounded px-2 py-1 text-xs text-white/70 hover:bg-white/10"
                  title="Context menu (placeholder)"
                >
                  •••
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}