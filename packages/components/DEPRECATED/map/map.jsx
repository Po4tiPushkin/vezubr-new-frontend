import React from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import moment from 'moment';
import MapConstructor from '@vezubr/services/map';
import { renderToString } from 'react-dom/server';
import Icon from '@vezubr/elements/DEPRECATED/icon/icon';
import _pick from 'lodash/pick';
import { GeoCoding as GCService } from '@vezubr/services';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

const renderIcon = (order, user_notification, monitorType) => {
  let icon;
  if (order.problem) {
    icon = order.type === 1 ? 'truckRed' : order.type === 3 ? 'truckIntercityRed' : 'truckLoaderRed';
  } else if (!order.problem && user_notification) {
    icon = order.type === 1 ? 'truckYellow' : order.type === 3 ? 'truckIntercityYellow' : 'truckLoaderYellow';
  } else if (!order.problem && !user_notification) {
    icon = order.type === 1 ? 'truckBlue' : order.type === 3 ? 'truckIntercityBlue' : 'truckLoaderBlue';
  }

  if (APP === 'client') {
    const today = moment(order.start_at_loca).format('YYYY-MM-DD') === moment().format('YYYY-MM-DD');
    if (monitorType === 'selecting' && !order.problem) {
      if (order.frontend_status.state === 106 || order.frontend_status.state === 107 || today) {
        icon = order.type === 1 ? 'truckBlack' : order.type === 3 ? 'truckIntercityBlack' : 'truckLoaderBlack2';
      } else {
        icon = order.type === 1 ? 'truckGray' : order.type === 3 ? 'truckIntercityGray' : 'truckLoaderGrey2';
      }
    }
  }
  return icon;
};

//todo: refactory make service
const carIcon = (order, notification, monitorType) => {
  const icon = renderIcon(order, notification, monitorType);
  return L.divIcon({
    className: 'pin-icon',
    html: renderToString(
      <div className={'pin-icon-wrapper'}>
        <div>
          <Icon
            style={{ width: '56px', height: '56px' }}
            className={'wide big'}
            name={order?.problem ? 'truckBgRed' : notification ? 'truckBgYellow' : 'truckBgGray'}
          />
        </div>
        <span className={'pin-icon-text'} style={{ top: '10px' }}>
          <Icon className={'wide big'} style={{ width: '36px', height: '36px' }} name={icon} />
        </span>
      </div>,
    ),
    iconSize: [48, 48],
  });
};

const pinIcon = (order, notification, index) => {
  let iconType = '';
  switch (order.urgency || order?.problem?.type) {
    case 1:
      iconType = 'pinGrey';
      break;
    case 2:
      iconType = 'pinBlack';
      break;
    case 3:
      iconType = 'pinGrey';
      break;
    default:
      iconType = 'pinGrey';
      break;
  }
  return L.divIcon({
    className: 'pin-icon',
    html: renderToString(
      <div className={'pin-icon-wrapper'}>
        <Icon className={'wide big'} name={iconType} />
        {typeof index !== 'undefined' ? <span className={'pin-icon-text'}>{index + 1}</span> : null}
      </div>,
    ),
    iconSize: [30, 43],
  });
};

class Map extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      state: props.state,
      transports: props.transports,
    };
  }

  async componentWillMount() {
    const {
      provider,
      store,
      onClick,
      element = 'map',
      addresses,
      drawRoute,
      type,
      monitoring,
      vehicle,
      fromAddress,
      drawTrack,
      orderPoints,
      order,
    } = this.props;
    const { observer } = this.context;
    const mapConstructor = new MapConstructor(provider, element, observer);
    this.mapProvider = await mapConstructor.init(onClick);
    store.dispatch({ type: 'ADD_MAP', map: this.mapProvider });

    if (addresses && addresses.length) {
      this.drawMarkers();

      if (drawRoute) {
        await this.drawRoute(fromAddress || false, fromAddress ? addresses : []);
      }

      if (drawTrack) {
        this.drawTrack();
      }

      if (vehicle) {
        const uiState = order?.frontend_status?.state || order?.uiState || -1;
        if (uiState < 400 || uiState === 403) {
          this.drawVehicle();
        }
      }

      if (orderPoints) {
        this.drawOrderPoints();
      }

      this.mapProvider.fitMarkers();
      this.mapProvider.initZoomIcons();
    }

    observer.subscribe('drawRoute', (addresses) => {
      this.drawAddresses(addresses, true);
    });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.map) {
      if (this.mapProvider) {
        this.mapProvider.refreshMap();
        this.mapProvider.initZoomIcons();
      }
      const { addresses, drawRoute } = nextProps.map;
      this.drawAddresses(addresses, drawRoute);
    }
    const shouldUpdateClient =
      nextProps.type === 'client' &&
      (this.props.monitoring.selecting?.orders.length !== nextProps.monitoring.selecting?.orders.length ||
        this.props.monitoring.executing?.orders.length !== nextProps.monitoring.executing?.orders.length);

    if (
      this.mapProvider &&
      nextProps.monitorType &&
      (nextProps.monitorType !== this.state.monitorType || shouldUpdateClient)
    ) {
      this.setState({ monitorType: nextProps.monitorType });
      if (nextProps.type === 'producer') {
        setTimeout(() => this.initOrdersForProducer());
      } else if (nextProps.type === 'client') {
        setTimeout(() => this.initOrdersForClient());
      }
    } else if (this.mapProvider && nextProps.type === 'operator') {
      setTimeout(() => this.initOrdersForOperator(nextProps));
    }
  }

  drawAddresses(addresses, drawRoute) {
    if (addresses && addresses.length && this.mapProvider) {
      this.mapProvider.removeAllMarkers();
      this.mapProvider.removePolyLine();
      this.drawMarkers(addresses);
      if (drawRoute) this.drawRoute(true, addresses);
      this.mapProvider.fitMarkers();
    }
  }

  initOrdersForClient() {
    const { monitoring, dictionaries, onArrowClick } = this.props;
    const { monitorType } = this.state;
    const list = [];
    this.mapProvider.drawFilters(monitorType);
    this.mapProvider.removeCluster();
    for (const prop of Object.keys(monitoring)) {
      if (['selecting', 'executing'].some((e) => e === prop)) {
        const data = monitoring[prop].orders;
        if (Array.isArray(data)) {
          for (const order of data) {
            if (order.frontend_status.state < 400 || order.frontend_status.state === 403) {
              if (order.vehicle) {
                const { last_gps_latitude, last_gps_longitude } = order.vehicle;
                const { user_notification } = order;
                if (last_gps_latitude && last_gps_longitude) {
                  list.push({
                    coordinates: [last_gps_latitude, last_gps_longitude],
                    options: {
                      data: order,
                      type: prop,
                      click: true,
                      problem: order.problem,
                      user_notification,
                      icon: carIcon(order, user_notification, monitorType),
                      popup: true,
                    },
                  });
                }
              } else {
                //if(order.type === 1){
                list.push({
                  coordinates: [order?.points[1]?.lat, order?.points[1]?.lng],
                  options: {
                    data: order,
                    type: prop,
                    secondType: `urgency${order?.problem?.type}`,
                    click: true,
                    icon: carIcon(order, false, monitorType),
                    popup: false,
                  },
                });
                //}
              }
            }
          }
        }
      }
    }
    this.mapProvider.createCluster({
      markerList: list,
      popup: false,
      dictionaries,
      onArrowClick,
      type: monitorType,
    });
    const filters = this.mapProvider.getFilters();
    for (const filter of filters) {
      this.mapProvider.removeFromCluster(filter.value);
      if (filter.checked) {
        this.mapProvider.addToCluster(filter.value);
      }
    }
    this.mapProvider.fitMarkers();
  }

  initOrdersForProducer() {
    const { monitoring, dictionaries, onAssignClick, onArrowClick } = this.props;
    const { monitorType } = this.state;
    const ignorance = [403, 301];
    if (this.mapProvider) {
      const list = [];
      let alternateType = monitorType === 'paperCheck' ? 'execution' : monitorType;
      let monitorFields = {};
      if (monitorType === 'selection' || monitorType === 'selectionEnding') {
        monitorFields = {
          selection: [...monitoring['selection'], ...monitoring['selectionEnding']],
          execution: [...monitoring['execution']],
        };
      } else {
        monitorFields = {
          [alternateType]: monitoring[alternateType],
        };
      }
      Object.keys(monitorFields).map((key) => {
        this.mapProvider.removeCluster();
        for (const order of monitorFields[key]) {
          if (order.uiState < 400 || order.uiState === 403) {
            if (
              (monitorType === 'selection' || monitorType === 'selectionEnding') &&
              ignorance.indexOf(order.uiState) > -1
            )
              return;

            let coordinates = [
              order.firstPointLatitude || order.address?.latitude,
              order.firstPointLongitude || order?.address?.longitude,
            ];
            if (order.vehicle && order.vehicle.lastGpsLatitude && order.vehicle.lastGpsLongitude) {
              coordinates = [order.vehicle?.lastGpsLatitude, order?.vehicle.lastGpsLongitude];
            }

            list.push({
              coordinates: coordinates,
              options: {
                data: order,
                type: key,
                secondType: `urgency${order.urgency}`,
                click: true,
                icon: key === 'execution' ? carIcon(order) : pinIcon(order),
              },
            });
          }
        }
      });
      this.mapProvider.createCluster({
        markerList: list,
        popup: true,
        dictionaries,
        onArrowClick,
        onAssignClick,
        type: monitorType,
      });
      const filters = this.mapProvider.getFilters(monitorType);
      if (!this.mapProvider.transportMarkerLayers) {
        this.drawTransportsOnMap();
        /*const transportEnabled = filters.find(filter => filter.value === "freeVehicles");
				if((!transportEnabled || !transportEnabled.checked)){
					this.mapProvider.removeFromCluster('freeVehicles')
				}*/
      }
      for (const filter of filters) {
        this.mapProvider.removeFromCluster(filter.value);
        if (filter.checked) {
          this.mapProvider.addToCluster(filter.value);
        }
      }
      this.mapProvider.fitMarkers();
    }
  }

  initOrdersForOperator(nextProps) {
    const { monitoring, dictionaries, onAssignClick, onArrowClick, monitorType } = nextProps || this.props;
    if (this.mapProvider) {
      const list = [];
      this.mapProvider.removeCluster();
      if (monitoring.data) {
        for (const order of [...monitoring.data.loadersOrders, ...monitoring.data.transportOrders]) {
          let coordinates = false;
          if (order.firstPointLatitude && order.firstPointLongitude) {
            coordinates = [order.firstPointLatitude, order.firstPointLongitude];
          }

          if (order.vehicle?.lastGpsLatitude && order?.vehicle.lastGpsLongitude) {
            coordinates = [order.vehicle?.lastGpsLatitude, order?.vehicle.lastGpsLongitude];
          }
          if (coordinates) {
            list.push({
              coordinates: coordinates,
              options: {
                data: order,
                type: '',
                secondType: `urgency${order.urgency}`,
                click: true,
                icon: pinIcon(order),
              },
            });
          }
        }
        this.mapProvider.createCluster({
          markerList: list,
          popup: true,
          dictionaries,
          onArrowClick,
          onAssignClick,
          type: monitorType,
        });
        const filters = this.mapProvider.getFilters();
        this.drawTransportsOnMap();

        //reset filters
        for (const filter of filters) {
          this.mapProvider.removeFromCluster(filter.value);
        }

        //set filter
        for (const filter of filters) {
          if (filter.checked) {
            this.mapProvider.addToCluster(filter.value);
          }
        }
        this.mapProvider.fitMarkers();
      }
    }
  }

  @autobind
  drawMarkers(addresses) {
    addresses = addresses || this.props.addresses;
    const { order } = this.props;
    for (const [index, address] of addresses.entries()) {
      this.mapProvider.drawMarker([address.latitude, address.longitude], {
        icon: L.divIcon({
          className: 'pin-icon',
          html: renderToString(
            <div className={'pin-icon-wrapper'}>
              <Icon className={'wide big'} name={'pinNumberGrey'} />
              <span className={'pin-icon-text'}>{index + 1}</span>
            </div>,
          ),
          iconSize: [30, 43],
        }),
      });
    }
  }

  @autobind
  async drawRoute(draw, address) {
    const { addresses, color, drawRoute } = this.props;
    const { observer } = this.context;
    if (draw) {
      let handlingArr = Array.isArray(addresses || address) ? addresses || address : [...addresses];
      if (handlingArr.length > 1) {
        handlingArr = handlingArr.map((val) => {
          const coords = _pick(val, ['latitude', 'longitude']);
          return `${coords.longitude},${coords.latitude}`;
        });
        try {
          const route = await GCService.routes(handlingArr);
          if (route) {
            observer.emit('polyline', { trackPolyline: route.route_geometry, trackEncoder: route.source });
          }
          this.mapProvider.polyLineSource = route.source;
          const routeArr = this.mapProvider.decodePolyline(route.route_geometry, route.source);
          this.mapProvider.removePolyLine();
          this.mapProvider.drawPolyline(routeArr, color);
        } catch (e) {
          console.error(e);
        }
      }
    } else if (typeof drawRoute === 'object') {
      this.mapProvider.polyLineSource = drawRoute.trackPolyline;
      const routeArr = this.mapProvider.decodePolyline(drawRoute.trackPolyline, drawRoute.trackEncoder);
      this.mapProvider.removePolyLine();
      this.mapProvider.drawPolyline(routeArr, color);
    }
  }

  drawTrack() {
    const { drawTrack } = this.props;
    const routeArr = this.mapProvider.decodePolyline(drawTrack.track, drawTrack.trackEncoder);
    this.mapProvider.removeTrackPolyline();
    this.mapProvider.drawTrackPolyline(routeArr, '#0F94D6');
  }

  drawVehicle() {
    const { vehicle, order } = this.props;
    const lat = vehicle.lastGpsLatitude || vehicle.last_gps_latitude;
    const lng = vehicle.lastGpsLongitude || vehicle.last_gps_longitude;
    if (lat && lng) {
      this.mapProvider.drawMarker([lng, lat], {
        data: order,
        icon: carIcon(order),
      });
    }
    //carIcon(order)
  }

  drawOrderPoints() {
    const { orderPoints } = this.props;
    for (const point of orderPoints) {
      if (point.latitude && point.longitude) {
        this.mapProvider.drawCircle(point);
      }
    }
  }

  @autobind
  drawTransportsOnMap() {
    const { dictionaries, onTransportArrowClick, transports } = this.props;
    const list = [];
    for (let transport of transports) {
      list.push({
        coordinates: [
          transport.last_gps_longitude || transport.lastGpsLongitude,
          transport.last_gps_latitude || transport.lastGpsLatitude,
        ].reverse(),
        transport,
        options: {
          data: transport,
          icon: L.divIcon({
            className: 'pin-icon',
            html: renderToString(
              <div className={'pin-icon-wrapper'}>
                <div className={'truck-in-circle'}>
                  <Icon className={'wide big circle-circle'} name={'truckBgGray'} />
                  <Icon
                    name={transport.isOnline ? 'truckBlack' : 'truckGray'}
                    style={{ width: '36px', height: '36px' }}
                    className={'circle-truck'}
                  />
                </div>
              </div>,
            ),
            iconSize: [2, 2],
          }),
          type: 'freeVehicles',
        },
      });
    }

    this.mapProvider.drawTransports({
      markerList: list,
      popup: true,
      dictionaries,
      onTransportArrowClick,
    });
  }

  componentWillUnmount() {
    const { store } = this.props;
    if (this.mapProvider) {
      this.mapProvider.destory();
      this.mapProvider = null;
      store.dispatch({ type: 'DELETE_MAP', map: this.mapProvider });
    }
  }

  render() {
    const { element = 'map' } = this.props;
    return <div className={'vz-map'} id={element} />;
  }
}

Map.propTypes = {
  provider: PropTypes.string.isRequired,
  store: PropTypes.object.isRequired,
  onClick: PropTypes.func,
  element: PropTypes.string,
  addresses: PropTypes.array,
  drawRoute: PropTypes.any,
  transports: PropTypes.array,
  onAssignClick: PropTypes.func,
  monitorType: PropTypes.string,
};

Map.contextTypes = {
  observer: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { monitoring, map, dictionaries } = state;
  return {
    map,
    monitoring,
    dictionaries,
  };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({}, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Map);
