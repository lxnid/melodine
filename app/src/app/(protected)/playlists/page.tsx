import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function PlaylistsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const stubPlaylists = Array.from({ length: 6 }).map((_, i) => ({
    id: `stub-${i + 1}`,
    name: `Your Playlist ${i + 1}`,
    description: "Curated tracks to vibe to.",
  }));

  return (
    <main className="min-h-screen px-6 pt-28 max-w-6xl mx-auto">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white/90">Playlists</h1>
          <p className="mt-2 text-white/60">Browse your playlists. Spotify integration coming next.</p>
        </div>
      </div>

      <section className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stubPlaylists.map((pl) => (
          <div key={pl.id} className="glass rounded-xl p-5 hover:scale-[1.01] transition-transform">
            <div className="h-36 w-full rounded-lg mb-4"
              style={{ background: "linear-gradient(135deg, rgba(139,92,246,.35), rgba(168,85,247,.25))" }}
            />
            <div className="text-white/90 font-medium truncate">{pl.name}</div>
            <div className="mt-1 text-white/60 text-xs line-clamp-2">{pl.description}</div>
          </div>
        ))}
      </section>
    </main>
  );
}