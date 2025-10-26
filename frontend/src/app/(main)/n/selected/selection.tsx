"use client";
import { nodesCollection } from "@/lib/collections/flow";
import {
  selectedBranchesCollection,
  selectedGroupsCollection,
  selectedNodesCollection,
} from "@/lib/collections/selected-nodes";
import { eq, useLiveQuery } from "@tanstack/react-db";

export function Selection() {
  const { data: selectedNodes = [] } = useLiveQuery(selectedNodesCollection);

  if (selectedNodes.length === 0) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center text-primary">
        <p className="">No nodes selected</p>
      </div>
    );
  }

  return (
    <>
      <SelectedGroups />
      <SelectedBranches />
    </>
  );
}

function GroupNodeInfo({ nodeId }: { nodeId: string }) {
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

  const childCount = children.length;

  if (isLoading) {
    return <div className="px-1 text-sm">Loading...</div>;
  }

  if (!group) {
    return <div className="px-1 text-sm">Group not found</div>;
  }

  return (
    <div className="px-1 text-sm">
      <span className="text-muted-foreground">Group:</span> {group.data.label}
      <span className="text-muted-foreground">Children:</span> {childCount}
    </div>
  );
}

function SelectedGroups() {
  const { data: selectedGroups = [] } = useLiveQuery(selectedGroupsCollection);

  return (
    <div>
      <p className="px-1">{selectedGroups.length} selected Groups</p>
      {selectedGroups.map((group) => (
        <GroupNodeInfo key={group.id} nodeId={group.id} />
      ))}
    </div>
  );
}

function SelectedBranches() {
  const { data: selectedBranches = [] } = useLiveQuery(
    selectedBranchesCollection
  );
  return (
    <div>
      <p className="px-1">{selectedBranches.length} selected Branches</p>
    </div>
  );
}
