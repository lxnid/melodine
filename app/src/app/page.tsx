"use client";

import { signIn } from "next-auth/react";

export default function Home() {
  const triggerTransition = (cb: () => void) => {
    try {
      window.dispatchEvent(new CustomEvent("route:transition"));
    } catch {}
    setTimeout(cb, 500);
  };

  return (
    <main className="min-h-screen relative flex flex-col items-center justify-center overflow-hidden px-6 py-28 sm:py-36 bg-[var(--background)]">
      {/* Glow gradients */}
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 right-0 h-[35vh] sm:h-[40vh] w-[70vw] sm:w-[60vw] rounded-full blur-3xl opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, rgba(168,85,247,.35), transparent)",
          }}
        />
        <div
          className="absolute top-[30%] left-[-10%] h-[30vh] sm:h-[35vh] w-[55vw] sm:w-[45vw] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,92,246,.35), transparent)",
          }}
        />
        {/* Bottom glow to balance gradient at the bottom */}
        <div
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 h-[32vh] sm:h-[36vh] w-[85vw] sm:w-[65vw] rounded-full blur-3xl opacity-40"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,92,246,.28), transparent)",
          }}
        />
        {/* Soft bottom fade into the base background to avoid harsh edge */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[#0f0f23]/80" />
        {/* Bottom glow to balance gradient at the bottom */}
        <div
          className="absolute -bottom-24 left-1/2 -translate-x-1/2 h-[40vh] sm:h-[44vh] w-[90vw] sm:w-[70vw] rounded-full blur-3xl opacity-45"
          style={{
            background:
              "radial-gradient(closest-side, rgba(139,92,246,.30), transparent)",
          }}
        />
        {/* Stronger bottom fade into the base background to avoid harsh edge */}
        <div className="absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-[#0f0f23]/70 to-[#0f0f23]" />
      </div>

      {/* Hero */}
      <section className="relative z-10 text-center max-w-3xl mx-auto">
        <h1 className="text-white text-5xl sm:text-7xl font-extrabold leading-[1.1] tracking-tight mt-8 mb-8 sm:mt-10 sm:mb-12">
          Discover.<span className="text-primary">Play</span>. Repeat.
        </h1>
        <p className="mt-8 sm:mt-8 text-muted text-base sm:text-base leading-relaxed">
          Lose yourself in a world of music, curated just for you. Experience
          the freedom to explore and discover music like never before. Our
          intuitive interface and seamless navigation make it easy to find the
          perfect soundtrack for any occasion.
        </p>
        <div className="mt-10 sm:mt-10">
          <button
            onClick={() =>
              triggerTransition(() =>
                signIn("spotify", { callbackUrl: "/dashboard" })
              )
            }
            className="btn-primary inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base sm:text-sm font-medium"
          >
            Explore
          </button>
        </div>
      </section>

      {/* Song list preview card */}
      <div className="relative z-10 mt-24 sm:mt-28 mb-24 sm:mb-32 w-full max-w-md sm:max-w-3xl space-y-4">
        {["#7C3AED", "#EA580C", "#1D4ED8", "#16A34A"].map((c, i) => (
          <div
            key={i}
            className="rounded-xl px-4 py-3 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-3">
              <span
                className="h-8 w-8 rounded-md"
                style={{
                  background: `linear-gradient(135deg, ${c}, rgba(255,255,255,.2))`,
                }}
              />
              <div>
                <p className="text-sm text-white/90">song title</p>
                <p className="text-xs text-white/50">
                  song details | artist | genre
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-white/60">
              <span>03:11</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-white/60"
              >
                <path
                  d="M12.001 4.529c2.349-2.327 6.146-2.327 8.495 0 2.349 2.327 2.349 6.099 0 8.426l-7.79 7.713a1 1 0 0 1-1.41 0l-7.79-7.713c-2.349-2.327-2.349-6.099 0-8.426 2.349-2.327 6.146-2.327 8.495 0l.5.496.5-.496z"
                  fill="currentColor"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* Footer corners */}
      <div className="pointer-events-none select-none w-full">
        <div className="fixed left-6 bottom-6 text-xs text-white/40">
          ©Copyright 2025 Melodine
        </div>
        <div className="fixed right-6 bottom-6 text-xs text-white/40">
          All Rights Reserved
        </div>
      </div>
    </main>
  );
}
