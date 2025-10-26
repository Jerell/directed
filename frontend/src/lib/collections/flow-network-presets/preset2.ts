import type { AppNode } from "@/lib/types/flow-nodes";
import type { Edge } from "@xyflow/react";

export const preset2 = {
  id: "preset-2",
  label: "Preset 2",
  nodes: [
    {
      id: "1",
      position: { x: 0, y: 0 },
      data: { label: "Group B", id: "1" },
      width: 700,
      height: 300,
      type: "labeledGroupNode",
    },
    {
      id: "n4",
      position: { x: -100, y: 350 },
      data: {
        id: "branch4",
        label: "Branch 4",
        blocks: [
          { length: 1, kind: "source", label: "Source" },
          { length: 1, kind: "transform", label: "Pipe" },
          { length: 1, kind: "transform", label: "Pipe" },
          { length: 1, kind: "transform", label: "Pipe" },
          { length: 1, kind: "transform", label: "Pipe" },
          { length: 1, kind: "transform", label: "Pipe" },
          { length: 1, kind: "transform", label: "Pipe" },
        ],
      },
      type: "branchNode",
    },
  ] satisfies AppNode[],
  edges: [{ id: "n4-1", source: "n4", target: "1" }] satisfies Edge[],
};
