import React, { useEffect, useRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import AddressMapPicker from '../address-map-picker';

function Map(props) {

  const { addresses, useMap, onTrackUpdated, viewRoute = true, polyLine = null } = props

  const refMap = useRef(null);

  const hasRealCoordinates = useMemo(() => addresses.some((a) => a.latitude && a.longitude), [addresses]);

  useEffect(() => {
    const { leafletElement: map, fitBounds } = refMap.current || {};
    if (map) {
      map.invalidateSize(true);
    }
    if (fitBounds) {
      Promise.resolve().then(() => {
        fitBounds();
      });
    }
  }, [addresses]);

  if (!useMap || !hasRealCoordinates) {
    return null;
  }

  return (
    <div className={'vz-form-field-addresses__map'}>
      <AddressMapPicker
        ref={refMap}
        onTrackUpdated={onTrackUpdated}
        addresses={addresses}
        viewRoute={viewRoute}
        polyLine={polyLine}
      />
    </div>
  );
}

Map.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object),
  onTrackUpdated: PropTypes.func,
  useMap: PropTypes.bool,
};

export default Map;
