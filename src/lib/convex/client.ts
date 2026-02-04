import { ConvexReactClient } from "convex/react";

let client: ConvexReactClient | null = null;

export function getConvexClient() {
  if (client) {
    return client;
  }

  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    throw new Error(
      "Missing NEXT_PUBLIC_CONVEX_URL. Start Convex dev or set the env var."
    );
  }

  client = new ConvexReactClient(url);
  return client;
}
