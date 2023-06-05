import PolyUtil from 'polyline-encoded';
import React from 'react';

export function decodePolyline(polyline, encode) {
  const poly = encode === 'osrm' || encode === 'sputnik_maps' ? 6 : 5;
  return PolyUtil.decode(polyline, poly);
}

export function getPosition(value) {
  if (value?.latitude && value?.longitude) {
    return [value.latitude, value.longitude];
  }
  return value;
}
