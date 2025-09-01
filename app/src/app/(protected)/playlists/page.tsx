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

export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const accessToken = (session as any).accessToken as string | undefined;
  const initial = await getPlaylists(accessToken);

  return (
    <main className="min-h-screen px-6 pt-28 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white/90">Playlists</h1>
          <p className="mt-2 text-white/60">Your Spotify playlists. First 24 shown; load more available.</p>
        </div>
      </div>

      <section className="mt-8">
        <PlaylistsGrid
          initialItems={initial?.items ?? []}
          initialNext={initial?.next ?? null}
          accessToken={accessToken ?? ""}
        />
      </section>
    </main>
  );
}