import { Coordinate } from '../interface/coordinate.interface.js';
import { toRadian } from './toradian.js';

export const haversine = (
  startLocation: Coordinate,
  goalLocation: Coordinate,
): number => {
  const EARTH_RADIUS_IN_M = 6371000;
  const delLat = toRadian(goalLocation.lat - startLocation.lat);
  const delLon = toRadian(goalLocation.lon - startLocation.lon);

  const a =
    Math.pow(Math.sin(delLat / 2), 2) +
    Math.cos(toRadian(startLocation.lat)) *
      Math.cos(toRadian(goalLocation.lat)) * 
      Math.pow(Math.sin(delLon / 2), 2);

  const c = Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_IN_M * c;
};
