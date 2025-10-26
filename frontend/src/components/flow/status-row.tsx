import {
  selectedChildrenCollection,
  selectedGroupsCollection,
  selectedNodesCollection,
} from "@/lib/collections/selected-nodes";
import { useLiveQuery } from "@tanstack/react-db";

export function StatusRow() {
  const { data: selectedNodes = [] } = useLiveQuery(selectedNodesCollection);
  const { data: selectedChildren = [] } = useLiveQuery(
    selectedChildrenCollection
  );
  const { data: selectedGroups = [] } = useLiveQuery(selectedGroupsCollection);
  const groupSelectionInfo =
    selectedGroups.length > 0
      ? ` (${selectedGroups.length} groups selected with ${selectedChildren.length} children)`
      : "";

  return (
    <div className="flex flex-row gap-1 p-px text-foreground items-end">
      <p className="pr-1 text-white">
        {selectedNodes.length} selected{groupSelectionInfo}
      </p>
    </div>
  );
}
