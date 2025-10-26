"use client";

import dynamic from "next/dynamic";

const FlowNetwork = dynamic(() => import("@/components/flow/flow-network"), {
  ssr: false,
});

export function FlowNetworkWrapper() {
  return <FlowNetwork />;
}
