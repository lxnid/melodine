import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function DashboardLibraryPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");
  const token = (session as any).accessToken as string | undefined;
  if (!token) redirect("/");

  return (
    <main className="px-6 pt-6 pb-24 max-w-7xl mx-auto">
      <div className="flex items-end justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white/90">Your Library</h1>
          <p className="mt-2 text-white/60">Browse your playlists, artists, and albums</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link href="/dashboard/playlists" className="rounded-xl p-6 hover:bg-white/5 transition-colors">
          <div className="text-lg font-semibold text-white/90 mb-2">Playlists</div>
          <div className="text-white/60 text-sm">View your playlists</div>
        </Link>
        <Link href="/dashboard/artists" className="rounded-xl p-6 hover:bg-white/5 transition-colors">
          <div className="text-lg font-semibold text-white/90 mb-2">Artists</div>
          <div className="text-white/60 text-sm">Your top artists</div>
        </Link>
        <Link href="/dashboard/albums" className="rounded-xl p-6 hover:bg-white/5 transition-colors">
          <div className="text-lg font-semibold text-white/90 mb-2">Albums</div>
          <div className="text-white/60 text-sm">Your saved albums</div>
        </Link>
      </div>
    </main>
  );
}