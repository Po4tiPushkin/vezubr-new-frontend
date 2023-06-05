import React from 'react';
import L from 'leaflet';
import { renderToString } from 'react-dom/server';
import { FitBoundsIconComponent, MinusIconComponent, PlusIconComponent } from '../../icons/divIconImages';

const FitBoundsNativeControl = L.Control.Zoom.extend({
  options: {
    position: 'bottomright',

    zoomInText: '+',

    zoomInTitle: 'Приблизить',

    zoomOutText: '&#x2212;',

    zoomOutTitle: 'Отдалить',

    fitTitle: 'По содержимому',
  },

  getBounds: function () {
    const bounds = new L.LatLngBounds();
    this._map.eachLayer(function (layer) {
      if (layer.getBounds || layer.getLatLng) {
        bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
      }
    }, this);

    return bounds;
  },

  _onFitBounds(ev) {
    this.fitBounds();
  },

  fitBounds() {
    const bounds = this.getBounds();
    if (bounds.isValid()) {
      if (bounds.getSouthWest().equals(bounds.getNorthEast())) {
        this._map.setView(bounds.getCenter());
      } else {
        this._map.fitBounds(bounds);
      }
    }
  },

  onAdd: function (map) {
    const controlName = 'leaflet-location-custom';
    const container = L.DomUtil.create('div', controlName + ' leaflet-bar leaflet-control leaflet-control-custom');
    const options = this.options;

    this._zoomInButton = this._createButton(
      renderToString(<PlusIconComponent />),
      options.zoomInTitle,
      controlName + '-in',
      container,
      this._zoomIn,
    );
    this._zoomOutButton = this._createButton(
      renderToString(<MinusIconComponent />),
      options.zoomOutTitle,
      controlName + '-out',
      container,
      this._zoomOut,
    );
    this._createButton(
      renderToString(<FitBoundsIconComponent />),
      options.fitTitle,
      controlName + '-fit',
      container,
      this._onFitBounds,
    );

    this._updateDisabled();
    map.on('zoomend zoomlevelschange', this._updateDisabled, this);

    return container;
  },
});

export default FitBoundsNativeControl;
