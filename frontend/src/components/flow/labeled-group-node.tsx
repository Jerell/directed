import { forwardRef, type HTMLAttributes } from "react";
import { Panel, type NodeProps, type PanelPosition } from "@xyflow/react";

import { BaseNode } from "@/components/base-node";
import { cn } from "@/lib/utils";

/* GROUP NODE Label ------------------------------------------------------- */

export type GroupNodeLabelProps = HTMLAttributes<HTMLDivElement>;

export const GroupNodeLabel = forwardRef<HTMLDivElement, GroupNodeLabelProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className="h-full w-full" {...props}>
        <div
          className={cn(
            "w-fit bg-secondary px-1 text-xs text-card-foreground",
            className
          )}
        >
          {children}
        </div>
      </div>
    );
  }
);

GroupNodeLabel.displayName = "GroupNodeLabel";

import type { LabeledGroupNodeType } from "@/lib/types/flow-nodes";
import { LabeledGroupContextMenu } from "./contex-menus/labeled-group-context-menu";

export type GroupNodeProps = NodeProps<LabeledGroupNodeType> & {
  position?: PanelPosition;
};

/* GROUP NODE -------------------------------------------------------------- */

export const GroupNode = forwardRef<HTMLDivElement, GroupNodeProps>(
  ({ data, position, selected }, ref) => {
    return (
      <LabeledGroupContextMenu data={data} selected={selected}>
        <BaseNode
          ref={ref}
          className={cn(
            "h-full overflow-hidden bg-opacity-50 p-0 border-secondary",
            selected && "bg-brand-purple-bright/10"
          )}
        >
          <Panel className={cn("m-0 p-0")} position={position}>
            {data.label && <GroupNodeLabel>{data.label}</GroupNodeLabel>}
          </Panel>
        </BaseNode>
      </LabeledGroupContextMenu>
    );
  }
);

GroupNode.displayName = "GroupNode";
