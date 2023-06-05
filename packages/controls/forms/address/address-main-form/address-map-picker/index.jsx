import React from 'react';
import PropTypes from 'prop-types';
import * as VzMap from '@vezubr/map';
import { GeoCoding as GCService } from '@vezubr/services';

const { PATH_ANT_SLOW } = VzMap.Constants;

function AddressMapPicker(props, ref) {
  const { point, addresses: addressesInput, onChange, viewRoute, onTrackUpdated } = props;

  const addresses = React.useMemo(
    () => (addressesInput || []).filter((address) => !!address.latitude && !!address.longitude),
    [addressesInput],
  );

  const mapRef = React.useRef(null);

  const refMarker = React.useRef(null);

  const onUpdateMapPosition = React.useCallback(
    ({ latlng }) => {
      if (onChange) {
        onChange(latlng, mapRef.current);
      }
    },
    [onChange],
  );

  const onUpdateMarkerPosition = React.useCallback(
    (d) => {
      const marker = refMarker?.current?.leafletElement;
      if (marker && onChange) {
        const latLng = marker.getLatLng();
        onChange(latLng, mapRef.current);
      }
    },
    [onChange],
  );

  const [routePolyline, setRoutePolyline] = React.useState(null);

  React.useImperativeHandle(ref, () => mapRef.current, [mapRef.current]);

  React.useEffect(() => {
    async function getRoutes() {
      const coordinatesStringArr = addresses.map((address) => {
        return `${address.latitude},${address.longitude}`;
      });

      const route = await GCService.routes(coordinatesStringArr);

      let routePolyline = null;
      if (route && route?.route_geometry && route?.source) {
        routePolyline = {
          value: route.route_geometry,
          encoder: route.source,
        };
      }

      setRoutePolyline(routePolyline);
      if (onTrackUpdated) {
        onTrackUpdated(routePolyline);
      }
    }

    if (viewRoute) {
      if (addresses.length > 1) {
        getRoutes().catch((e) => {
          console.error(e);
        });
      } else {
        setRoutePolyline(null);
      }
    }
  }, [addresses, viewRoute, onTrackUpdated]);

  return (
    <VzMap.Map ref={mapRef} onclick={onUpdateMapPosition} zoom={16}>
      <VzMap.ZoomFitBoundsControl position="bottomright" />
      {routePolyline && (
        <>
          <VzMap.Polyline {...PATH_ANT_SLOW.bg} value={routePolyline.value} encode={routePolyline.encoder} />
          <VzMap.PolylineAnt
            {...{ ...PATH_ANT_SLOW.ant, duration: 50 }}
            value={routePolyline.value}
            encode={routePolyline.encoder}
          />
        </>
      )}

      {addresses.map((address, index) => (
        <VzMap.Marker key={index} value={address} pinName={'pinNumberGray'} pinText={address.position || index + 1} />
      ))}

      {point && point.latitude && point.longitude && (
        <VzMap.Marker
          ref={refMarker}
          value={point}
          draggable={true}
          ondragend={onUpdateMarkerPosition}
          pinName={'pinNumberOrange'}
          pinText={point.position}
        />
      )}
    </VzMap.Map>
  );
}

export default React.forwardRef(AddressMapPicker);
