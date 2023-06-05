import React, { useState, useMemo, useEffect } from 'react';
import { FeatureGroup, Tooltip as LeafletTooltip } from 'react-leaflet';
import { orderEventHandlers } from '@vezubr/common/common/utils'
import centrifugo from '@vezubr/services/socket/centrifuge'
import * as Icons from '../../../icons';
import InfoPointArrivalDeparture from '../../../components/order-info-point-arrival-departure';
import OrderInfoParkingPoint from '../../../components/order-info-parking-point';

const executionState = [301, 302, 303, 304, 305, 306, 307, 310];

function OrderMap(props) {

  const { order = {}, mapData, parkingsList, VzMap } = props;

  const addresses = useMemo(() => {
    return order?.transportOrder?.points || order?.loadersOrder?.points || []
  }, [order])

  const isExecution = order?.orderUiState?.state && executionState.indexOf(order?.orderUiState?.state) > -1;

  const [gpsTrackPolylines, setGpsTrackPolylines] = useState(mapData?.polyLines);
  const [parkingPins, setParkingPins] = useState(parkingsList);

  const [gpsTrackPolyline, setGpsTrackPolyline] = useState({
    polyline: mapData?.trackedPolyline,
    encoder: mapData?.trackedEncoder,
  });

  const [vehicleUpdated, setVehicleUpdated] = useState({});

  const vehicle = useMemo(() => {
    const vehicle =
      (order?.transportOrder?.vehicle && {
        ...order?.transportOrder?.vehicle,
        ...vehicleUpdated,
      }) ||
      null;

    if (vehicle && isExecution && vehicle?.lastGpsLatitude && vehicle?.lastGpsLongitude) {
      const { type: orderType, problem: orderProblem } = order;
      return {
        vehicleId: vehicle.id,
        value: [vehicle.lastGpsLatitude, vehicle.lastGpsLongitude],
        iconName: Icons.getBitmapIconNameTruck(orderType, orderProblem),
        bgName: Icons.getBitmapIconBgNameTruck(orderProblem),
      };
    }

    return null;
  }, [order?.transportOrder?.vehicle, isExecution, order?.type, order?.problem, vehicleUpdated]);

  const clusterIconAddress = VzMap.Icons.useCreateClusterIconFunc('address');

  useEffect(() => {
    if (!isExecution || !order?.id) {
      return;
    }

    const centrifugeChannel = centrifugo().subscribe(`$order-${order.id}`, (d) => {
      if (d?.data) {
        const { type, data } = d?.data;
        if (orderEventHandlers[type]) {
          orderEventHandlers[type]({ data, setGpsTrackPolylines, setGpsTrackPolyline, setVehicleUpdated })
        } else {
          console.error(`Handler for event ${type} is not defined`)
        }
      }
    })

    return () => {
      centrifugeChannel.leave();
    };
  }, [order?.id]);

  return (
    <VzMap.Map maxZoom={16} className={'order-view__tab'} style={{ overflowY: 'hidden' }}>
      <VzMap.ZoomFitBoundsControl position="bottomright" />

      {addresses && addresses.length > 0 && (
        <VzMap.LayersControl position="topright">
          <VzMap.LayersControl.Overlay checked={true} name="Адреса">
            <VzMap.MarkerClusterGroup
              spiderfyOnMaxZoom={true}
              showCoverageOnHover={false}
              zoomToBoundsOnClick={true}
              maxClusterRadius={20}
              spiderfyDistanceMultiplier={1.7}
              iconCreateFunction={clusterIconAddress}
            >
              {addresses.map((address, index) => (
                <VzMap.Marker key={index} value={address} pinName="pinNumberGray" pinText={index + 1}>
                  <LeafletTooltip>
                    <InfoPointArrivalDeparture {...address} />
                  </LeafletTooltip>
                </VzMap.Marker>
              ))}
            </VzMap.MarkerClusterGroup>
          </VzMap.LayersControl.Overlay>

          {parkingPins && parkingPins.length > 0 && (
            <VzMap.LayersControl.Overlay checked={true} name="Остановки">
              <VzMap.MarkerClusterGroup
                spiderfyOnMaxZoom={true}
                showCoverageOnHover={false}
                zoomToBoundsOnClick={true}
                maxClusterRadius={20}
                spiderfyDistanceMultiplier={1.7}
                iconCreateFunction={clusterIconAddress}
              >
                {parkingPins.map((address, index) => (
                  <VzMap.Marker key={index} value={{ latitude: address.lng, longitude: address.lon }} pinName="pinParking">
                    <LeafletTooltip>
                      <OrderInfoParkingPoint {...address} index={index + 1} />
                    </LeafletTooltip>
                  </VzMap.Marker>
                ))}

              </VzMap.MarkerClusterGroup>
            </VzMap.LayersControl.Overlay>
          )}

          {mapData?.preliminaryPolyline && mapData?.preliminaryEncoder && (
            <VzMap.LayersControl.Overlay checked={true} name="Предварительный маршрут">
              <VzMap.Polyline color="gray" value={mapData.preliminaryPolyline} encode={mapData.preliminaryEncoder} />
            </VzMap.LayersControl.Overlay>
          )}

          {(gpsTrackPolylines || (gpsTrackPolyline.polyline && gpsTrackPolyline.encoder)) && (
            <VzMap.LayersControl.Overlay checked={true} name="Окончательный маршрут">
              {gpsTrackPolylines ? (
                <FeatureGroup>
                  <VzMap.GpsTrackView polylines={gpsTrackPolylines} />
                </FeatureGroup>
              ) : (
                <VzMap.Polyline color="#0F94D6" value={gpsTrackPolyline.polyline} encode={gpsTrackPolyline.encoder} />
              )}
            </VzMap.LayersControl.Overlay>
          )}

          {vehicle && (
            <VzMap.LayersControl.Overlay checked={true} name="Машина">
              <VzMap.Vehicle {...vehicle} />
            </VzMap.LayersControl.Overlay>
          )}



        </VzMap.LayersControl>
      )}
    </VzMap.Map>
  );
}

export default OrderMap;
