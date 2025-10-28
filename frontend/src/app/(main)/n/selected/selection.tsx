"use client";
import {
  edgesCollection,
  findEdgesBySource,
  findEdgesByTarget,
  nodesCollection,
} from "@/lib/collections/flow";
import {
  selectedBranchesCollection,
  selectedGroupsCollection,
  selectedNodesCollection,
} from "@/lib/collections/selected-nodes";
import { isBranchNode } from "@/lib/types/flow-nodes";
import { eq, useLiveQuery } from "@tanstack/react-db";
import styles from "@/components/flow/flow.module.css";
import { cn } from "@/lib/utils";
import { ModuleBlockSequence } from "@/components/flow/branch-node";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

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

function SelectedGroups() {
  const { data: selectedGroups = [] } = useLiveQuery(selectedGroupsCollection);

  return (
    <div className="flex flex-col gap-px">
      {selectedGroups.map((group) => (
        <GroupNodeInfo key={group.id} nodeId={group.id} />
      ))}
    </div>
  );
}

function BranchNodeInfo({ nodeId }: { nodeId: string }) {
  const { data: branch, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ node: nodesCollection })
        .where(({ node }) => eq(node.id, nodeId))
        .findOne(),
    [nodeId]
  );

  if (isLoading) {
    return <div className="px-1 text-sm">Loading...</div>;
  }

  if (!branch || !isBranchNode(branch)) {
    return <div className="px-1 text-sm">Branch not found</div>;
  }

  return (
    <div className={cn("text-sm relative", styles.branchNode)}>
      <div className={cn(styles.corner)} data-position="top-left" />
      <div className={cn(styles.corner)} data-position="top-right" />
      <div className={cn(styles.corner)} data-position="bottom-left" />
      <div className={cn(styles.corner)} data-position="bottom-right" />
      <div className="p-1">
        <ModuleBlockSequence blocks={branch.data.blocks} />
        <h3 className="font-medium text-xl">{branch.data.label}</h3>
        <div className="text-xs">
          {branch.data.blocks
            .map((block) => {
              if (block.length === 1) {
                return block.label;
              }
              return `${block.label} (x${block.length})`;
            })
            .join(", ")}
        </div>
      </div>

      <Inlets nodeId={nodeId} />
      <Outlets nodeId={nodeId} />
    </div>
  );

  function Outlets({ nodeId }: { nodeId: string }) {
    const { data: outlets = [] } = useLiveQuery((q) =>
      q
        .from({ edge: edgesCollection })
        .where(({ edge }) => eq(edge.source, nodeId))
    );

    console.log(nodeId, { outlets });

    if (outlets.length === 0) {
      return null;
    }

    if (outlets.length === 1) {
      return (
        <>
          <Separator className="my-px bg-primary" />
          <h6 className="text-xs px-1 text-primary-foreground">Outlet</h6>
          <Separator className="my-px bg-primary" />
          <div className="w-full overflow-x-auto p-px">
            <div className="flex flex-row gap-px">
              <Button
                key={outlets[0].id}
                variant="link"
                className="text-sm p-1"
              >
                {outlets[0].target}
              </Button>
            </div>
          </div>
        </>
      );
    }

    return (
      <>
        <Separator className="my-px bg-primary" />
        <p className="text-xs px-1 text-primary-foreground">
          Outlets: define split ratio
        </p>
        <Separator className="my-px bg-primary" />
        <div className="w-full overflow-x-auto p-px">
          <div className="flex flex-row gap-px">
            {outlets.map((outlet) => (
              <Button
                key={outlet.id}
                variant="ghost"
                className="text-sm p-1 gap-0"
              >
                {outlet.data?.weight ?? 1}
                <ArrowRightIcon />
                {outlet.target}
              </Button>
            ))}
          </div>
        </div>
      </>
    );
  }
}

function Inlets({ nodeId }: { nodeId: string }) {
  const { data: inlets = [] } = useLiveQuery((q) =>
    q
      .from({ edge: edgesCollection })
      .where(({ edge }) => eq(edge.target, nodeId))
  );

  if (inlets.length === 0) {
    return null;
  }

  if (inlets.length === 1) {
    return (
      <>
        <Separator className="my-px bg-primary" />
        <h6 className="text-xs px-1 text-primary-foreground">Inlet</h6>
        <Separator className="my-px bg-primary" />
        <div className="w-full overflow-x-auto p-px">
          <div className="flex flex-row gap-px">
            <Button key={inlets[0].id} variant="link" className="text-sm p-1">
              {inlets[0].source}
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Separator className="my-px bg-primary" />
      <h6 className="text-xs px-1 text-primary-foreground">Inlets: Multiple</h6>
      <Separator className="my-px bg-primary" />
      <div className="w-full overflow-x-auto p-px">
        <div className="flex flex-row gap-px">
          {inlets.map((inlet) => (
            <Button key={inlet.id} variant="link" className="text-sm p-1">
              {inlet.source}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}

function SelectedBranches() {
  const { data: selectedBranches = [] } = useLiveQuery(
    selectedBranchesCollection
  );
  return (
    <div className="flex flex-col gap-px">
      {selectedBranches.map((branch) => (
        <BranchNodeInfo key={branch.id} nodeId={branch.id} />
      ))}
    </div>
  );
}
