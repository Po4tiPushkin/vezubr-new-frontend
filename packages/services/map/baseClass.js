import PolyUtil from 'polyline-encoded';
class BaseMapClass {
  constructor(provider, elementId, clickEvent, zoomEvent = void 0, observer) {
    this.elementId = elementId;
    this.apiKey = window.API_CONFIGS?.mapKeys?.[provider];
    this.markers = [];
    this.clickEvent = clickEvent;
    this.observer = observer;
    this.polylineConfigs = {
      color: '#FAA526',
      weight: 3,
      opacity: 1,
      smoothFactor: 1,
    };
    this.init();
  }

  destory() {
    this.map = null;
    this.apiKey = null;
    this.elementId = null;
  }

  init() {}

  drawMarker() {}

  removeMarker() {}

  fitMarkers() {}

  refreshMap() {}

  encodePolyline(polyline, encode) {
    const poly = encode === 'osrm' ? 6 : 5;
    return PolyUtil.encode(polyline, poly);
  }

  /**
   * Use a decoding precision of 6 to decode OSRM Routing Engine geometries
   * @param polyline
   * @returns Array
   */
  decodePolyline(polyline, encode) {
    if (!polyline) return false;
    const poly = encode === 'osrm' || encode === 'sputnik_maps' ? 6 : 5;
    return PolyUtil.decode(polyline, poly);
  }
}

export default BaseMapClass;
