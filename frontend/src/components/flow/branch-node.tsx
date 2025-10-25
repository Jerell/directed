import { NodeProps, Node, Position } from "@xyflow/react";
import styles from "./flow.module.css";
import { cn } from "@/lib/utils";
import { BranchHandle } from "./branch-handle";
import { useMemo } from "react";

export type BranchNodeData = {
  id: string;
  label: string;
  blocks: BlockInfo[];
};

export type BranchNodeType = Node<BranchNodeData, "branchNode">;

export function BranchNode({ data }: NodeProps<BranchNodeType>) {
  const countBlocksByKind = useMemo(() => {
    return data.blocks.reduce((acc, block) => {
      acc[block.kind] = (acc[block.kind] || 0) + block.length;
      return acc;
    }, {} as Record<BlockInfo["kind"], number>);
  }, [data.blocks]);
  return (
    <div className={cn(styles.branchNode, "hover:bg-secondary/10")}>
      <div className={cn(styles.corner)} data-position="top-left" />
      <div className={cn(styles.corner)} data-position="top-right" />
      <div className={cn(styles.corner)} data-position="bottom-left" />
      <div className={cn(styles.corner)} data-position="bottom-right" />
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
      <div className="relative flex flex-col p-4">
        <div className="modules">
          <ModuleSequence blocks={data.blocks} />
        </div>
        <div className="info">
          <h3 className="font-medium text-xl">{data.label}</h3>
          <div className="text-xs">
            {Object.entries(countBlocksByKind).map(([kind, count]) => (
              <p key={kind}>
                {kind}: {count}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

type BlockInfo = {
  length: number;
  kind: "source" | "sink" | "transform";
  label: string;
};

function BlockSet({ blocks }: { blocks: BlockInfo }) {
  return (
    <div className="flex flex-col gap-px">
      {Array.from({ length: blocks.length }, (_, index) => (
        <div
          key={index}
          className={cn("h-4 w-4 ", styles.block)}
          data-kind={blocks.kind}
        ></div>
      ))}
      <div className="h-4 w-4 flex items-center justify-center">
        <p className="text-[0.45rem] text-primary-foreground text-center font-bold">
          {blocks.label[0]}
        </p>
      </div>
    </div>
  );
}

function ModuleSequence({ blocks }: { blocks: BlockInfo[] }) {
  return (
    <div className="flex flex-row gap-px items-end">
      {blocks.map((block, i) => (
        <BlockSet key={`${i}-${block.label}`} blocks={block} />
      ))}
    </div>
  );
}
