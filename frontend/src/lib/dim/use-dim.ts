import { useEffect, useState } from "react";
import { evalDim } from "./dim";
import { useDimReady } from "./use-dim-ready";

type SuccessResponse = {
  status: "success";
  results: string[];
  error: undefined;
};

type ErrorResponse = {
  status: "error";
  results: undefined;
  error: Error;
};

type IdleResponse = {
  status: "idle";
  results: undefined;
  error: undefined;
};

type LoadingResponse = {
  status: "loading";
  results: undefined;
  error: undefined;
};

type DimResponse =
  | SuccessResponse
  | ErrorResponse
  | IdleResponse
  | LoadingResponse;

export function useDim(expressions: string[]): DimResponse {
  const ready = useDimReady();
  const [status, setStatus] = useState<DimResponse["status"]>(
    ready ? "idle" : "loading"
  );
  const [results, setResults] = useState<string[]>([]);
  const [error, setError] = useState<Error | undefined>(undefined);
  // Use a stable key so changes to array identity alone do not retrigger the effect
  const expressionsKey = JSON.stringify(expressions);
  useEffect(() => {
    if (!ready) return;
    const run = async () => {
      setStatus("loading");
      setResults([]);
      try {
        const newResults: string[] = [];
        // Reconstruct from key to avoid stale closure and avoid depending on array identity
        const exprs: string[] = JSON.parse(expressionsKey);
        for (const expression of exprs) {
          const out = await evalDim(expression);
          newResults.push(out);
        }
        setResults(newResults);
        setStatus("success");
      } catch (error) {
        console.error(error);
        setError(error as Error);
        setStatus("error");
      }
    };
    void run();
  }, [expressionsKey, ready]);

  switch (status) {
    case "success":
      return {
        status: "success",
        results,
        error: undefined,
      } satisfies SuccessResponse;
    case "error":
      return {
        status: "error",
        results: undefined,
        error: error!,
      } satisfies ErrorResponse;
    case "loading":
      return {
        status: "loading",
        results: undefined,
        error: undefined,
      } satisfies LoadingResponse;
    case "idle":
    default:
      return {
        status: "idle",
        results: undefined,
        error: undefined,
      } satisfies IdleResponse;
  }
}
