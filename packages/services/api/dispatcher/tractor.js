import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Tractor extends ApiBaseClass {
  async create({ id, data }) {
    return await this.req('post', CP.tractor.create(id), data);
  }

  async info(id) {
    return await this.req('get', CP.tractor.info(id));
  }

  async update({id, data}) {
    return await this.req('post', CP.tractor.update(id), data);
  }

  async setLinkedDrivers(data) {
    return await this.req('post', CP.tractor.setLinkedDrivers, data);
  }

  async setMaintenance(vehicleId, data) {
    return await this.req('post', CP.tractor.setMaintenance(vehicleId), data);
  }

  async list(data) {
    if (typeof this.tractorListCancelToken !== 'undefined') {
      this.tractorListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.tractorListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.tractor.list, data, false, this.tractorListCancelToken);
  }

  async vehicleTractorList(data) {
    return await this.req('post', CP.vehicle.tractorList, data);
  }
}

export default new Tractor();
