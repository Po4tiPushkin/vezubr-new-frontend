import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class GeoCoding extends ApiBaseClass {
  async geoCoder(q) {
    if (typeof this.geoCoderCancelToken !== 'undefined') {
      this.geoCoderCancelToken.cancel('Operation canceled due to new request.');
    }
    this.geoCoderCancelToken = this.axios.CancelToken.source();
    return await this.req('get', CP.geoCoding.geocoder, { params: { q } }, false, this.geoCoderCancelToken);
  }

  async reverseGeoCoder(lat, lng) {
    //at=55.700182&lng=37.580158
    return await this.req('get', CP.geoCoding.reverseGeocoder, { params: { lat, lng } });
  }

  async getTimeZone(lat, lng) {
    return await this.req('get', CP.geoCoding.googleTimeZone, { params: { location: [lat, lng].join(',') } });
  }

  //googleTimeZone

  async reverseGeoCoderGoogle(lat, lng) {
    //at=55.700182&lng=37.580158
    return await this.req('get', CP.geoCoding.reverseGeocoder, { params: { lat, lng, provider: 'google' } });
  }

  async routes(data) {
    return await this.req('get', CP.geoCoding.routes, { params: { loc: data } });
  }

  async ringRoad(data) {
    //name=MKAD&lat=55.832515&lng=37.491072
    return await this.req('get', CP.geoCoding.ringRoad, {
      params: {
        name: 'MKAD',
        lat: 55.832515,
        lng: 37.491072,
      },
    });
  }

  async addressAutocomplete(data) {
    return await this.req('get', CP.geoCoding.addressAutocomplete, { params: data });
  }
}

export default new GeoCoding('geo');
