import { ConvexReactClient } from "convex/react";

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL;

if (!convexUrl) {
  throw new Error(
    "NEXT_PUBLIC_CONVEX_URL environment variable is required. " +
    "Please set it in your .env.local file."
  );
}

export const convex = new ConvexReactClient(convexUrl);
