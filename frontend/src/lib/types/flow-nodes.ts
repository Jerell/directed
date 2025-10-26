import type { Node } from "@xyflow/react";
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
