import React from 'react';
import PropTypes from 'prop-types';
import * as VzMap from '@vezubr/map';
import _uniqWith from 'lodash/uniqWith';

import MonitorMapItem from './monitor-map-item';
import { observer } from 'mobx-react';
import { MonitorContext } from '../../context';
import useCreateClusterIconFunc from '../../hooks/useCreateClusterIconFunc';
import { itemIsEqual } from '../../utils';
import { Ant } from '@vezubr/elements';

export const listClusterProps = PropTypes.objectOf(
  PropTypes.shape({
    checked: PropTypes.bool,
    name: PropTypes.string.isRequired,
    data: PropTypes.arrayOf(
      PropTypes.shape({
        id: PropTypes.number.isRequired,
        type: PropTypes.string.isRequired,
      }),
    ),
  }),
);

function MonitorMap(props, ref) {
  const { listCluster, ...otherProps } = props;

  const { store } = React.useContext(MonitorContext);

  const clusterIconFun = useCreateClusterIconFunc();

  const mapRef = React.useRef(null);

  const markerClusterGroupRef = React.useRef(null);

  const { openedPopupInfo } = store;

  React.useImperativeHandle(ref, () => mapRef.current, [mapRef.current]);

  React.useEffect(() => {
    if (!openedPopupInfo.item) {
      return;
    }

    const searchItemId = openedPopupInfo.item?.id;
    const searchType = openedPopupInfo.item?.type;

    const markersCluster = markerClusterGroupRef.current?.leafletElement;

    if (markersCluster) {
      const findItem = markersCluster.getLayers().find(({ options }) => options.item.id === searchItemId);

      if (findItem) {
        markersCluster.zoomToShowLayer(findItem, (a, b, c) => {
          findItem.openPopup();
        });
      } else {
        Ant.message.warning(
          `${searchType === 'order' ? 'Рейс' : 'Машина'} № ${searchItemId} не присутствует на карте`,
        );
      }
    }
  }, [openedPopupInfo.item, openedPopupInfo.timeStamp]);

  return (
    <VzMap.Map ref={mapRef} maxZoom={16}>
      <VzMap.ZoomFitBoundsControl position="bottomleft" />
      <VzMap.MapSettings mapContainer={otherProps.mapContainer} position="bottomleft" />

      {listCluster && (
        <VzMap.MarkerClusterGroup
          ref={markerClusterGroupRef}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          maxClusterRadius={20}
          spiderfyDistanceMultiplier={1.7}
          iconCreateFunction={clusterIconFun}
        >
          <VzMap.CheckboxGroupControl title={'Фильтр'} position={'bottomleft'} list={listCluster}>
            {(data) => {
              return _uniqWith(data, itemIsEqual).map((item) => (
                <MonitorMapItem key={item.id} item={item} {...otherProps} />
              ));
            }}
          </VzMap.CheckboxGroupControl>
        </VzMap.MarkerClusterGroup>
      )}
    </VzMap.Map>
  );
}

export default observer(React.forwardRef(MonitorMap));
