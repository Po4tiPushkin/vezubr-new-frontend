import L from 'leaflet';
require('leaflet.markercluster');
import BaseMapClass from '../baseClass';
import moment from 'moment';
import { renderZoomIcons, renderOrderFilters } from '../mapElements';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { MapPopupDeprecated, IconDeprecated } from '@vezubr/elements';
import Static from '@vezubr/common/constants/static';

const CONFIGS = {
  defaultZoom: 10,
  //minZoom: 6,
  maxZoom: 17,
};
let map = false;

const states = {
  selection: [102, 103, 800, 801, 802, 106, 107],
  execution: [301, 302, 303, 403, 304, 305, 306, 307, 803, 804],
  paperCheck: [401, 402, 404, 501, 502, 503, 504, 505],
};

const dropMap = () => {
  if (map) {
    map.off();
    map.remove();
  }
};

class Sputnik extends BaseMapClass {
  init() {
    L.sm.apiKey = this.apiKey;
    L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);

    L.Map.addInitHook(function () {
      return L.DomEvent.off(this._container, 'mousedown', this.keyboard._onMouseDown);
    });
    dropMap();
    map = new L.Map(this.elementId, {
      zoomControl: false,
      zoom: CONFIGS.defaultZoom,
      minZoom: CONFIGS.minZoom,
      maxZoom: CONFIGS.maxZoom,
    });
    this.map = map;
    if (this.clickEvent) {
      this.map.on('click', this.clickEvent);
    }
    if (this.zoomEvent) {
      this.map.on('zoomend', this.zoomEvent);
    }

    this.map.on('popupopen', (e) => {
      const px = this.map.project(e.popup._latlng); // find the pixel location on the map where the popup anchor is
      px.y -= e.popup._container.clientHeight / 2; // find the height of the popup container, divide by 2, subtract from the Y axis of marker location
      this.map.panTo(this.map.unproject(px), { animate: true }); // pan to new center
    });
  }

  refreshMap() {
    this.map._onResize();
  }

  set polyLineSource(val) {
    this.source = val;
  }

  get rawEncodedPolyline() {
    return this.encodePolyline(this.rawPolyline);
  }

  drawMarker(coordinates = [], options = {}) {
    coordinates = coordinates.reverse();
    const marker = L.marker(coordinates, options);
    marker.addTo(this.map);
    if (options.draggable) {
      marker.on('dragend', (e) => {
        e.latlng = e.target._latlng;
        this.clickEvent(e);
      });
    }
    this.markers.push(marker);
    if (this.markersCluster) {
      this.markersCluster.addLayer(marker);
    }
    return marker;
  }

  setDefaultView() {
    this.map.setView([55.75, 37.6167], 10);
  }

  fitMarkers() {
    /*if (this.markers.length && this.map) {
			setTimeout(() => {
				if (this.markersCluster) {
					this.map.fitBounds(this.markersCluster.getBounds());
				}
				this.map.fitBounds(this.map.getBounds());
				if(this.map._zoom > 10){
					this.map.setZoom(10);
				}
			});
		}*/
    /*if (this.markersCluster) {
			this.map.fitBounds(this.markersCluster.getBounds());
			console.log(this.map._zoom);
			if(this.map._zoom > 11){
				this.map.setZoom(10);
			}
		}
		else*/
    if (this.markers.length) {
      const latLngs = this.markers.map((marker) => marker.getLatLng());
      const markerBounds = L.latLngBounds(latLngs);
      this.map.fitBounds(markerBounds);
      if (this.map._zoom > 11) {
        this.map.setZoom(10);
      }
      //this.map.fitBounds(this.map.getBounds());
    } else {
      this.setDefaultView();
    }
  }

  removeAllMarkers() {
    for (const marker of this.markers) {
      this.map.removeLayer(marker);
    }
    this.markers = [];
  }

  removeMarker(marker) {
    const markerIndex = this.markers.findIndex((m) => m._leaflet_id === marker._leaflet_id);
    this.markers.splice(markerIndex, 1);
    this.map.removeLayer(marker);
  }

  createCluster({ markerList, popup = false, dictionaries, onAssignClick, onArrowClick, type }) {
    this.dictionaries = dictionaries;
    this.markers = [];
    this.markersCluster = L.markerClusterGroup({
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      maxClusterRadius: 50,
      spiderfyDistanceMultiplier: 1.7,
      iconCreateFunction: function (cluster) {
        let valueCount = {
          truckGroupRed: 0,
          truckGroupYellow: 0,
          truckGroupGrey: 0,
        };

        for (const e of cluster.getAllChildMarkers()) {
          if (e.options.data) {
            const { problem, user_notification } = e.options?.data;
            if (problem) {
              valueCount.truckGroupRed++;
            } else if (user_notification) {
              valueCount.truckGroupYellow++;
            } else {
              valueCount.truckGroupGrey++;
            }
          }
        }
        const maxValue = cluster.getAllChildMarkers().length; //Math.max(...Object.values(valueCount));
        //const maxKey = Object.keys(valueCount).find((e) => valueCount[e] === maxValue);
        let maxKey = 'truckGroupGrey';
        if (valueCount.truckGroupRed) {
          maxKey = 'truckGroupRed';
        } else if (valueCount.truckGroupYellow) {
          maxKey = 'truckGroupYellow';
        }
        return L.divIcon({
          html: renderToString(
            <div style={{ position: 'relative' }} className={'flexbox center width-60 height-60'}>
              <div
                style={{ position: 'absolute' }}
                className={'cluster-item-count ' + (maxKey.includes('Red') ? 'red-cluster' : 'blue-cluster')}
              >
                {maxValue}
              </div>
              <IconDeprecated name={maxKey} />
            </div>,
          ),
          className: 'truck-icon',
        });
      },
    });

    this.createClusterElements(markerList, popup, onAssignClick, onArrowClick);
    this.map.addLayer(this.markersCluster);
    this.initZoomIcons();
    this.drawFilters(type);
    const markersClusterBounds = this.markersCluster.getBounds();
    if (markersClusterBounds.isValid()) {
      this.map.fitBounds(markersClusterBounds);
    }
    this.onAssignClick = onAssignClick;
    this.onArrowClick = onArrowClick;
  }

  createClusterElements(markerList, popup, onAssignClick, onArrowClick) {
    const dictionaries = this.dictionaries;
    for (let marker of markerList) {
      const m = L.marker(marker.coordinates, marker.options);
      m.on('click', (e) => {
        if (marker.options.data && (marker.options.popup || popup)) {
          m.unbindPopup();
          m.bindPopup(
            renderToString(
              <MapPopupDeprecated
                keyProp={marker.options.data.id}
                popupType={marker.options.type}
                observer={this.observer}
                data={marker.options.data || marker.options.transport}
                onArrowClick={onArrowClick}
                onAssignClick={onAssignClick}
                dictionaries={dictionaries}
              />,
            ),
          ).openPopup();
        }
      });
      this.markers.push(m);
      this.markersCluster.addLayer(m);
    }
  }

  getFilters() {
    return this.activeFilters;
  }

  removeCluster() {
    if (this.markersCluster) this.map.removeLayer(this.markersCluster);
  }

  findIteminMarkerCluster(id) {
    let selected = false;
    this.markersCluster.eachLayer((layer) => {
      const { data } = layer.options;
      if (data.id === id) {
        selected = layer;
        return;
      }
    });
    return selected;
  }

  removeFromCluster(type) {
    if (type === 'freeVehicles') {
      this.removeTransports();
    } else {
      this.markersCluster.eachLayer((layer) => {
        const { data } = layer.options;
        const today = data.toStartAtDate === moment().format('YYYY-MM-DD');
        data.uiState = data.uiState || data?.frontend_status?.state || 0;
        if (type === 'urgency3') {
          if (states.selection.indexOf(data.uiState) > -1 && today) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'urgency2') {
          if (states.selection.indexOf(data.uiState) > -1 && !today) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'shouldStart') {
          if (data.uiState === 201) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'isUnloading') {
          if (data?.vehicle?.isUnloading) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'selecting') {
          if (states.selection.indexOf(data.uiState) > -1) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'operatorSelecting') {
          if (states.selection.indexOf(data.uiState) > -1 && data.problems.length) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'onDuty') {
          if (data.type === 1 && states.execution.indexOf(data.uiState) > -1) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'operatorIsUnloading') {
          if (data.type === 1 && [304, 305, 306, 307].indexOf(data.uiState) > -1) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'operatorExecuting') {
          if ([...states.execution, ...states.paperCheck].indexOf(data.uiState) > -1 && data.problems.length) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'operatorTodayOrders') {
          if (today) {
            this.markersCluster.removeLayer(layer);
          }
        } else if (type === 'operatorFutureOrders') {
          if (data.toStartAtDate > moment().format('YYYY-MM-DD')) {
            this.markersCluster.removeLayer(layer);
          }
        } else {
          if (layer.options.type === type || layer.options.secondType === type) {
            this.markersCluster.removeLayer(layer);
          }
        }
      });
    }
    // this.fitMarkers();
  }

  addToCluster(type) {
    if (type === 'freeVehicles') {
      this.addTransport();
    } else {
      this.markers.filter((marker) => {
        const { data } = marker.options;
        const today = data.toStartAtDate === moment().format('YYYY-MM-DD');
        data.uiState = data.uiState || data?.frontend_status?.state || 0;
        const m = L.marker([marker._latlng.lat, marker._latlng.lng], marker.options);
        m.on('click', (e) => {
          if (marker.options.data) {
            m.unbindPopup();
            m.bindPopup(
              renderToString(
                <MapPopupDeprecated
                  keyProp={marker.options.data.id}
                  popupType={marker.options.type}
                  observer={this.observer}
                  data={marker.options.data || marker.options.transport}
                  onArrowClick={this.onArrowClick}
                  onAssignClick={this.onAssignClick}
                  dictionaries={this.dictionaries}
                />,
              ),
            ).openPopup();
          }
        });
        const markerExistsOnMap = this.findMarkerInsideClusters(data.id);
        if (!markerExistsOnMap) {
          if (type === 'urgency3') {
            if (states.selection.indexOf(data.uiState) > -1 && today) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'urgency2') {
            const future = moment().startOf('day').diff(moment(data.toStartAtLocal).startOf('day'), 'days') > 0;
            if (states.selection.indexOf(data.uiState) > -1 && !today) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'shouldStart') {
            if (data.uiState === 201) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'isUnloading') {
            if (data?.vehicle?.isUnloading) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'selecting') {
            if (states.selection.indexOf(data.uiState) > -1) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'operatorSelecting') {
            if (states.selection.indexOf(data.uiState) > -1 && data.problems.length) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'onDuty') {
            if (data.type === 1 && states.execution.indexOf(data.uiState) > -1) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'operatorIsUnloading') {
            if (data.type === 1 && [304, 305, 306, 307].indexOf(data.uiState) > -1) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'operatorExecuting') {
            if ([...states.execution, ...states.paperCheck].indexOf(data.uiState) > -1 && data.problems.length) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'operatorTodayOrders') {
            if (today) {
              this.markersCluster.addLayer(m);
            }
          } else if (type === 'operatorFutureOrders') {
            if (data.toStartAtDate > moment().format('YYYY-MM-DD')) {
              this.markersCluster.addLayer(m);
            }
          } else {
            if (marker.options.type === type || marker.options.secondType === type) {
              this.markersCluster.addLayer(m);
            }
          }
        }
      });
    }
    this.fitMarkers();
  }

  removePolyLine() {
    if (this.polyline) {
      this.rawPolyline = undefined;
      this.map.removeLayer(this.polyline);
    }
  }

  removeTrackPolyline() {
    if (this.trackPolyline) {
      this.rawTrackPolyline = undefined;
      this.map.removeLayer(this.trackPolyline);
    }
  }

  drawTrackPolyline(arr, color) {
    this.rawTrackPolyline = arr;
    const polyConfig = Object.assign({}, this.polylineConfigs);
    if (color) {
      polyConfig.color = color;
    }
    polyConfig.zIndex = 2;
    polyConfig.opacity = 1;
    this.trackPolyline = new L.Polyline(arr, polyConfig);
    this.trackPolyline.addTo(this.map);
  }

  drawPolyline(arr, color) {
    this.rawPolyline = arr;
    const polyConfig = Object.assign({}, this.polylineConfigs);
    if (color) {
      polyConfig.color = color;
      polyConfig.opacity = 1;
    }
    this.polyline = new L.Polyline(arr, polyConfig);
    this.polyline.addTo(this.map);
  }

  drawCircle(point) {
    const latLng = L.latLng([point.latitude, point.longitude]);
    const color = point.state === 100 ? 'green' : '#BC1A46';
    const status = point.state === 100 ? 'Прибытие' : 'Получение документов';
    const content = `<div style="padding:10px; font-size:15px">
			Пункт, ${point.pointNumber}. ${moment(point.enteredAtLocal).format('DD/MM/YYYY')}<br/>
			${status} в ${moment(point.enteredAtLocal).format('HH:mm')}
		</div>`;
    L.circleMarker(latLng, {
      color,
      opacity: 1,
      weight: 3,
      fillOpacity: 0.8,
    })
      .addTo(this.map)
      .on('click', (e) => {
        const circle = e.target;
        circle.bindPopup(content).openPopup();
      });
  }

  updateTrack(coordinates) {
    const routeArr = [...this.rawTrackPolyline];
    routeArr.push(coordinates);
    this.removeTrackPolyline();
    this.drawTrackPolyline(routeArr, '#0F94D6');
  }

  drawFilters(monitorType) {
    const filters =
      APP === 'producer'
        ? Static.getMapFilters(monitorType)
        : APP === 'operator'
        ? Static.getMapFilters('operator', monitorType)
        : Static.getMapFilters('client', monitorType);
    if (!filters) return;
    //filters.map(filter => filter.checked = monitorType === filter.value);
    if (this.mapFilters) this.map.removeControl(this.mapFilters);
    const FilterOrders = L.Control.extend({
      options: {
        position: 'bottomright',
      },
      onAdd: (map) => renderOrderFilters(this, map, filters, APP),
    });
    this.mapFilters = new FilterOrders();
    this.map.addControl(this.mapFilters);
    this.activeFilters = filters;
  }

  drawTransports({
    markerList = this.transportMarkers,
    popup = true,
    dictionaries = this.dictionaries,
    onTransportArrowClick,
  }) {
    this.dictionaries = dictionaries;
    this.transportMarkers = markerList;
    const transportMarkerLayers = [];
    this.transportMarkers.map((marker, key) => {
      const m = L.marker(marker.coordinates, marker.options);
      m.addTo(this.map);
      m.on('click', () => {
        m.unbindPopup();
        m.bindPopup(
          renderToString(
            <MapPopupDeprecated
              keyProp={key}
              data={marker.transport}
              popupType={'transport'}
              observer={this.observer}
              onArrowClick={onTransportArrowClick}
              dictionaries={dictionaries}
            />,
          ),
          {
            autoPan: false,
          },
        ).openPopup();
      });
      transportMarkerLayers.push(m);
    });
    this.transportMarkerLayers = transportMarkerLayers;
  }

  addTransport() {
    if (!this.transportMarkerLayers) return false;
    this.transportMarkerLayers.forEach((marker) => {
      marker.addTo(this.map);
    });
  }

  removeTransports() {
    if (!this.transportMarkerLayers) return;

    this.transportMarkerLayers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
  }

  initZoomIcons() {
    if (this.zoomIcons) return;
    const ZoomIcons = L.Control.extend({
      options: {
        position: 'bottomright',
      },
      onAdd: (map) => {
        return renderZoomIcons(map, this.markersCluster, (e) => {
          if (e.action === 'locateClick') {
            if (this.markersCluster && this.markersCluster.getBounds().isValid()) {
              this.map.fitBounds(this.markersCluster.getBounds());
            } else if (this.markers.length) {
              const latLngs = this.markers.map((marker) => marker.getLatLng());
              const markerBounds = L.latLngBounds(latLngs);
              this.map.fitBounds(markerBounds);
              /*if (this.map._zoom > 10) {
								this.map.setZoom(10);
							}*/
              //this.map.fitBounds(this.map.getBounds());
            } else {
              this.setDefaultView();
            }
          }
        });
      },
    });
    this.zoomIcons = new ZoomIcons();
    this.map.addControl(this.zoomIcons);
  }

  setView(coordinates, zoom = 16) {
    this.map.setView(coordinates, zoom);
  }

  findAndOpenPopup({ item, onArrowClick = () => {}, onAssignClick = () => {}, dictionaries }) {
    this.markersCluster.zoomToShowLayer(item, () => {
      item
        .bindPopup(
          renderToString(
            <MapPopupDeprecated
              keyProp={item.options.data.id}
              popupType={item.options.type}
              data={item.options.data || item.options.transport}
              onArrowClick={onArrowClick}
              observer={this.observer}
              onAssignClick={onAssignClick}
              dictionaries={dictionaries}
            />,
          ),
          {
            autoPan: false,
          },
        )
        .openPopup();
    });
  }

  destroy() {
    this.markers = null;
    this.markersCluster = null;
    this.zoomIcons = null;
    this.mapFilters = null;
    this.activeFilters = null;
    this.transportMarkers = null;
  }

  updateMarkerCoordinates(data) {
    const marker = this.markers.find((m) => m.options.data?.id === data.orderId);
    if (marker) {
      const newLatLang = new L.LatLng(data.latitude, data.longitude);
      marker.setLatLng(newLatLang);
      if (this.markersCluster) {
        this.markersCluster.eachLayer((layer) => {
          if (layer.options.data.id === data.orderId) {
            const newLatLang = new L.LatLng(data.latitude, data.longitude);
            return layer.setLatLng(newLatLang);
          }
        });
      }
    }

    if (this.transportMarkerLayers && this.transportMarkerLayers.length) {
      const tMarker = this.transportMarkerLayers.find((m) => m.options.data?.id === data.vehicleId);
      if (tMarker) {
        const newLatLang = new L.LatLng(data.latitude, data.longitude);
        tMarker.setLatLng(newLatLang);
      }
    }
  }

  findMarkerInsideClusters(id) {
    const layers = this.markersCluster.getLayers();
    return layers.find((marker) => marker.options.data?.id === id);
  }

  findMarker(id) {
    return this.markers.find((marker) => marker.options.data?.id === id);
  }
}

export default Sputnik;
