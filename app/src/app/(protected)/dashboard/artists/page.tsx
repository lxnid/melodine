import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

// Types
type SpotifyImage = { url: string; height: number | null; width: number | null };
type Artist = { id: string; name: string; images?: SpotifyImage[] };

type TopArtistsResponse = { items?: Artist[] };

async function getTopArtists(token: string): Promise<TopArtistsResponse | null> {
  try {
    const res = await fetch("https://api.spotify.com/v1/me/top/artists?limit=24", {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DashboardArtistsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const token = (session as any).accessToken as string | undefined;
  if (!token) redirect("/");

  const data = await getTopArtists(token);

  return (
    <main className="px-6 pt-6 pb-24 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white/90">Top Artists</h1>
          <p className="mt-2 text-white/60">Your most listened-to artists</p>
        </div>
      </div>

      {data?.items?.length ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {data.items.map((ar) => (
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
      ) : (
        <div className="text-white/60 text-sm">No top artists found.</div>
      )}
    </main>
  );
}