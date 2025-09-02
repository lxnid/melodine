import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import PlayOnClick from "../PlayOnClick";

// Minimal types for search results
type SpotifyImage = { url: string; height: number | null; width: number | null };
type SimplifiedPlaylist = { id: string; name: string; images?: SpotifyImage[] };
type SimplifiedArtist = { id: string; name: string; images?: SpotifyImage[] };
// include preview_url and artists names
type SimplifiedTrack = { id: string | null; name: string; preview_url?: string | null; artists?: { name?: string }[]; album?: { images?: SpotifyImage[] }; duration_ms?: number | null };

// Note: We still require session to access Spotify search API for demo content
export default async function DashboardSearchPage(props: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const accessToken = (session as any).accessToken as string | undefined;
  if (!accessToken) redirect("/");

  const sp = await props.searchParams;
  const qRaw = sp?.q;
  const q = Array.isArray(qRaw) ? qRaw[0] : qRaw;

  let data: { playlists?: { items?: SimplifiedPlaylist[] }; artists?: { items?: SimplifiedArtist[] }; tracks?: { items?: SimplifiedTrack[] } } | null = null;
  if (q && q.trim()) {
    try {
      const url = new URL("https://api.spotify.com/v1/search");
      url.searchParams.set("q", q.trim());
      url.searchParams.set("type", "playlist,artist,track");
      url.searchParams.set("limit", "12");
      const res = await fetch(url.toString(), { headers: { Authorization: `Bearer ${accessToken}` }, cache: "no-store" });
      if (res.ok) data = await res.json();
    } catch {}
  }

  const playlistItems = (data?.playlists?.items ?? []).filter((pl): pl is SimplifiedPlaylist => !!pl && !!pl.id);
  const artistItems = (data?.artists?.items ?? []).filter((ar): ar is SimplifiedArtist => !!ar && !!ar.id);
  const trackItems = (data?.tracks?.items ?? []).filter((t): t is SimplifiedTrack => !!t);

  return (
    <main className="px-6 pt-6 pb-24 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-white/90">Search</h1>
        <p className="text-white/60 text-sm mt-1">{q ? `Results for "${q}"` : "Type a query in the search bar above and press Enter"}</p>
      </div>

      {q && !data && (
        <div className="text-white/60 text-sm">No results or failed to fetch results.</div>
      )}

      {/* Playlists */}
      {playlistItems.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-medium text-white/90 mb-4">Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {playlistItems.map((pl) => (
              <Link key={pl.id} href={`/dashboard/playlists/${pl.id}`} className="block rounded-xl p-4 hover:bg-white/5 transition-colors group">
                <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                  {pl.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={pl.images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-white/10" />
                  )}
                </div>
                <div className="text-white/90 font-medium truncate">{pl.name}</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Artists */}
      {artistItems.length > 0 && (
        <section className="mb-10">
          <h2 className="text-lg font-medium text-white/90 mb-4">Artists</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {artistItems.map((ar) => (
              <div key={ar.id} className="rounded-xl p-4 text-center hover:bg-white/5 transition-colors">
                <div className="mx-auto mb-3 h-28 w-28 rounded-full overflow-hidden">
                  {ar.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={ar.images[0].url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-white/10" />
                  )}
                </div>
                <div className="text-white/90 font-medium truncate">{ar.name}</div>
                <div className="text-white/50 text-xs">Artist</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Tracks */}
      {trackItems.length > 0 && (
        <section>
          <h2 className="text-lg font-medium text-white/90 mb-4">Songs</h2>
          <div className="space-y-2">
            {trackItems.map((t, idx) => {
              const title = t.name;
              const artist = (t.artists ?? []).map((a) => a?.name).filter(Boolean).join(", ");
              const image = t.album?.images?.[0]?.url ?? "";
              const duration_ms = (t.duration_ms ?? null) && t.duration_ms! > 0 ? t.duration_ms! : 180000;
              return (
                <PlayOnClick key={t.id ?? `idx-${idx}`} trackId={t.id ?? ""} title={title} artist={artist} image={image} duration_ms={duration_ms} className="flex items-center gap-3 rounded-lg px-3 py-2 hover:bg-white/5 transition-colors">
                  <div className="h-10 w-10 rounded overflow-hidden">
                    {t.album?.images?.[0]?.url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={t.album.images[0].url} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <div className="h-full w-full bg-white/10" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm text-white/90 truncate">{t.name}</div>
                    <div className="text-xs text-white/60 truncate">{artist}</div>
                  </div>
                </PlayOnClick>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}