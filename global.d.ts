// global.d.ts
import type mongooseType from "mongoose";

declare global {
  // For Next.js / Node:
  var mongoose: {
    conn: typeof mongooseType | null;
    promise: Promise<typeof mongooseType> | null;
  };
}

// Ensure this file is a module
export {};