import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Drivers extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.drivers.create, data);
  }

  async list(data) {
    if (typeof this.driverListCancelToken !== 'undefined') {
      this.driverListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.driverListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.drivers.list, data, false, this.driverListCancelToken);
  }

  async info(id) {
    return await this.req('get', CP.drivers.info(id));
  }

  async update(id, data) {
    return await this.req('post', CP.drivers.update(id), data);
  }

  async setLinkedVehicles({ id, vehicles }) {
    return await this.req('post', CP.drivers.setLinkedVehicles(id), {vehicles});
  }

  async canWorkAsLoader({ id, canWorkAsLoader }) {
    return await this.req('post', CP.drivers.canWorkAsLoader(id), {canWorkAsLoader});
  }

  async neverDelegate({ id, neverDelegateState }) {
    return await this.req('post', CP.drivers.neverDelegate(id), {neverDelegateState});
  }

  async setSickState(id, data) {
    return await this.req('post', CP.drivers.setSickState(id), data);
  }

  async shortList(data) {
    return await this.req('post', CP.drivers.shortList, data);
  }

  async logout(id) {
    return await this.req('post', CP.drivers.logout(id));
  }

  async remove({ driverId }) {
    return await this.req('post', CP.drivers.remove(driverId));
  }

  async calendar(data) {
    return await this.req('post', CP.drivers.calendar, data);
  }
}

export default new Drivers();
