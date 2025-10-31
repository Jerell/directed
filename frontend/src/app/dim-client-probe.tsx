"use client";

import { useMemo } from "react";

import { useDim } from "@/lib/dim/use-dim";

export function DimClientProbe() {
  const expressions = useMemo(() => ["2 m * 300 m as m^2:scientific"], []);
  const { status, results, error } = useDim(expressions);

  if (status === "success") {
    return <ReliesOnResults results={results} />;
  } else if (status === "error") {
    return <DimError error={error} />;
  } else if (status === "loading") {
    return <DimLoading />;
  } else {
    return <DimIdle />;
  }
}

function ReliesOnResults(props: { results: string[] }) {
  const { results } = props;

  console.log("[DimResults] results", results);

  return null;
}
function DimError(props: { error: Error }) {
  const { error } = props;

  console.error("[DimError] error", error);

  return null;
}

function DimLoading() {
  console.log("[DimLoading]");
  return null;
}

function DimIdle() {
  console.log("[DimIdle]");
  return null;
}
