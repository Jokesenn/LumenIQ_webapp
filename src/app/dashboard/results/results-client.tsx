"use client";

import dynamic from "next/dynamic";

// Skip SSR to avoid Radix UI hydration mismatches (Select, Accordion generate different IDs)
const ResultsContent = dynamic(
  () => import("./results-content").then((m) => m.ResultsContent),
  { ssr: false }
);

export { ResultsContent };
