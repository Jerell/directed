"use client";

import { useEffect, useState } from "react";
import { initDim } from "./dim";

export function useDimReady(): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    initDim()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch(() => {
        // swallow, consumer can handle errors when calling dim
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return ready;
}
