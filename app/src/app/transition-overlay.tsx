"use client";

import { useEffect, useState } from "react";

export default function TransitionOverlay() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const on = () => {
      setShow(true);
      const t = setTimeout(() => setShow(false), 600);
      return () => clearTimeout(t);
    };
    window.addEventListener("route:transition", on as EventListener);
    return () => window.removeEventListener("route:transition", on as EventListener);
  }, []);

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-[60] transition-opacity duration-500 ease-out ${show ? "opacity-100" : "opacity-0"}`}
      aria-hidden
    >
      {/* Soft brand glow layers */}
      <div className="absolute inset-0" style={{ background: "radial-gradient(closest-side at 30% 70%, rgba(168,85,247,0.25), transparent)" }} />
      <div className="absolute inset-0" style={{ background: "radial-gradient(closest-side at 70% 30%, rgba(99,102,241,0.25), transparent)" }} />
      <div className="absolute inset-0 bg-black/40" />
    </div>
  );
}