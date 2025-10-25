"use client";

import { useState, useCallback, memo } from "react";
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

const LabeledGroupNodeDemo = memo(() => <GroupNode label="Label" />);
LabeledGroupNodeDemo.displayName = "LabeledGroupNodeDemo";

const nodeTypes = {
  labeledGroupNode: LabeledGroupNodeDemo,
  branchNode: BranchNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    position: { x: 200, y: 200 },
    data: { label: "Group Node" },
    width: 380,
    height: 200,
    type: "labeledGroupNode",
  },
  {
    id: "n1",
    position: { x: 20, y: 30 },
    data: { id: "branch1", label: "Node 1" },
    parentId: "1",
    extent: "parent",
    type: "branchNode",
  },
  {
    id: "n2",
    position: { x: 200, y: 125 },
    data: { id: "branch2", label: "Node 2" },
    parentId: "1",
    extent: "parent",
    type: "branchNode",
  },
];
const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }];

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
