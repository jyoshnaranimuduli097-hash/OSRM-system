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