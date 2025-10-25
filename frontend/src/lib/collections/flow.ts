"use client";

import { createCollection, localStorageCollectionOptions } from "@tanstack/db";
import type { Node, Edge } from "@xyflow/react";

export const nodesCollection = createCollection(
  localStorageCollectionOptions<Node>({
    id: "flow:nodes",
    storageKey: "flow:nodes",
    getKey: (node) => node.id,
  })
);

export const edgesCollection = createCollection(
  localStorageCollectionOptions<Edge>({
    id: "flow:edges",
    storageKey: "flow:edges",
    getKey: (edge) => edge.id,
  })
);

export async function seedFlowCollections(
  initialNodes: Node[],
  initialEdges: Edge[]
) {
  // Ensure sync starts before we inspect size
  await Promise.all([nodesCollection.preload(), edgesCollection.preload()]);

  const isEmpty = nodesCollection.size === 0 && edgesCollection.size === 0;
  if (!isEmpty) return;

  const nodeTx = nodesCollection.insert(initialNodes);
  const edgeTx = edgesCollection.insert(initialEdges);

  await Promise.all([nodeTx.isPersisted.promise, edgeTx.isPersisted.promise]);
}

export function clearFlowCollections() {
  nodesCollection.utils.clearStorage();
  edgesCollection.utils.clearStorage();
}

// ---------------------------------------------------------------------------
// Initial data and helpers
// ---------------------------------------------------------------------------

export const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 0, y: 0 },
    data: {
      label: "Labelled Group",
      id: "1",
    },
    width: 700,
    height: 300,
    type: "labeledGroupNode",
  },
  {
    id: "n1",
    position: { x: 20, y: 30 },
    data: {
      id: "branch1",
      label: "Branch 1",
      blocks: [
        { length: 1, kind: "source", label: "Source" },
        { length: 4, kind: "transform", label: "Capture Unit" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 2, kind: "transform", label: "Compressor" },
        { length: 1, kind: "transform", label: "Pipe" },
      ],
    },
    parentId: "1",
    extent: "parent",
    type: "branchNode",
  },
  {
    id: "n2",
    position: { x: 400, y: 100 },
    data: {
      id: "branch2",
      label: "Branch 2",
      blocks: [
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 2, kind: "transform", label: "Compressor" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
      ],
    },
    parentId: "1",
    extent: "parent",
    type: "branchNode",
  },
  {
    id: "n3",
    position: { x: 800, y: 150 },
    data: {
      id: "branch3",
      label: "Branch 3",
      blocks: [
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "sink", label: "Sink" },
      ],
    },
    type: "branchNode",
  },
  {
    id: "n4",
    position: { x: -100, y: 350 },
    data: {
      id: "branch4",
      label: "Branch 4",
      blocks: [
        { length: 1, kind: "source", label: "Source" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
      ],
    },
    type: "branchNode",
  },
  {
    id: "n5",
    position: { x: 800, y: 320 },
    data: {
      id: "branch5",
      label: "Branch 5",
      blocks: [
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
      ],
    },
    type: "branchNode",
  },
  {
    id: "n6",
    position: { x: 1200, y: 320 },
    data: {
      id: "branch6",
      label: "Branch 6",
      blocks: [
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "sink", label: "Sink" },
      ],
    },
    type: "branchNode",
  },
  {
    id: "n7",
    position: { x: 300, y: 380 },
    data: {
      id: "branch7",
      label: "Branch 7",
      blocks: [
        { length: 1, kind: "source", label: "Source" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "sink", label: "Sink" },
      ],
    },
    type: "branchNode",
  },
  {
    id: "n8",
    position: { x: 500, y: 380 },
    data: {
      id: "branch8",
      label: "Branch 8",
      blocks: [
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
        { length: 1, kind: "transform", label: "Pipe" },
      ],
    },
    type: "branchNode",
  },
  {
    id: "n9",
    position: { x: 1000, y: 80 },
    data: {
      id: "branch9",
      label: "Branch 9",
      blocks: [],
    },
    type: "branchNode",
  },
];

export const initialEdges: Edge[] = [
  { id: "n1-n2", source: "n1", target: "n2" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n4-n2", source: "n4", target: "n2" },
  { id: "n2-n5", source: "n2", target: "n5" },
  { id: "n5-n6", source: "n5", target: "n6" },
  { id: "n8-n5", source: "n8", target: "n5" },
];

let seedPromise: Promise<void> | null = null;

export function ensureFlowSeeded(): Promise<void> {
  if (!seedPromise) {
    seedPromise = seedFlowCollections(initialNodes, initialEdges);
  }
  return seedPromise;
}

export async function resetFlowCollectionsToInitial(): Promise<void> {
  // Ensure collections are syncing
  await Promise.all([nodesCollection.preload(), edgesCollection.preload()]);

  // Delete current data via mutations so subscribers update immediately
  const edgeKeys = Array.from(edgesCollection.keys()) as string[];
  if (edgeKeys.length) {
    const delTx = edgesCollection.delete(edgeKeys);
    await delTx.isPersisted.promise;
  }

  const nodeKeys = Array.from(nodesCollection.keys()) as string[];
  if (nodeKeys.length) {
    const delTx = nodesCollection.delete(nodeKeys);
    await delTx.isPersisted.promise;
  }

  // Reinsert initial data
  const insNodesTx = nodesCollection.insert(initialNodes);
  const insEdgesTx = edgesCollection.insert(initialEdges);
  await Promise.all([
    insNodesTx.isPersisted.promise,
    insEdgesTx.isPersisted.promise,
  ]);
}

// ---------------------------------------------------------------------------
// Write helpers for ReactFlow integration
// ---------------------------------------------------------------------------

export function writeNodesToCollection(updated: Node[]): void {
  const prevKeys = new Set<string>(
    Array.from(nodesCollection.keys()) as string[]
  );
  const updatedKeys = new Set<string>(updated.map((n) => n.id));

  const toDelete: string[] = [];
  prevKeys.forEach((k) => {
    if (!updatedKeys.has(k)) toDelete.push(k);
  });
  if (toDelete.length) nodesCollection.delete(toDelete);

  updated.forEach((node) => {
    if (nodesCollection.has(node.id)) {
      nodesCollection.update(node.id, (draft) => {
        Object.assign(draft, node);
      });
    } else {
      nodesCollection.insert(node);
    }
  });
}

export function writeEdgesToCollection(updated: Edge[]): void {
  const prevKeys = new Set<string>(
    Array.from(edgesCollection.keys()) as string[]
  );
  const updatedKeys = new Set<string>(updated.map((e) => e.id));

  const toDelete: string[] = [];
  prevKeys.forEach((k) => {
    if (!updatedKeys.has(k)) toDelete.push(k);
  });
  if (toDelete.length) edgesCollection.delete(toDelete);

  updated.forEach((edge) => {
    if (edgesCollection.has(edge.id)) {
      edgesCollection.update(edge.id, (draft) => {
        Object.assign(draft, edge);
      });
    } else {
      edgesCollection.insert(edge);
    }
  });
}
