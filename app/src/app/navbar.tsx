"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";

export default function Navbar() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  return (
    <header className="fixed top-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white/90 font-semibold tracking-wide">Melodine</Link>
        <nav className="flex items-center gap-3">
          {loading ? (
            <span className="text-sm text-white/60">Loading...</span>
          ) : session?.user ? (
            <>
              <Link href="/dashboard" className="glass rounded-full px-4 py-2 text-sm text-white/90">Dashboard</Link>
              <Link href="/playlists" className="glass rounded-full px-4 py-2 text-sm text-white/90">Playlists</Link>
              {session.user.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="avatar" className="h-8 w-8 rounded-full object-cover" />
              ) : null}
              <button onClick={() => signOut({ callbackUrl: "/" })} className="glass rounded-full px-4 py-2 text-sm text-white/90">
                Sign out
              </button>
            </>
          ) : (
            <button onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })} className="glass rounded-full px-4 py-2 text-sm text-white/90">
              Sign in
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}