import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import Link from "next/link";
import PlayOnClick from "./PlayOnClick";

// Types
type SpotifyImage = { url: string; height: number | null; width: number | null };

type Playlist = { id: string; name: string; images?: SpotifyImage[] };

type Artist = { id: string; name: string; images?: SpotifyImage[] };

type Track = {
  id: string;
  name: string;
  duration_ms: number;
  artists?: { name?: string }[];
  album?: { images?: SpotifyImage[] };
};

type FeaturedPlaylistsResponse = { playlists?: { items?: Playlist[] } };

type TopArtistsResponse = { items?: Artist[] };

type TopTracksResponse = { items?: Track[] };

type RecentlyPlayedItem = { track?: Track | null };

type RecentlyPlayedResponse = { items?: RecentlyPlayedItem[] };

// Small helper for error-aware fetch JSON
async function fetchJson(url: string, token: string, quiet404: boolean = false) {
  try {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) {
      if (quiet404 && res.status === 404) {
        return null;
      }
      let body = "";
      try { body = await res.text(); } catch {}
      console.error("Spotify API non-OK:", res.status, url, body?.slice(0, 180));
      return null;
    }
    return res.json();
  } catch (e) {
    // Avoid noisy errors due to aborted requests or HMR
    return null;
  }
}

async function getFeaturedPlaylists(token: string): Promise<FeaturedPlaylistsResponse | null> {
  // Ensure a country fallback so we always get data (US if user market unknown)
  const url = "https://api.spotify.com/v1/browse/featured-playlists?limit=12&country=US";
  return fetchJson(url, token, true);
}

async function getRecentlyPlayed(token: string): Promise<RecentlyPlayedResponse | null> {
  const url = "https://api.spotify.com/v1/me/player/recently-played?limit=20";
  return fetchJson(url, token);
}

async function getTopArtists(token: string): Promise<TopArtistsResponse | null> {
  // Try multiple ranges to increase chances of non-empty data for new accounts
  const ranges = ["medium_term", "short_term", "long_term"];
  for (const r of ranges) {
    const data = await fetchJson(`https://api.spotify.com/v1/me/top/artists?limit=16&time_range=${r}`, token);
    if (data?.items?.length) return data as TopArtistsResponse;
  }
  return { items: [] };
}

async function getTopTracks(token: string): Promise<TopTracksResponse | null> {
  const ranges = ["medium_term", "short_term", "long_term"];
  for (const r of ranges) {
    const data = await fetchJson(`https://api.spotify.com/v1/me/top/tracks?limit=10&time_range=${r}`, token);
    if (data?.items?.length) return data as TopTracksResponse;
  }
  return { items: [] };
}

// Fallback: pull a charts-style playlist from the Toplists category and use its tracks
async function getToplistChartTracks(token: string): Promise<Track[]> {
  // 1) find a playlist under the Toplists category
  const cat = await fetchJson("https://api.spotify.com/v1/browse/categories/toplists/playlists?limit=1&country=US", token, true);
  const plId: string | undefined = cat?.playlists?.items?.[0]?.id;
  if (!plId) return [];

  // 2) fetch a handful of tracks from that playlist
  const fields = encodeURIComponent(
    "items(track(id,name,duration_ms,album(images),artists(name)))"
  );
  const tracksPayload = await fetchJson(
    `https://api.spotify.com/v1/playlists/${encodeURIComponent(plId)}/tracks?limit=10&fields=${fields}`,
    token
  );

  const items = tracksPayload?.items ?? [];
  const mapped: Track[] = items
    .map((it: any) => it?.track)
    .filter((t: any) => t && t.id)
    .map((t: any) => ({
      id: t.id as string,
      name: t.name as string,
      duration_ms: t.duration_ms as number,
      artists: (t.artists ?? []).map((a: any) => ({ name: a?.name })) as { name?: string }[],
      album: { images: t.album?.images as SpotifyImage[] | undefined },
    }));
  return mapped;
}

// Optional: category-based featured playlists fallback when featured returns empty
async function getToplistsFeaturedFallback(token: string): Promise<FeaturedPlaylistsResponse | null> {
  const data = await fetchJson("https://api.spotify.com/v1/browse/categories/toplists/playlists?limit=12&country=US", token, true);
  if (!data) return null;
  return data as FeaturedPlaylistsResponse; // shape compatible: data.playlists.items[]
}

async function getUserPlaylists(token: string): Promise<FeaturedPlaylistsResponse | null> {
  // Shape-compatible response: { playlists: { items: Playlist[] } }
  const data = await fetchJson("https://api.spotify.com/v1/me/playlists?limit=12", token);
  if (!data) return null;
  return { playlists: { items: (data.items ?? []).map((p: any) => ({ id: p.id, name: p.name, images: p.images })) } };
}

function formatDuration(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default async function DashboardHomePage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const token = (session as any).accessToken as string | undefined;
  if (!token) redirect("/");

  const [featured, recent, topArtists, topTracks] = await Promise.all([
    getFeaturedPlaylists(token),
    getRecentlyPlayed(token),
    getTopArtists(token),
    getTopTracks(token),
  ]);

  // Dedupe and slice recently played to show more items
  const recentlyPlayedRaw = (recent?.items ?? []).map((it) => it.track).filter((t): t is Track => !!t && !!t.id);
  const recentlyPlayed = recentlyPlayedRaw
    .filter((t, i, arr) => arr.findIndex((x) => x.id === t.id) === i)
    .slice(0, 16);

  // Resolve featured playlists with fallback
  let featuredPlaylists = (featured?.playlists?.items ?? []).filter((p): p is Playlist => !!p && !!p.id).slice(0, 12);
  if (!featuredPlaylists.length) {
    const catFallback = await getToplistsFeaturedFallback(token);
    featuredPlaylists = (catFallback?.playlists?.items ?? [])
      .filter((p: any): p is Playlist => !!p && !!p.id)
      .slice(0, 12);
  }
  if (!featuredPlaylists.length) {
    const mine = await getUserPlaylists(token);
    featuredPlaylists = (mine?.playlists?.items ?? []).filter((p): p is Playlist => !!p && !!p.id).slice(0, 12);
  }

  // Charts: prefer user top tracks, fallback to toplists playlist tracks
  let chartTracks = (topTracks?.items ?? []).filter((t): t is Track => !!t && !!t.id).slice(0, 10);
  if (!chartTracks.length) {
    // Try browse toplists (may 404 in some environments)
    try {
      chartTracks = await getToplistChartTracks(token);
    } catch {}
  }
  if (!chartTracks.length) {
    // Final fallback: use the user's recently played tracks
    chartTracks = recentlyPlayed.slice(0, 10);
  }

  // Popular artists: use top artists as-is (after multi-range retry)
  const popularArtists = (topArtists?.items ?? []).filter((a): a is Artist => !!a && !!a.id).slice(0, 16);

  // Fallback recommendations if no featured playlists
  let recommendedTracks: Track[] = [];
  async function getRecommendations(token: string, seedArtists: string[], seedTracks: string[]): Promise<{ tracks?: Track[] } | null> {
    const params = new URLSearchParams();
    params.set("limit", "12");
    // Add a stable market to increase success rate
    params.set("market", "US");
    if (seedArtists.length) params.set("seed_artists", seedArtists.slice(0, 2).join(","));
    if (seedTracks.length) params.set("seed_tracks", seedTracks.slice(0, 3).join(","));
    return fetchJson(`https://api.spotify.com/v1/recommendations?${params.toString()}`, token);
  }

  if (!featuredPlaylists.length) {
    const seedArtists = popularArtists.slice(0, 2).map((a) => a.id);
    const seedTracks = chartTracks.slice(0, 3).map((t: Track) => t.id);
    const rec = await getRecommendations(token, seedArtists, seedTracks);
    recommendedTracks = (rec?.tracks ?? []).filter((t): t is Track => !!t && !!t.id).slice(0, 12);
  }

  return (
    <main className="px-6 pt-6 pb-24 max-w-7xl mx-auto">
      {/* Welcome section */}
      <section className="mb-8">
        <h1 className="text-2xl font-bold text-white/90 mb-2">
          {`Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}`}
          {session.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-white/60">Discover music you'll love</p>
      </section>

      {/* Recently played / Quick access */}
      <section className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white/90">Recently played</h2>
          <Link href="/dashboard" className="text-sm text-white/60 hover:text-white">Refresh</Link>
        </div>
        {recentlyPlayed.length ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 xl:grid-cols-8 gap-2">
            {recentlyPlayed.map((t, i) => (
              <PlayOnClick key={t.id ?? `rp-${i}`} trackId={t.id} title={t.name} artist={(t.artists ?? []).map((a) => a?.name).filter(Boolean).join(", ")} image={t.album?.images?.[0]?.url ?? ""} duration_ms={t.duration_ms} className="rounded-lg p-2 hover:bg-white/10 transition-colors">
                <div className="w-full aspect-square rounded-md overflow-hidden mb-3">
                  {t.album?.images?.[0]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={t.album.images[0].url} alt="" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full bg-white/10" />
                  )}
                </div>
                <div className="text-white/90 text-sm font-medium truncate">{t.name}</div>
                <div className="text-white/60 text-xs truncate">{t.artists?.map((a) => a?.name).filter(Boolean).join(", ")}</div>
              </PlayOnClick>
            ))}
          </div>
        ) : (
          <div className="text-white/60 text-sm">No recent plays yet.</div>
        )}
      </section>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Featured or Recommended */}
        <div className="lg:col-span-2 space-y-8">
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white/90">Made for you</h2>
              <Link href="/dashboard/playlists" className="text-sm text-white/60 hover:text-white">Show all</Link>
            </div>
            {featuredPlaylists.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
                {featuredPlaylists.map((p) => (
                  <Link key={p.id} href={`/dashboard/playlists/${p.id}`} className="rounded-xl p-2 hover:bg-white/5 transition-colors">
                    <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                      {p.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                      ) : (
                        <div className="absolute inset-0 bg-white/10" />
                      )}
                    </div>
                    <div className="text-white/90 text-sm font-medium truncate mb-1">{p.name}</div>
                    <div className="text-white/60 text-xs">Playlist</div>
                  </Link>
                ))}
              </div>
            ) : recommendedTracks.length ? (
              <div>
                <div className="text-white/60 text-sm mb-2">Recommended for you</div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {recommendedTracks.map((t, i) => (
                    <PlayOnClick key={t.id ?? `rec-${i}`} trackId={t.id} title={t.name} artist={(t.artists ?? []).map((a) => a?.name).filter(Boolean).join(", ")} image={t.album?.images?.[0]?.url ?? ""} duration_ms={t.duration_ms} className="rounded-xl p-4 hover:bg-white/5 transition-colors">
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3">
                        {t.album?.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={t.album.images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        ) : (
                          <div className="absolute inset-0 bg-white/10" />
                        )}
                      </div>
                      <div className="text-white/90 text-sm font-medium truncate mb-1">{t.name}</div>
                      <div className="text-white/60 text-xs truncate">{t.artists?.map((a) => a?.name).filter(Boolean).join(", ")}</div>
                    </PlayOnClick>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-white/60 text-sm">No personalized picks available right now.</div>
            )}
          </section>

          {/* Popular artists */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white/90">Popular artists</h2>
              <Link href="/dashboard/artists" className="text-sm text-white/60 hover:text-white">Show all</Link>
            </div>
            {popularArtists.length ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-0">
                {popularArtists.map((ar, i) => (
                  <div key={ar.id ?? `ar-${i}`} className="rounded-xl p-2 hover:bg-white/5 transition-colors text-center">
                    <div className="relative w-full aspect-square mb-3">
                      <div className="absolute inset-0 m-3 rounded-full overflow-hidden">
                        {ar.images?.[0]?.url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={ar.images[0].url} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <div className="h-full w-full bg-white/10" />
                        )}
                      </div>
                    </div>
                     <div className="text-white/90 text-sm font-medium mb-1 whitespace-normal leading-snug">{ar.name}</div>
                     <div className="text-white/60 text-xs">Artist</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-white/60 text-sm">No popular artists yet.</div>
            )}
          </section>
        </div>

        {/* Sidebar content */}
        <div className="space-y-6">
          {/* Top Charts */}
          <section className="rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white/90">Top Charts</h3>
              <Link href="/dashboard" className="text-xs text-white/60 hover:text-white">Refresh</Link>
            </div>
            {chartTracks.length ? (
              <div className="space-y-3">
                {chartTracks.map((t, i) => (
                  <PlayOnClick key={t.id ?? `tt-${i}`} trackId={t.id} title={t.name} artist={(t.artists ?? []).map((a) => a?.name).filter(Boolean).join(", ")} image={t.album?.images?.[0]?.url ?? ""} duration_ms={t.duration_ms} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors">
                    <span className="w-6 text-white/40 text-sm font-medium">{i + 1}</span>
                    <div className="h-10 w-10 rounded overflow-hidden flex-shrink-0">
                      {t.album?.images?.[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={t.album.images[0].url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-white/10" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-white/90 text-sm font-medium truncate">{t.name}</div>
                      <div className="text-white/60 text-xs truncate">{t.artists?.map((a) => a?.name).filter(Boolean).join(", ")}</div>
                    </div>
                    <span className="text-white/50 text-xs">{formatDuration(t.duration_ms)}</span>
                  </PlayOnClick>
                ))}
              </div>
            ) : (
              <div className="text-white/60 text-sm">No top tracks yet.</div>
            )}
          </section>

          {/* Quick actions */}
          <section className="rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white/90 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/dashboard/playlists" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
                </svg>
                <span className="text-white/90 text-sm">Create Playlist</span>
              </Link>
              <Link href="/dashboard/search" className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.9 14.32a8 8 0 111.414-1.414l3.387 3.387a1 1 0 01-1.414 1.414l-3.387-3.387zM14 8a6 6 0 11-12 0 6 6 0 0112 0z" clipRule="evenodd"/>
                </svg>
                <span className="text-white/90 text-sm">Search</span>
              </Link>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}