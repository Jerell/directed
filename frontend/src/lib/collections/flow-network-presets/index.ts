import type { Node, Edge } from "@xyflow/react";
import { preset1 } from "./preset1";
import { preset2 } from "./preset2";

export type FlowPreset = {
  id: string;
  label: string;
  nodes: Node[];
  edges: Edge[];
};

export const flowPresets: FlowPreset[] = [preset1, preset2];
