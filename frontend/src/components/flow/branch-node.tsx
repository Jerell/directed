import { NodeProps, Node, Position } from "@xyflow/react";
import styles from "./flow.module.css";
import { cn } from "@/lib/utils";
import { BranchHandle } from "./branch-handle";

type BranchNodeData = {
  id: string;
  label: string;
};

export type BranchNode = Node<BranchNodeData, "branch">;

export function BranchNode({ data }: NodeProps<BranchNode>) {
  return (
    <div className={cn(styles.branchNode)}>
      <div className={cn(styles.corner)} data-position="top-left" />
      <div className={cn(styles.corner)} data-position="top-right" />
      <div className={cn(styles.corner)} data-position="bottom-left" />
      <div className={cn(styles.corner)} data-position="bottom-right" />
      <div className="relative flex flex-col p-4">{data.label}</div>
      <BranchHandle
        type="target"
        position={Position.Left}
        data-position={Position.Left}
        data-handle-point-direction="right"
      />
      <BranchHandle
        type="source"
        position={Position.Right}
        data-position={Position.Right}
        data-handle-point-direction="right"
      />
      <BranchHandle
        type="source"
        position={Position.Bottom}
        data-position={Position.Bottom}
        data-handle-point-direction="down"
      />
      <BranchHandle
        type="source"
        position={Position.Top}
        data-position={Position.Top}
        data-handle-point-direction="down"
      />
    </div>
  );
}
