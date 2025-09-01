import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import ProfileCard from "@/app/ProfileCard";

async function getProfile(accessToken: string | undefined) {
  if (!accessToken) return null;
  try {
    const res = await fetch("https://api.spotify.com/v1/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
      // Avoid caching since token-based
      cache: "no-store",
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  const profile = await getProfile((session as any).accessToken);

  return (
    <main className="min-h-screen px-6 pt-28 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white/90">Welcome{session.user?.name ? `, ${session.user.name}` : ""}</h1>
      <p className="mt-2 text-white/60">This dashboard is protected. Spotify features will be added soon.</p>

      <section className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold text-white/90">Your Spotify Profile</h2>
        {profile ? (
          <ProfileCard profile={profile as any} />
        ) : (
          <p className="mt-3 text-white/60 text-sm">No profile data available yet. Complete Spotify sign-in to see your info.</p>
        )}
      </section>
    </main>
  );
}