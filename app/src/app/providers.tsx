"use client";

import { SessionProvider } from "next-auth/react";
import type { Session } from "next-auth";
import React from "react";

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
      {children}
    </SessionProvider>
  );
}