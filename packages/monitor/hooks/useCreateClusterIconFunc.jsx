import React from 'react';
import L from 'leaflet';
import cn from 'classnames';

export default function useCreateClusterIconFunc() {
  return React.useCallback((cluster) => {
    const childCount = cluster.getChildCount();
    const children = cluster.getAllChildMarkers();
    const hasProblem = !!children.find(({ options: { item } }) => item?.problems?.filter(item => item.status === 1).length);

    let sizeClass = 'marker-cluster-';
    let radius = 40;
    if (childCount < 10) {
      sizeClass += 'small';
    } else if (childCount < 100) {
      sizeClass += 'medium';
      radius = 50;
    } else {
      sizeClass += 'large';
      radius = 70;
    }

    const className = cn('marker-cluster', 'marker-cluster-custom', 'marker-cluster-monitor', sizeClass, {
      'marker-cluster-monitor--has-problem': hasProblem,
    });

    return new L.DivIcon({
      html: `<div><span>${childCount}</span></div>`,
      className,
      iconSize: new L.Point(radius, radius),
    });
  }, []);
}
