import {
  selectedChildrenCollection,
  selectedGroupsCollection,
  selectedNodesCollection,
} from "@/lib/collections/selected-nodes";
import { useLiveQuery } from "@tanstack/react-db";
import { ArrowDownIcon, ArrowRightIcon } from "lucide-react";
import Link from "next/link";

export function CurrentSelection() {
  const { data: selectedNodes = [] } = useLiveQuery(selectedNodesCollection);
  const { data: selectedChildren = [] } = useLiveQuery(
    selectedChildrenCollection
  );
  const { data: selectedGroups = [] } = useLiveQuery(selectedGroupsCollection);
  const groupSelectionInfo =
    selectedGroups.length > 0
      ? ` (${selectedGroups.length} group${
          selectedGroups.length === 1 ? "" : "s"
        } selected with ${selectedChildren.length} child${
          selectedChildren.length === 1 ? "" : "ren"
        })`
      : "";

  if (selectedNodes.length === 0) {
    return <p className="pr-1 text-white">No nodes selected</p>;
  }

  return (
    <Link
      href="/n/selected"
      className="pr-1 text-white flex flex-row items-center gap-1"
    >
      <p>
        {selectedNodes.length} selected{groupSelectionInfo}{" "}
      </p>
      <ArrowRightIcon className="size-4 max-4xl:hidden inline-block" />
      <ArrowDownIcon className="size-4 inline-block 4xl:hidden" />
    </Link>
  );
}
