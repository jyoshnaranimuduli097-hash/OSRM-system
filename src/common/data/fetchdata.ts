import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

interface OSMNode {
  id: number;
  lat: number;
  lon: number;
}

interface OSMNodeItem {
  type: 'node';
  id: number;
  lat: number;
  lon: number;
}

interface OSMWayItem {
  type: 'way';
  id: number;
  refs?: number[];
  tags?: Record<string, string>;
}

type OSMItem = OSMNodeItem | OSMWayItem;

interface OSMElement {
  type: 'node' | 'way';
  id: number | string;
  lat?: number;
  lon?: number;
  nodes?: number[];
  geometry?: Array<{
    lat: number;
    lon: number;
  }>;
  tags?: Record<string, string>;
}

interface OSMData {
  elements: OSMElement[];
}

const fetchData = async (): Promise<OSMData> => {
const currentFile = fileURLToPath(import.meta.url);
const currentDir = path.dirname(currentFile);

// Works when executing from dist/common/data
const projectRoot = path.resolve(currentDir, '../../..');

const pbfPath = path.join(
  projectRoot,
  'src',
  'common',
  'data',
  'eastern-zone-261009.osm.pbf',
);

const jsonPath = path.join(
  projectRoot,
  'src',
  'common',
  'data',
  'osm-data.json',
);

console.log('Project root:', projectRoot);
console.log('PBF path:', pbfPath);
console.log('PBF exists:', fs.existsSync(pbfPath));
  // Whole Bhubaneswar approximate bounding box
  const south = 20.15;
  const west = 85.74;
  const north = 20.38;
  const east = 85.91;

  if (!fs.existsSync(pbfPath)) {
    throw new Error(`PBF file not found: ${pbfPath}`);
  }

  // Reuse converted data on future runs
  if (fs.existsSync(jsonPath)) {
    console.log('Loading saved OSM data...');

    return JSON.parse(
      fs.readFileSync(jsonPath, 'utf8'),
    ) as OSMData;
  }

  const { createOSMStream } = await import(
    'osm-pbf-parser-node'
  );

  const nodeMap = new Map<number, OSMNode>();
  const elements: OSMElement[] = [];

  console.log('Reading local PBF file...');
  console.log('Pass 1: Reading road nodes...');

  // Pass 1: Read nodes inside the bounding box
  for await (const rawItem of createOSMStream(pbfPath)) {
    const item = rawItem as OSMItem;

    if (item.type !== 'node') continue;

    if (
      item.lat >= south &&
      item.lat <= north &&
      item.lon >= west &&
      item.lon <= east
    ) {
      nodeMap.set(item.id, {
        id: item.id,
        lat: item.lat,
        lon: item.lon,
      });
    }
  }

  console.log('Nodes found:', nodeMap.size);

  if (nodeMap.size === 0) {
    throw new Error(
      'No nodes found in this bounding box. Check the PBF file and coordinates.',
    );
  }

  for (const node of nodeMap.values()) {
    elements.push({
      type: 'node',
      id: node.id,
      lat: node.lat,
      lon: node.lon,
    });
  }

  console.log('Pass 2: Reading roads...');

  const excludedRoads =
    /^(footway|path|cycleway|steps|pedestrian|track|bridleway|construction|proposed)$/;

  let roadCount = 0;

  // Pass 2: Read road ways and build segments
  for await (const rawItem of createOSMStream(pbfPath)) {
    const item = rawItem as OSMItem;

    if (item.type !== 'way') continue;

    const highway = item.tags?.highway;

    if (!highway || excludedRoads.test(highway)) {
      continue;
    }

    const refs: number[] = item.refs ?? [];

    let segment: OSMNode[] = [];
    let segmentNumber = 0;

    const saveSegment = () => {
      if (segment.length >= 2) {
        elements.push({
          type: 'way',
          id: `${item.id}-${segmentNumber++}`,
          nodes: segment.map((node) => node.id),
          geometry: segment.map((node) => ({
            lat: node.lat,
            lon: node.lon,
          })),
          tags: item.tags,
        });

        roadCount++;
      }

      segment = [];
    };

    for (const ref of refs) {
      const node = nodeMap.get(ref);

      if (node) {
        segment.push(node);
      } else {
        saveSegment();
      }
    }

    saveSegment();
  }

  const data: OSMData = { elements };

  fs.mkdirSync(path.dirname(jsonPath), {
    recursive: true,
  });

  fs.writeFileSync(jsonPath, JSON.stringify(data));

  console.log('Conversion complete!');
  console.log('Nodes:', nodeMap.size);
  console.log('Road segments:', roadCount);
  console.log('Saved:', jsonPath);

  return data;
};

export default fetchData;