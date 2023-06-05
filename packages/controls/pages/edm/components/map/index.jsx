import React, { useEffect, useMemo, useCallback, useState } from 'react';
import * as Order from '@vezubr/order/form';
import * as VzMap from '@vezubr/map';
import { devLog } from '@vezubr/common/common/utils';
import { FeatureGroup, Tooltip as LeafletTooltip } from 'react-leaflet';
import { IconDeprecated } from '@vezubr/elements';
const { Icons } = Order;

const EdmMap = (props) => {
  const { order, setMapFull } = props;

  const vehicle = useMemo(() => {

    if (order?.lastGpsLatitude && order?.lastGpsLongitude) {
      return {
        // vehicleId: vehicle.id,
        value: [order.lastGpsLatitude, order.lastGpsLongitude],
        iconName: 'truckBlue',
        bgName: 'truckBgGray',
      };
    }

    return null;
  }, [order,]);

  const clusterIconAddress = VzMap.Icons.useCreateClusterIconFunc('address');
  return (
    <div className={`edm__map`}>
      <VzMap.Map maxZoom={16}>
        <VzMap.ZoomFitBoundsControl position="topright" />

        {vehicle && (
          <VzMap.LayersControl position="topright">
            <VzMap.LayersControl.Overlay checked={true} name="Машина">
              <VzMap.Vehicle {...vehicle} />
            </VzMap.LayersControl.Overlay>
          </VzMap.LayersControl>
        )}
      </VzMap.Map>
      <div onClick={() => setMapFull(prev => !prev)} className='edm__full-icon'>
        <IconDeprecated name={'fitBounds'} />
      </div>
    </div>
  );
}

export default EdmMap;