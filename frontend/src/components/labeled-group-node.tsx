import React, { forwardRef, type HTMLAttributes, type ReactNode } from "react";
import {
  Panel,
  type NodeProps,
  type PanelPosition,
  type Node,
} from "@xyflow/react";

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

type LabeledGroupNode = Node<{ label: ReactNode }, "labeledGroupNode">;

export type GroupNodeProps = NodeProps<LabeledGroupNode> & {
  position?: PanelPosition;
};

/* GROUP NODE -------------------------------------------------------------- */

export const GroupNode = forwardRef<HTMLDivElement, GroupNodeProps>(
  ({ data, position }, ref) => {
    // const getLabelClassName = (position?: PanelPosition) => {
    //   switch (position) {
    //     case "top-left":
    //       return "rounded-br-sm";
    //     case "top-center":
    //       return "rounded-b-sm";
    //     case "top-right":
    //       return "rounded-bl-sm";
    //     case "bottom-left":
    //       return "rounded-tr-sm";
    //     case "bottom-right":
    //       return "rounded-tl-sm";
    //     case "bottom-center":
    //       return "rounded-t-sm";
    //     default:
    //       return "rounded-br-sm";
    //   }
    // };

    return (
      <BaseNode
        ref={ref}
        className="h-full overflow-hidden bg-opacity-50 p-0 border-secondary"
      >
        <Panel className={cn("m-0 p-0")} position={position}>
          {data.label && <GroupNodeLabel>{data.label}</GroupNodeLabel>}
        </Panel>
      </BaseNode>
    );
  }
);

GroupNode.displayName = "GroupNode";
