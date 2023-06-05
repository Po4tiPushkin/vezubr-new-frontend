import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Drivers extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.drivers.add, data);
  }

  async list(data) {
    return await this.req('post', CP.drivers.list, data);
  }

  async info(data) {
    return await this.req('post', CP.drivers.info, data);
  }

  async update(data) {
    return await this.req('post', CP.drivers.update, data);
  }

  async setLinkedVehicles(data) {
    return await this.req('post', CP.drivers.setLinkedVehicles, data);
  }

  async setSickState(data) {
    return await this.req('post', CP.drivers.setSickState, data);
  }

  async remove(data) {
    return await this.req('post', CP.drivers.remove, data);
  }

  async getListForVehicles(data) {
    return await this.req('post', CP.drivers.getListForVehicles, data);
  }

  async check(data) {
    return await this.req('post', CP.drivers.check, data);
  }

  async approve(data) {
    return await this.req('post', CP.drivers.approve, data);
  }

  async reject(data) {
    return await this.req('post', CP.drivers.reject, data);
  }

  async ban(data) {
    return await this.req('post', CP.drivers.ban, data);
  }

  async activeOrders(data) {
    return await this.req('post', CP.drivers.activeOrders, data);
  }
}

export default new Drivers();
