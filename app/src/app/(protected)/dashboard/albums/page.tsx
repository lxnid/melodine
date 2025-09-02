import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

// Types
type SpotifyImage = { url: string; height: number | null; width: number | null };
type SavedAlbum = { album?: { id: string; name: string; images?: SpotifyImage[]; artists?: { name?: string }[] } };

type SavedAlbumsResponse = { items?: SavedAlbum[] };

async function getSavedAlbums(token: string): Promise<SavedAlbumsResponse | null> {
  try {
    const res = await fetch("https://api.spotify.com/v1/me/albums?limit=24", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DashboardAlbumsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const token = (session as any).accessToken as string | undefined;
  if (!token) redirect("/");

  const data = await getSavedAlbums(token);
  const albums = (data?.items || []).map((it) => it.album).filter(Boolean) as NonNullable<SavedAlbum["album"]>[];

  return (
    <main className="px-6 pt-6 pb-24 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white/90">Albums</h1>
          <p className="mt-2 text-white/60">Your saved albums</p>
        </div>
      </div>

      {albums.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {albums.map((al) => (
            <div key={al.id} className="rounded-xl p-4 hover:bg-white/5 transition-colors">
              <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-4">
                {al.images?.[0]?.url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={al.images[0].url} alt="" className="absolute inset-0 h-full w-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-white/10" />
                )}
              </div>
              <div className="text-white/90 font-medium truncate">{al.name}</div>
              <div className="text-white/60 text-xs truncate">{al.artists?.map((a) => a.name).filter(Boolean).join(", ")}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-white/60 text-sm">No saved albums found.</div>
      )}
    </main>
  );
}