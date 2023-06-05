import Sputnik from './sputnik';
import L from 'leaflet';

const CONFIGS = {
  defaultZoom: 10,
  //minZoom: 6,
  maxZoom: 17,
};
let map = false;

const dropMap = () => {
  if (map) {
    map.off();
    map.remove();
  }
};

class Yandex extends Sputnik {
  init() {
    L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);

    L.Map.addInitHook(function () {
      return L.DomEvent.off(this._container, 'mousedown', this.keyboard._onMouseDown);
    });
    dropMap();
    const yandexLayer = L.tileLayer(
      'http://tile2.maps.2gis.com/tiles?x={x}&y={y}&z={z}',
      {
        // center: {lat: 55.56436892371119, lng: 37.607634049755035},
        zoom: 100,
        subdomains: ['01', '02', '03', '04'],
        attribution:
          '© Яндекс <a class="ymaps-2-1-73-copyright__link" target="_blank" href="https://yandex.ru/legal/maps_termsofuse/?lang=ru">Условия использования</a>',
        reuseTiles: true,
        updateWhenIdle: true,
      },
    );
    map = new L.Map(this.elementId, {
      center:{lat: 55.56436892371119, lng: 37.607634049755035},
      layers: [yandexLayer],
      zoomControl: false,
      zoom: CONFIGS.defaultZoom,
      minZoom: CONFIGS.minZoom,
      maxZoom: CONFIGS.maxZoom,
      // crs: L.CRS.EPSG3395,
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
    this.setDefaultView();
  }

  setDefaultView() {
    this.map.setView([55.57446301869603, 37.6171875], 10);
  }
}

export default Yandex;
