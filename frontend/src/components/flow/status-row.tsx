import { nodesCollection } from "@/lib/collections/flow";
import { useLiveQuery } from "@tanstack/react-db";

export function StatusRow() {
  const { data: nodes = [] } = useLiveQuery(nodesCollection);

  const selectedNodes = nodes.filter((node) => node.selected);

  const selectedGroups = selectedNodes.filter(
    (node) => node.type === "labeledGroupNode"
  );

  const selectedChildren = nodes.filter(
    (node) =>
      node.parentId && selectedNodes.map((n) => n.id).includes(node.parentId)
  );

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
