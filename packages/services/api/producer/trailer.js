import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Trailer extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.trailer.add, data);
  }

  async info(id) {
    return await this.req('get', CP.trailer.info(id));
  }

  async update({ id, data }) {
    return await this.req('post', CP.trailer.update(id), data);
  }

  async list(data) {
    if (typeof this.trailerListCancelToken !== 'undefined') {
      this.trailerListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.trailerListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.trailer.list, data, false, this.trailerListCancelToken);
  }

  async vehicleTrailerList(data) {
    return await this.req('post', CP.vehicle.trailerList, data);
  }

  async setMaintenance({ trailerId, data }) {
    return await this.req('post', CP.trailer.setMaintenance(trailerId), data);
  }

}

export default new Trailer();
