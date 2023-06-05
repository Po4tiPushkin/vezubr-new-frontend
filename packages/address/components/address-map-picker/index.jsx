import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import * as VzMap from '@vezubr/map';
const { PATH_ANT_SLOW } = VzMap.Constants;
import { GeoCoding as GCService } from '@vezubr/services';

function AddressMapPicker(props, ref) {
  const { point, addresses: addressesInput, onChange, viewRoute, onTrackUpdated, disabled = false, polyLine = null } = props;
  const addresses = React.useMemo(
    () => (addressesInput || []).filter((address) => !!address.latitude && !!address.longitude),
    [addressesInput],
  );

  const center = useMemo(() => {
    if (!point?.longitude || !point?.latitude) return VzMap.Constants.POSITION_MOSCOW;
    return {
      lng: point.longitude,
      lat: point.latitude,
    }
  },[point?.longitude, point?.latitude])

  const mapRef = React.useRef(null);

  const refMarker = React.useRef(null);

  const onUpdateMapPosition = React.useCallback(
    ({ latlng }) => {
      if (onChange && !disabled) {
        onChange(latlng, mapRef.current);
      }
    },
    [onChange, disabled],
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

  const zoomForMap = React.useMemo(() => {
    if (point?.latitude && point?.longitude) {
      return 16;
    }

    return null;
  }, [point?.latitude, point?.longitude]);

  const [routePolyline, setRoutePolyline] = React.useState(polyLine);

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
    <VzMap.Map ref={mapRef} center={center} onclick={onUpdateMapPosition} zoom={zoomForMap}>
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
          draggable={!disabled}
          ondragend={onUpdateMarkerPosition}
          pinName={'pinNumberOrange'}
          pinText={point.position}
        />
      )}
    </VzMap.Map>
  );
}


export default React.forwardRef(AddressMapPicker);
