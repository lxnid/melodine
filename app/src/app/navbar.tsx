"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="fixed top-0 left-0 right-0 z-20">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white/90 font-semibold tracking-wide">Melodine</Link>
        <nav className="flex items-center gap-3">
          {session?.user ? (
            <>
              <span className="text-sm text-white/70">Hi, {session.user.name ?? "Listener"}</span>
              <button className="glass rounded-full px-4 py-2 text-sm text-white/90">Sign out</button>
            </>
          ) : (
            <button className="glass rounded-full px-4 py-2 text-sm text-white/90">Sign in</button>
          )}
        </nav>
      </div>
    </header>
  );
}