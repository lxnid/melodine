import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";
import Link from "next/link";
import DemoPlayerBar from "./DemoPlayerBar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/");

  const userName = session.user?.name || undefined;
  const userImage = (session.user as any)?.image || undefined;
  const authError = (session as any)?.error;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Dashboard container */}
      <div className="flex h-screen">
        {/* Sidebar - hidden on mobile, visible on desktop */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <DashboardSidebar />
        </aside>

        {/* Main content area */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <DashboardHeader userName={userName} userImage={userImage} hasAuthError={!!authError} />
          
          {/* Scrollable content */}
          <div className="flex-1 overflow-y-auto pb-36 lg:pb-28">
            {children}
          </div>
        </main>
      </div>

      {/* Player bar (demo) */}
      <DemoPlayerBar />

      {/* Mobile bottom navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-black/90 backdrop-blur pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around py-2">
          <Link href="/dashboard" className="flex flex-col items-center gap-1 p-3">
            <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
            </svg>
            <span className="text-xs text-white/70">Home</span>
          </Link>
          <Link href="/dashboard/playlists" className="flex flex-col items-center gap-1 p-3">
            <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"/>
            </svg>
            <span className="text-xs text-white/70">Playlists</span>
          </Link>
          <Link href="/dashboard/artists" className="flex flex-col items-center gap-1 p-3">
            <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <span className="text-xs text-white/70">Artists</span>
          </Link>
          <Link href="/dashboard/search" className="flex flex-col items-center gap-1 p-3">
            <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
            </svg>
            <span className="text-xs text-white/70">Search</span>
          </Link>
        </div>
      </nav>
    </div>
  );
}