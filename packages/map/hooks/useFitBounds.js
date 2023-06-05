import React from 'react';
import { LatLngBounds } from 'leaflet';

export default function useFitBounds({ mapRef }) {
  return React.useCallback(() => {
    const map = mapRef?.current?.leafletElement;
    const bounds = new LatLngBounds([]);

    if (!map) {
      return;
    }

    map.eachLayer(function (layer) {
      if (layer['getBounds'] || layer['getLatLng']) {
        bounds.extend(layer['getBounds'] ? layer['getBounds']() : layer['getLatLng']());
      }
    });

    if (bounds.isValid()) {
      if (bounds.getSouthWest().equals(bounds.getNorthEast())) {
        map.setView(bounds.getCenter(), map.getZoom());
      } else {
        map.fitBounds(bounds);
      }
    }
  }, [mapRef]);
}
