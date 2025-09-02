"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React from "react";
import { ToastProvider } from "@/components/ui/Toast";

interface Props {
  children: React.ReactNode;
  session?: Session | null;
}

export default function Providers({ children, session }: Props) {
  return (
    <SessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      <ToastProvider>
        {children}
      </ToastProvider>
    </SessionProvider>
  );
}