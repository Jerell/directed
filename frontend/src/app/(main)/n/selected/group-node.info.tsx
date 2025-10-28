"use client";
import { nodesCollection } from "@/lib/collections/flow";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { BranchNodeInfo } from "./branch-node-info";
import { isBranchNode, LabeledGroupNodeData } from "@/lib/types/flow-nodes";

export function GroupNodeInfo({ data }: { data: LabeledGroupNodeData }) {
  const { data: children = [] } = useLiveQuery((q) =>
    q
      .from({ child: nodesCollection })
      .innerJoin({ parent: nodesCollection }, ({ child, parent }) =>
        eq(child.parentId, parent.id)
      )
      .where(({ parent }) => eq(parent.id, data.id))
  );

  return (
    <div className="text-sm border border-secondary">
      <div className="bg-secondary px-1 text-secondary-foreground">
        {data.label}
      </div>
      <div className="p-px">
        <div className="flex flex-col gap-px">
          {children.map(({ child }) => {
            if (isBranchNode(child)) {
              return <BranchNodeInfo key={child.id} data={child.data} />;
            }
            return null;
          })}
        </div>
      </div>
    </div>
  );
}
