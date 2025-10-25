"use client";

import { useState, useCallback } from "react";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type Node,
  type Edge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  MiniMap,
  Controls,
  Background,
} from "@xyflow/react";
import { GroupNode } from "../labeled-group-node";
import { BranchNode } from "./branch-node";
import type { BranchNodeType } from "./branch-node";

const nodeTypes = {
  labeledGroupNode: GroupNode,
  branchNode: BranchNode,
};

const initialNodes = [
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
    position: { x: 400, y: 380 },
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
] satisfies (
  | Node<{ label: string; id: string }, "labeledGroupNode">
  | BranchNodeType
)[];
const initialEdges: Edge[] = [
  { id: "n1-n2", source: "n1", target: "n2" },
  { id: "n2-n3", source: "n2", target: "n3" },
  { id: "n4-n2", source: "n4", target: "n2" },
  { id: "n2-n5", source: "n2", target: "n5" },
  { id: "n5-n6", source: "n5", target: "n6" },
];

export default function FlowNetwork() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  return (
    <div className="w-full h-full border border-brand-blue">
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <MiniMap position="bottom-left" />
        <Controls position="top-left" />
        <Background />
      </ReactFlow>
    </div>
  );
}
