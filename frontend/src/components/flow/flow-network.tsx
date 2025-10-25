"use client";

import { useCallback, use } from "react";
import { useLiveQuery } from "@tanstack/react-db";
import {
  ReactFlow,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
  type NodeChange,
  type EdgeChange,
  type Connection,
  MiniMap,
  Controls,
  Background,
} from "@xyflow/react";
import { GroupNode } from "../labeled-group-node";
import { BranchNode } from "./branch-node";
import {
  ensureFlowSeeded,
  nodesCollection,
  edgesCollection,
  writeNodesToCollection,
  writeEdgesToCollection,
} from "@/lib/collections/flow";

const nodeTypes = {
  labeledGroupNode: GroupNode,
  branchNode: BranchNode,
};

export default function FlowNetwork() {
  use(ensureFlowSeeded());

  const { data: nodes = [] } = useLiveQuery(nodesCollection);
  const { data: edges = [] } = useLiveQuery(edgesCollection);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const updated = applyNodeChanges(changes, nodes);
      writeNodesToCollection(updated);
    },
    [nodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const updated = applyEdgeChanges(changes, edges);
      writeEdgesToCollection(updated);
    },
    [edges]
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const updated = addEdge(params, edges);
      writeEdgesToCollection(updated);
    },
    [edges]
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
