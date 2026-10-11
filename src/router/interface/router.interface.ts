export interface Edge {
  node: string;
  cost: number;
}

export interface RoadNode {
  id: string;
  lat: number;
  lon: number;
  neighbors: Edge[];
}

export interface QueueNode {
  id: string;
  f: number;
}

export type RoadGraph = Record<string, RoadNode>;