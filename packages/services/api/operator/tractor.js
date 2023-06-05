import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Tractor extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.tractor.add, data);
  }

  async info(data) {
    return await this.req('post', CP.tractor.info, data);
  }

  async update(data) {
    return await this.req('post', CP.tractor.update, data);
  }

  async setLinkedDrivers(data) {
    return await this.req('post', CP.tractor.setLinkedDrivers, data);
  }

  async setMaintenance(data) {
    return await this.req('post', CP.tractor.setMaintenance, data);
  }

  async resetMaintenance(data) {
    return await this.req('post', CP.tractor.resetMaintenance, data);
  }

  async list(
    data = {
      orderBy: 'plateNumber',
      orderDirection: 'DESC',
    },
  ) {
    return await this.req('post', CP.tractor.list, data);
  }

  async vehicleTractorList(data) {
    return await this.req('post', CP.vehicle.tractorList, data);
  }
}

export default new Tractor();
