import React from 'react';
import MonitorMap from '../../monitor-map';
import useGetProp from '../../../hooks/useGetProp';
import { MONITOR_PROP_MAP_PROPS } from '../../../constants';

function MonitorPageMap(props) {
  const mapRef = React.useRef(null);

  const { fitBoundsTimestamp, ...otherProps } = {...useGetProp(MONITOR_PROP_MAP_PROPS), ...props} || {};

  React.useEffect(() => {
    Promise.resolve().then(() => {
      const fitBounds = mapRef.current?.fitBounds;
      if (fitBounds) {
        fitBounds();
      }
    });
  }, [fitBoundsTimestamp]);

  return <MonitorMap ref={mapRef} {...otherProps} />;
}

export default MonitorPageMap;
