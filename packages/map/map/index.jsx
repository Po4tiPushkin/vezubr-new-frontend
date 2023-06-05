import React from 'react';
import { Map as MapLeaflet, TileLayer } from 'react-leaflet';

import { POSITION_MOSCOW } from '../constants';
import useFitBounds from '../hooks/useFitBounds';
import L from 'leaflet';

function Map(props, ref) {
  const { children, onLoad, dataGroups, zoom: zoomInput, center: centerInput, className, ...otherProps } = props;

  const center = centerInput || POSITION_MOSCOW;
  const zoom = zoomInput || 10;

  const mapRef = React.useRef(null);

  const fitBounds = useFitBounds({ mapRef });

  React.useImperativeHandle(
    ref,
    () => ({
      fitBounds,
      get leafletElement() {
        return mapRef.current?.leafletElement;
      },
    }),
    [fitBounds, mapRef],
  );

  //onload - не работает
  React.useEffect(() => {
    let checkInterval = null;

    const checkFeatureGroup = () => {
      const map = mapRef?.current?.leafletElement;
      if (map) {
        fitBounds();
        if (onLoad) {
          onLoad();
        }
        clearInterval(checkInterval);
      }
    };

    checkInterval = setInterval(checkFeatureGroup, 500);
  }, [onLoad]);

  return (
    <MapLeaflet
      {...otherProps}
      className={`vz-map-modern ${className}`}
      center={center}
      zoomControl={false}
      zoom={zoom}
      ref={mapRef}
    >
      <TileLayer
        url="http://{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}"
        attribution='© Яндекс <a class="ymaps-2-1-73-copyright__link" target="_blank" href="https://yandex.ru/legal/maps_termsofuse/?lang=ru">Условия использования</a>'
        reuseTiles={true}
        updateWhenIdle={true}
        subdomains={['tile0', 'tile1', 'tile2', 'tile3']}
        maxZoom={16}
      />

      {children}
    </MapLeaflet>
  );
}

export default React.forwardRef(Map);
