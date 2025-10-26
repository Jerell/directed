"use client";
import {
  selectedBranchesCollection,
  selectedChildrenCollection,
  selectedGroupsCollection,
  selectedNodesCollection,
} from "@/lib/collections/selected-nodes";
import { useLiveQuery } from "@tanstack/react-db";

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

function SelectedGroups() {
  const { data: selectedGroups = [] } = useLiveQuery(selectedGroupsCollection);
  const { data: selectedChildren = [] } = useLiveQuery(
    selectedChildrenCollection
  );
  return (
    <div>
      <p className="px-1">{selectedGroups.length} selected Groups</p>
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
