"use client";
import {
  selectedBranchesCollection,
  selectedGroupsCollection,
  selectedNodesCollection,
} from "@/lib/collections/selected-nodes";
import { useLiveQuery } from "@tanstack/react-db";
import { BranchNodeInfo } from "./branch-node-info";
import { GroupNodeInfo } from "./group-node.info";
import { isLabeledGroupNode } from "@/lib/types/flow-nodes";

export default function Selection() {
  const { data: selectedNodes = [] } = useLiveQuery(selectedNodesCollection);

  if (selectedNodes.length === 0) {
    return (
      <div className="flex flex-col h-full w-full items-center justify-center text-primary">
        <p className="">No nodes selected</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-px">
      <SelectedGroups />
      <SelectedBranches />
    </div>
  );
}

function SelectedGroups() {
  const { data: selectedGroups = [] } = useLiveQuery(selectedGroupsCollection);

  return (
    <div className="flex flex-col gap-px">
      {selectedGroups.map((group) => {
        if (isLabeledGroupNode(group)) {
          return <GroupNodeInfo key={group.id} data={group.data} />;
        }
        return null;
      })}
    </div>
  );
}

function SelectedBranches() {
  const { data: selectedBranches = [] } = useLiveQuery(
    selectedBranchesCollection
  );
  return (
    <div className="flex flex-col gap-px">
      {selectedBranches.map((branch) => (
        <BranchNodeInfo key={branch.id} data={branch.data} />
      ))}
    </div>
  );
}
