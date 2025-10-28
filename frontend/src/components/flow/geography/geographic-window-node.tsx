import { forwardRef, type HTMLAttributes } from "react";
import { Panel, type NodeProps, type PanelPosition } from "@xyflow/react";

import { BaseNode } from "@/components/base-node";
import { cn } from "@/lib/utils";

/* GEOGRAPHIC WINDOW NODE Label ------------------------------------------------------- */

export type GeographicWindowNodeLabelProps = HTMLAttributes<HTMLDivElement>;

export const GeographicWindowNodeLabel = forwardRef<
  HTMLDivElement,
  GeographicWindowNodeLabelProps
>(({ children, className, ...props }, ref) => {
  return (
    <div ref={ref} className="h-full w-full" {...props}>
      <div
        className={cn(
          "w-fit bg-primary px-1 text-xs text-primary-foreground",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
});

GeographicWindowNodeLabel.displayName = "GeographicWindowNodeLabel";

import type { GeographicWindowNodeType } from "@/lib/types/flow-nodes";
import { LabeledGroupContextMenu } from "../contex-menus/labeled-group-context-menu";

export type GeographicWindowNodeProps = NodeProps<GeographicWindowNodeType> & {
  position?: PanelPosition;
};

/* GEOGRAPHIC WINDOW NODE -------------------------------------------------------------- */

export const GeographicWindowNode = forwardRef<
  HTMLDivElement,
  GeographicWindowNodeProps
>(({ data, position, selected }, ref) => {
  return (
    <LabeledGroupContextMenu data={data} selected={selected}>
      <BaseNode
        ref={ref}
        className={cn(
          "h-full overflow-hidden bg-opacity-50 p-0 border-primary -z-10",
          selected && "bg-primary/10"
        )}
      >
        <Panel className={cn("m-0 p-0")} position={position}>
          {data.label && (
            <GeographicWindowNodeLabel>{data.label}</GeographicWindowNodeLabel>
          )}
        </Panel>
      </BaseNode>
    </LabeledGroupContextMenu>
  );
});

GeographicWindowNode.displayName = "GeographicWindowNode";
