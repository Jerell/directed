"use client";

import { useEffect } from "react";
import { initDim, evalDim } from "../lib/dim/dim";

export function DimClientProbe() {
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        await initDim();
        const out = evalDim("2 m * 3 m");
        if (!cancelled) {
          // Client-side demonstration log
          console.log("[DimClient] 2 m * 3 m =", out);
        }
      } catch (e) {
        console.error("[DimClient] dim init/eval failed", e);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}
