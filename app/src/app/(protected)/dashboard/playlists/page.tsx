import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import PlaylistsGrid from "./PlaylistsGrid";

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

export default async function DashboardPlaylistsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const accessToken = (session as any).accessToken as string | undefined;
  const initial = await getPlaylists(accessToken);

  return (
    <main className="px-6 pt-6 pb-24 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white/90">Your Library</h1>
          <p className="mt-2 text-white/60">Your Spotify playlists and favorites</p>
        </div>
        <button className="rounded-full px-5 py-2.5 text-sm text-white/90 font-medium bg-white/5 hover:bg-white/10 transition-colors">
          <svg className="w-4 h-4 inline-block mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd"/>
          </svg>
          New Playlist
        </button>
      </div>

      <PlaylistsGrid
        initialItems={initial?.items ?? []}
        initialNext={initial?.next ?? null}
        accessToken={accessToken ?? ""}
        hasInitialError={!initial}
      />
    </main>
  );
}