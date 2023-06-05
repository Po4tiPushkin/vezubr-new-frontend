import _pick from 'lodash/pick';
import { GeoCoding as GCService } from '@vezubr/services';
import { decodePolyline } from './index';

export async function getRoute(addresses) {
  let handlingArr = Array.isArray(addresses) ? addresses : [...addresses];

  if (handlingArr.length > 1) {
    handlingArr = handlingArr.map((val) => {
      const coords = _pick(val, ['latitude', 'longitude']);
      return `${coords.longitude},${coords.latitude}`;
    });

    try {
      const route = await GCService.routes(handlingArr);
      return decodePolyline(route.route_geometry, route.source);
    } catch (e) {
      console.error(e);
    }
  }

  return null;
}
