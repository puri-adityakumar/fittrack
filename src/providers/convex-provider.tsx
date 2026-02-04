"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

interface ConvexClientProviderProps {
  children: ReactNode;
}

export function ConvexClientProvider({ children }: ConvexClientProviderProps) {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.warn(
      "Convex URL not configured. Set NEXT_PUBLIC_CONVEX_URL or run bunx convex dev."
    );
    return <>{children}</>;
  }

  const client = new ConvexReactClient(url);
  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
