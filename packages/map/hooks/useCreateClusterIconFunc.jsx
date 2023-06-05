import React from 'react';
import L from 'leaflet';

export default function useCreateClusterIconFunc(clusterIconName, radius = 40) {
  return React.useCallback(
    (cluster) => {
      const childCount = cluster.getChildCount();

      let c = ' marker-cluster-';
      if (childCount < 10) {
        c += 'small';
      } else if (childCount < 100) {
        c += 'medium';
      } else {
        c += 'large';
      }

      return new L.DivIcon({
        html: `<div><span>${childCount}</span></div>`,
        className: `${clusterIconName} marker-cluster-custom marker-cluster` + c,
        iconSize: new L.Point(radius, radius),
      });
    },
    [clusterIconName, radius],
  );
}
