import React from 'react';
import * as mapElements from '../elems';
import { FeatureGroup } from 'react-leaflet';
import LayersControl from '../control/layers-control';

export default function useGetControlOverlays({ dataGroups }) {
  return React.useMemo(() => {
    if (!dataGroups) {
      return null;
    }

    const controlOverlaysItems = [];

    dataGroups.forEach((groupElem, groupIndex) => {
      const { key, title, data } = groupElem;

      const elems = [];

      for (let elemIndex = 0; elemIndex < data.length; elemIndex++) {
        const { type, key, ...otherProps } = data[elemIndex];

        if (mapElements[type]) {
          if (otherProps.value) {
            const MapElem = mapElems[type];
            elems.push(<MapElem key={key || elemIndex} {...otherProps} />);
          }
        } else {
          console.warn('Has no map elem type: ' + type);
        }
      }

      if (elems.length > 0) {
        controlOverlaysItems.push(
          <LayersControl.Overlay checked={true} key={key || groupIndex} name={title}>
            <FeatureGroup>{elems}</FeatureGroup>
          </LayersControl.Overlay>,
        );
      }
    });

    if (controlOverlaysItems.length > 0) {
      return controlOverlaysItems;
    }

    return null;
  }, [dataGroups]);
}
