import { Injectable } from '@nestjs/common';
import { Coordinate } from '../common/interface/coordinate.interface.js';
import { haversine } from '../common/utils/haversine.js';
import fetchData from '../common/data/fetchdata.js';
import TinyQueue from 'tinyqueue';
import { QueueNode, RoadGraph } from './interface/router.interface.js';

@Injectable()
export class RouterService {
  async initializeGraph() {
    const data = await fetchData();
    let graph = this.createGraph(data);
    console.log('initializeGraph...');
    return graph;
  }

  createGraph(data: any) {
    const graph: Record<string, any> = {};
    const roads = [];
    for (const element of data.elements) {
      if (element.type === 'node') {
        const id: string = String(element.id);
        graph[id] = {
          id: id,
          lat: Number(element.lat),
          lon: Number(element.lon),
          neighbors: [],
        };
      }
      if (element.type === 'way') {
        roads.push(element);
      }
    }

    for (const road of roads) {
      for (let i = 0; i <= road.nodes.length; i++) {
        const from = String(road.nodes[i]);
        const to = String(road.nodes[i + 1]);

        if (!graph[from] || !graph[to]) continue;

        const cost = haversine(graph[from], graph[to]);

        graph[from].neighbors.push({ node: to, cost: cost });
        graph[to].neighbors.push({ node: from, cost: cost });
      }
    }

    return graph;
  }

  findNearstRodeNode(graph: any, location: Coordinate) {
    let nearest: string | null = null;
    let shortest = Infinity;

    for (const id in graph) {
      const node = graph[id];

      // Ignore isolated nodes
      if (!node.neighbors || node.neighbors.length === 0) continue;

      // Pass targetLon instead of location.lon
      const distance = haversine(graph[id], location);

      if (distance < shortest) {
        shortest = distance;
        nearest = id;
      }
    }

    return nearest;
  }

  astar(graph: RoadGraph, start: string, goal: string): string[] | null {
    start = String(start);
    goal = String(goal);

    if (!graph[start] || !graph[goal]) {
      return null;
    }

    const queue = new TinyQueue<QueueNode>(
      [],
      (a, b) => a.f - b.f,
    );

    const gScore: Record<string, number> = {};
    const parent: Record<string, string | null> = {};

    gScore[start] = 0;
    parent[start] = null;

    queue.push({
      id: start,
      f: haversine(graph[start], graph[goal]),
    });

    while (queue.length > 0) {
      const current = queue.pop();

      if (!current) {
        break;
      }

      const currentId = current.id;

      if (currentId === goal) {
        return this.createPath(parent, currentId);
      }

      const currentG = gScore[currentId];
      const currentNode = graph[currentId];

      if (!currentNode || !currentNode.neighbors) {
        continue;
      }

      for (const edge of currentNode.neighbors) {
        const neighborId = String(edge.node);

        if (!graph[neighborId]) {
          continue;
        }

        const newG = currentG + edge.cost;

        if (
          gScore[neighborId] === undefined ||
          newG < gScore[neighborId]
        ) {
          gScore[neighborId] = newG;
          parent[neighborId] = currentId;

          const h = haversine(
            graph[neighborId],
            graph[goal],
          );

          queue.push({
            id: neighborId,
            f: newG + h,
          });
        }
      }
    }

    return null;
  }

  private createPath(
    parent: Record<string, string | null>,
    node: string,
  ): string[] {
    const path: string[] = [];
    let current: string | null = node;

    while (current !== null) {
      path.push(current);
      current = parent[current];
    }

    return path.reverse();
  }
  
}
