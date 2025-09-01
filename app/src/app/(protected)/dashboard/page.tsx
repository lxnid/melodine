import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  return (
    <main className="min-h-screen px-6 pt-28 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-white/90">Welcome{session.user?.name ? `, ${session.user.name}` : ""}</h1>
      <p className="mt-2 text-white/60">This dashboard is protected. Spotify features will be added soon.</p>
    </main>
  );
}