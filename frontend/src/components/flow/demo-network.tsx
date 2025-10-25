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

const LabeledGroupNodeDemo = memo(() => <GroupNode label="Label" />);
LabeledGroupNodeDemo.displayName = "LabeledGroupNodeDemo";

const nodeTypes = {
  labeledGroupNode: LabeledGroupNodeDemo,
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
    position: { x: 200, y: 50 },
    data: { label: "Node 1" },
    type: "default",
    parentId: "1",
    extent: "parent",
  },
  {
    id: "n2",
    position: { x: 50, y: 100 },
    data: { label: "Node 2" },
    type: "default",
    parentId: "1",
    extent: "parent",
  },
];
const initialEdges: Edge[] = [{ id: "n1-n2", source: "n1", target: "n2" }];

export default function App() {
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
        <MiniMap position="top-right" />
        <Controls position="bottom-right" />
        <Background />
      </ReactFlow>
    </div>
  );
}
