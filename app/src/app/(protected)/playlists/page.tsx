import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

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

async function getPlaylists(accessToken: string | undefined): Promise<PlaylistsResponse | null> {
  if (!accessToken) return null;
  try {
    const res = await fetch("https://api.spotify.com/v1/me/playlists?limit=24", {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const playlists = await getPlaylists((session as any).accessToken);

  return (
    <main className="min-h-screen px-6 pt-28 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white/90">Playlists</h1>
          <p className="mt-2 text-white/60">Your Spotify playlists. First 24 shown; pagination coming soon.</p>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists?.items?.length ? (
          playlists.items.map((pl) => (
            <div key={pl.id} className="glass rounded-xl p-5 hover:scale-[1.01] transition-transform">
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
            </div>
          ))
        ) : (
          <div className="text-white/60 text-sm">No playlists found. Make sure your Spotify account has playlists or check scopes.</div>
        )}
      </section>
    </main>
  );
}