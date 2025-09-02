"use client";

import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden p-6">
      {/* Glow gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-[40vh] w-[60vw] rounded-full blur-3xl opacity-50" style={{ background: "radial-gradient(closest-side, rgba(168,85,247,.35), transparent)" }} />
        <div className="absolute top-[30%] left-[-10%] h-[35vh] w-[45vw] rounded-full blur-3xl opacity-40" style={{ background: "radial-gradient(closest-side, rgba(139,92,246,.35), transparent)" }} />
      </div>

      {/* Hero */}
      <section className="relative z-10 text-center max-w-3xl mx-auto">
        <h1 className="text-white text-5xl sm:text-7xl font-extrabold leading-[1.1] tracking-tight">
          Discover.<span className="text-primary">Play</span>. Repeat.
        </h1>
        <p className="mt-6 text-muted text-sm sm:text-base leading-relaxed">
          Lose yourself in a world of music, curated just for you. Experience the freedom to explore and discover music like never before. Our intuitive interface and seamless navigation make it easy to find the perfect soundtrack for any occasion.
        </p>
        <div className="mt-8">
          <button
            onClick={() => signIn("spotify", { callbackUrl: "/dashboard" })}
            className="btn-primary inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium"
          >
            Explore
          </button>
        </div>
      </section>

      {/* Song list preview card */}
      <div className="relative z-10 mt-14 w-full max-w-3xl space-y-4">
        {["#7C3AED", "#EA580C", "#1D4ED8", "#16A34A"].map((c, i) => (
          <div key={i} className="rounded-xl px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="h-8 w-8 rounded-md" style={{ background: `linear-gradient(135deg, ${c}, rgba(255,255,255,.2))` }} />
              <div>
                <p className="text-sm text-white/90">song title</p>
                <p className="text-xs text-white/50">song details | artist | genre</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/60">
              <span>03:11</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white/60"><path d="M12.001 4.529c2.349-2.327 6.146-2.327 8.495 0 2.349 2.327 2.349 6.099 0 8.426l-7.79 7.713a1 1 0 0 1-1.41 0l-7.79-7.713c-2.349-2.327-2.349-6.099 0-8.426 2.349-2.327 6.146-2.327 8.495 0l.5.496.5-.496z" fill="currentColor"/></svg>
            </div>
          </div>
        ))}
      </div>

      {/* Footer corners */}
      <div className="pointer-events-none select-none w-full">
        <div className="fixed left-6 bottom-6 text-xs text-white/40">©Copyright 2025 Melodine</div>
        <div className="fixed right-6 bottom-6 text-xs text-white/40">All Rights Reserved</div>
      </div>
    </main>
  );
}
