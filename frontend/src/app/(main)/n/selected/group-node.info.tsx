"use client";
import { nodesCollection } from "@/lib/collections/flow";
import { eq, useLiveQuery } from "@tanstack/react-db";
import { BranchNodeInfo } from "./branch-node-info";

export function GroupNodeInfo({ nodeId }: { nodeId: string }) {
  const { data: group, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ node: nodesCollection })
        .where(({ node }) => eq(node.id, nodeId))
        .findOne(),
    [nodeId]
  );

  const { data: children = [] } = useLiveQuery((q) =>
    q
      .from({ child: nodesCollection })
      .innerJoin({ parent: nodesCollection }, ({ child, parent }) =>
        eq(child.parentId, parent.id)
      )
      .where(({ parent }) => eq(parent.id, nodeId))
  );

  if (isLoading) {
    return <div className="px-1 text-sm">Loading...</div>;
  }

  if (!group) {
    return <div className="px-1 text-sm">Group not found</div>;
  }

  return (
    <div className="text-sm border border-secondary">
      <div className="bg-secondary px-1 text-secondary-foreground">
        {group.data.label}
      </div>
      <div className="p-px">
        <div className="flex flex-col gap-px">
          {children.map(({ child }) => (
            <BranchNodeInfo key={child.id} nodeId={child.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
