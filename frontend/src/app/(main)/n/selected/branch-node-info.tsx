"use client";
import { edgesCollection } from "@/lib/collections/flow";
import { BlockInfo, BranchNodeData } from "@/lib/types/flow-nodes";
import { eq, useLiveQuery } from "@tanstack/react-db";
import styles from "@/components/flow/flow.module.css";
import { cn } from "@/lib/utils";
import { ModuleBlockSequence } from "@/components/flow/branch-node";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";

function BranchBlockProperties({ block }: { block: BlockInfo }) {
  return (
    <div className="text-xs flex flex-row bg-brand-blue/40 text-primary-foreground">
      <div className="p-4 min-w-36 h-full flex flex-col flex-1 grow">
        <p>{block.label}</p>
        <p>x{block.length}</p>
      </div>
      <div className="flex flex-col w-full border-l border-primary text-primary-foreground">
        <div className="p-4 bg-brand-purple/30 w-full">
          <p>Header</p>
        </div>

        <div className="p-4 bg-brand-purple-bright/50 h-full w-full flex flex-col gap-1">
          <p>Input fields for properties will go here.</p>
          <p>
            I intend to allow properties defined at multiple levels and
            inherited from wider scopes.
          </p>
          <p>Blocks represent modules or cost items.</p>
          <p>
            If a property is not defined for a block, it will be inherited from
            the branch level.
          </p>
          <p>
            Branches will similarly inherit properties from the parent group or
            global level.
          </p>
        </div>
      </div>
    </div>
  );
}

export function BranchNodeInfo({ data }: { data: BranchNodeData }) {
  return (
    <div className={cn("text-sm relative", styles.branchNode)}>
      <div className={cn(styles.corner)} data-position="top-left" />
      <div className={cn(styles.corner)} data-position="top-right" />
      <div className={cn(styles.corner)} data-position="bottom-left" />
      <div className={cn(styles.corner)} data-position="bottom-right" />
      <Inlets data={data} />
      <div className="">
        <div className="p-1">
          <ModuleBlockSequence blocks={data.blocks} />
        </div>

        <h3 className="font-medium text-xl p-1">{data.label}</h3>
        <div className="-m-px">
          {data.blocks.map((block, i) => (
            <BranchBlockProperties key={`${block.label}-${i}`} block={block} />
          ))}
        </div>
      </div>

      <Outlets data={data} />
    </div>
  );

  function Outlets({ data }: { data: BranchNodeData }) {
    const { data: outlets = [] } = useLiveQuery((q) =>
      q
        .from({ edge: edgesCollection })
        .where(({ edge }) => eq(edge.source, data.id))
    );

    if (outlets.length === 0) {
      return null;
    }

    if (outlets.length === 1) {
      return (
        <>
          <Separator className="mb-px bg-primary" />
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

function Inlets({ data }: { data: BranchNodeData }) {
  const { data: inlets = [] } = useLiveQuery((q) =>
    q
      .from({ edge: edgesCollection })
      .where(({ edge }) => eq(edge.target, data.id))
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
