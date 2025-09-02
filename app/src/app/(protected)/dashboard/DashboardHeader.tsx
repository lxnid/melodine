"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { signIn, signOut } from "next-auth/react";

export default function DashboardHeader({ userName, userImage, hasAuthError = false }: { userName?: string; userImage?: string; hasAuthError?: boolean }) {
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Sync input with ?q= from /dashboard/search
  useEffect(() => {
    if (pathname?.startsWith("/dashboard/search")) {
      const q = searchParams?.get("q") || "";
      setQuery(q);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    if (!q) return;
    router.push(`/dashboard/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="sticky top-0 z-20 bg-black/50 backdrop-blur">
      <div className="px-6 py-4 flex items-center gap-4">
        {/* Search */}
        <div className="flex-1">
          <form onSubmit={onSubmit} className="relative max-w-xl">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search songs, artists, playlists"
              className="w-full rounded-lg bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:bg-white/15"
              aria-label="Search"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-white/70 hover:text-white"
              aria-label="Submit search"
            >
              ↵
            </button>
          </form>
        </div>

        {/* User profile */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex items-center gap-3 rounded px-2 py-1 hover:bg-white/10 focus:outline-none focus-visible:bg-white/15"
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Open user menu"
          >
            <div className="h-9 w-9 rounded-full overflow-hidden bg-white/10">
              {userImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={userImage} alt={userName || "User"} className="h-full w-full object-cover" />
              ) : (
                <div
                  className="h-full w-full"
                  style={{ background: "conic-gradient(from 90deg at 50% 50%, rgba(139,92,246,.6), rgba(168,85,247,.4), rgba(139,92,246,.6))" }}
                />
              )}
            </div>
            <div className="leading-tight hidden sm:block text-left">
              <div className="text-white/90 text-sm">{userName || "User"}</div>
              <div className="text-white/50 text-xs">Account</div>
            </div>
            <svg className="w-4 h-4 text-white/70" viewBox="0 0 20 20" fill="currentColor"><path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z"/></svg>
          </button>

          {menuOpen && (
            <div role="menu" className="absolute right-0 mt-2 w-48 rounded-md bg-black/80 backdrop-blur">
              <div className="py-1">
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  onClick={() => router.push("/dashboard")}
                >
                  Home
                </button>
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  onClick={() => router.push("/dashboard/library")}
                >
                  Your Library
                </button>
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 text-sm text-white/90 hover:bg-white/10"
                  onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
                >
                  Reconnect Spotify
                </button>
                <div className="my-1 h-px bg-white/10" />
                <button
                  role="menuitem"
                  className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-white/10"
                  onClick={() => signOut({ callbackUrl: "/" })}
                >
                  Sign out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {hasAuthError ? (
        <div className="px-6 pb-3 -mt-2">
          <div className="rounded-md bg-amber-500/10 text-amber-200 text-xs sm:text-sm px-3 py-2 flex items-center justify-between gap-3">
            <span>Spotify session expired or missing permissions. Please reconnect.</span>
            <button
              onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
              className="rounded-full bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 px-3 py-1 text-xs sm:text-sm"
            >
              Reconnect
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}