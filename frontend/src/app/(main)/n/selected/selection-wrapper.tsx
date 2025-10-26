"use client";

import dynamic from "next/dynamic";

const Selection = dynamic(() => import("./selection"), {
  ssr: false,
});

export function SelectionWrapper() {
  return <Selection />;
}
