import type { Edge, Node } from "@xyflow/react";
import type { ReactNode } from "react";

export type BlockInfo = {
  length: number;
  kind: "source" | "sink" | "transform";
  label: string;
};

export type BranchNodeData = {
  id: string;
  label: string;
  blocks: BlockInfo[];
};

export type BranchNodeType = Node<BranchNodeData, "branchNode">;

export type LabeledGroupNodeData = {
  id: string;
  label: ReactNode;
};

export type LabeledGroupNodeType = Node<
  LabeledGroupNodeData,
  "labeledGroupNode"
>;

export type AppNode = BranchNodeType | LabeledGroupNodeType;

export type AppEdge = Edge<
  {
    weight: number;
  },
  "weightedEdge"
>;

export function isLabeledGroupNode(
  node: AppNode
): node is LabeledGroupNodeType {
  return node.type === "labeledGroupNode";
}

export function isBranchNode(node: AppNode): node is BranchNodeType {
  return node.type === "branchNode";
}
