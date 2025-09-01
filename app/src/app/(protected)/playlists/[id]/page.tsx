import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
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

// Utils
 function msToTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  if (hours > 0) return `${hours} hr ${minutes} min`;
  return `${minutes} min ${seconds.toString().padStart(2, "0")} sec`;
 }

 function stripHtml(html?: string | null) {
  if (!html) return "";
  return html.replace(/<[^>]+>/g, "");
 }

// Data fetching
 async function getPlaylistHeader(id: string, accessToken: string): Promise<PlaylistDetails | null> {
  try {
    const res: Response = await fetch(
      `https://api.spotify.com/v1/playlists/${encodeURIComponent(id)}?fields=id,name,description,images,owner(display_name),tracks(total)`,
      { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" }
    );
    if (!res.ok) return null;
    const data: any = await res.json();
    return {
      id: data.id,
      name: data.name,
      description: data.description ?? null,
      images: data.images ?? [],
      owner: data.owner ?? {},
      tracksTotal: data?.tracks?.total ?? 0,
    } as PlaylistDetails;
  } catch {
    return null;
  }
 }

 async function getAllPlaylistTracks(id: string, accessToken: string): Promise<SimplifiedTrack[]> {
  let url: string | null = `https://api.spotify.com/v1/playlists/${encodeURIComponent(id)}/tracks?limit=100&fields=items(added_at,track(id,name,duration_ms,album(name,images),artists(name))),next`;
  const items: SimplifiedTrack[] = [];
  try {
    while (url) {
      const res: Response = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
      if (!res.ok) break;
      const data: any = await res.json();
      const pageItems: SimplifiedTrack[] = (data.items || [])
        .map((it: any) => {
          const t = it?.track;
          if (!t) return null;
          return {
            id: t.id ?? null,
            name: t.name ?? "Unknown",
            artists: Array.isArray(t.artists) ? t.artists.map((a: any) => a?.name).filter(Boolean) : [],
            albumName: t.album?.name ?? undefined,
            albumImage: t.album?.images?.[0]?.url ?? null,
            duration_ms: t.duration_ms ?? 0,
            added_at: it?.added_at ?? null,
          } as SimplifiedTrack;
        })
        .filter(Boolean);
      items.push(...pageItems);
      url = data.next ?? null;
    }
  } catch {
    // ignore; return what we have
  }
  return items;
 }

export default async function PlaylistDetailPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const accessToken = (session as any).accessToken as string | undefined;
  if (!accessToken) redirect("/");

  const { id } = params;
  const header = await getPlaylistHeader(id, accessToken);
  if (!header) redirect("/playlists");

  const tracks = await getAllPlaylistTracks(id, accessToken);
  const totalDuration = tracks.reduce((acc, t) => acc + (t.duration_ms || 0), 0);

  return (
    <main className="min-h-screen px-6 pt-28 max-w-6xl mx-auto">
      {/* Header */}
      <section className="flex flex-col md:flex-row items-start md:items-center gap-6">
        {header.images?.[0]?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={header.images[0].url}
            alt={`${header.name} cover`}
            className="h-40 w-40 rounded-lg object-cover shadow-lg"
          />
        ) : (
          <div
            className="h-40 w-40 rounded-lg"
            style={{ background: "linear-gradient(135deg, rgba(139,92,246,.35), rgba(168,85,247,.25))" }}
          />
        )}
        <div className="min-w-0">
          <h1 className="text-3xl font-bold text-white/90 truncate">{header.name}</h1>
          <div className="mt-2 text-white/70 text-sm">
            {header.owner?.display_name ? `By ${header.owner.display_name}` : ""}
          </div>
          {header.description ? (
            <p className="mt-3 text-white/70 text-sm line-clamp-3">{stripHtml(header.description)}</p>
          ) : null}
          <div className="mt-3 text-white/60 text-xs">
            {header.tracksTotal} tracks • {msToTime(totalDuration)}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-semibold text-white/90">Tracks</h2>
          <div className="text-xs text-white/50">Total: {tracks.length}</div>
        </div>
        <div className="mt-4">
          <TracksTable
            tracks={tracks}
          />
        </div>
      </section>
    </main>
  );
}