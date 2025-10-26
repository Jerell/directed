import { NodeProps, Position } from "@xyflow/react";
import styles from "./flow.module.css";
import { cn } from "@/lib/utils";
import { BranchHandle } from "./branch-handle";
import { useMemo } from "react";

import type { BlockInfo, BranchNodeType } from "@/lib/types/flow-nodes";

export function BranchNode({ data, selected }: NodeProps<BranchNodeType>) {
  const countBlocksByKind = useMemo(() => {
    return data.blocks.reduce((acc, block) => {
      acc[block.kind] = (acc[block.kind] || 0) + block.length;
      return acc;
    }, {} as Record<BlockInfo["kind"], number>);
  }, [data.blocks]);

  const containsSource = useMemo(() => {
    return data.blocks.some((block) => block.kind === "source");
  }, [data.blocks]);
  const containsSink = useMemo(() => {
    return data.blocks.some((block) => block.kind === "sink");
  }, [data.blocks]);

  return (
    <div
      className={cn(
        styles.branchNode,
        "hover:bg-secondary/10",
        "focus-within:bg-secondary/10",
        selected && "bg-brand-purple-bright/10"
      )}
    >
      <div className={cn(styles.corner)} data-position="top-left" />
      <div className={cn(styles.corner)} data-position="top-right" />
      <div className={cn(styles.corner)} data-position="bottom-left" />
      <div className={cn(styles.corner)} data-position="bottom-right" />
      {!containsSource && (
        <BranchHandle
          type="target"
          position={Position.Left}
          data-position={Position.Left}
          data-handle-point-direction="right"
        />
      )}
      {!containsSink && (
        <BranchHandle
          type="source"
          position={Position.Right}
          data-position={Position.Right}
          data-handle-point-direction="right"
        />
      )}
      <div className="relative flex flex-col p-4">
        <div className="modules">
          <ModuleBlockSequence blocks={data.blocks} />
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

// BlockInfo is imported from shared types

function InsertButton({
  kind,
  position,
}: {
  kind: BlockInfo["kind"];
  position: "before" | "after";
}) {
  if (kind === "source" && position === "before") {
    return null;
  }
  if (kind === "sink" && position === "after") {
    return null;
  }
  return (
    <button
      className={cn(
        position === "before" && "top-0 left-0",
        position === "after" && "bottom-0 right-0",
        "absolute h-full w-1/4 bg-primary group-hover:block hidden opacity-0 hover:opacity-100 cursor-pointer"
      )}
    ></button>
  );
}

function BottomBlock({ kind }: { kind: BlockInfo["kind"] }) {
  return (
    <div className="relative h-4 w-4 group">
      <InsertButton kind={kind} position="before" />
      <div className={cn("h-4 w-4 ", styles.block)} data-kind={kind}></div>
      <InsertButton kind={kind} position="after" />
    </div>
  );
}

function BlockSet({ blocks }: { blocks: BlockInfo }) {
  return (
    <div className="flex flex-col gap-px">
      {Array.from({ length: blocks.length - 1 }, (_, index) => (
        <div
          key={index}
          className={cn("h-4 w-4 ", styles.block)}
          data-kind={blocks.kind}
        ></div>
      ))}
      <BottomBlock kind={blocks.kind} />
      <div className="h-4 w-4 flex items-center justify-center">
        <p className="text-[0.45rem] text-primary-foreground text-center font-bold">
          {blocks.label[0]}
        </p>
      </div>
    </div>
  );
}

export function ModuleBlockSequence({ blocks }: { blocks: BlockInfo[] }) {
  const canExtend = useMemo(() => {
    return !blocks.some((block) => block.kind === "sink");
  }, [blocks]);
  return (
    <div className="flex flex-row gap-px items-end">
      {blocks.map((block, i) => (
        <BlockSet key={`${i}-${block.label}`} blocks={block} />
      ))}
      {canExtend && (
        <div className="flex flex-col gap-px">
          <button className={cn("h-4 w-4", styles.block)} data-kind="extend">
            +
          </button>
          <div className="h-4 w-4 flex items-center justify-center"></div>
        </div>
      )}
    </div>
  );
}
