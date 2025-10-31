"use client";

import { useEffect } from "react";
import { initDim, defineConst } from "@/lib/dim/dim";

type DimConstant = { name: string; expr: string };

export default function DimInit(props: { constants?: DimConstant[] }) {
  const { constants } = props;

  useEffect(() => {
    const run = async () => {
      await initDim();
      if (constants && constants.length > 0) {
        for (const c of constants) {
          defineConst(c.name, c.expr);
        }
      }
    };
    void run();
  }, [constants]);

  return null;
}
