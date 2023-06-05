import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Vehicle extends ApiBaseClass {
  async createMono(data) {
    return await this.req('post', CP.vehicle.createMono, data);
  }

  async monoInfo(data) {
    return await this.req('post', CP.vehicle.monoInfo, data);
  }

  async updateMono(data) {
    return await this.req('post', CP.vehicle.updateMono, data);
  }

  async list(data) {
    if (typeof this.listCancelToken !== 'undefined') {
      this.listCancelToken.cancel('Operation canceled due to new request.');
    }
    this.listCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.vehicle.list, data, false, this.listCancelToken);
  }

  async createWagon(data) {
    return await this.req('post', CP.vehicle.createWagon, data);
  }

  async getListForDashboard(data = { filterVehiclesNotBusy: 1 }) {
    return await this.req('post', CP.vehicle.listForDashboard, data);
  }

  async setLinkedDrivers(data) {
    return await this.req('post', CP.vehicle.setLinkedDrivers, data);
  }

  async listCompatibleForTransportOrder(data) {
    return await this.req('post', CP.vehicle.listCompatibleForTransportOrder, data);
  }

  async wagonInfo(data) {
    return await this.req('post', CP.vehicle.wagonInfo, data);
  }

  async setMaintenance(data) {
    return await this.req('post', CP.vehicle.setMaintenance, data);
  }

  async unformPoly(data) {
    return await this.req('post', CP.vehicle.unformPoly, data);
  }

  async resetMaintenance(data) {
    return await this.req('post', CP.vehicle.resetMaintenance, data);
  }

  async removeMono(data) {
    return await this.req('post', CP.vehicle.removeMono, data);
  }

  async check(data) {
    return await this.req('post', CP.vehicle.check, data);
  }

  async approve(data) {
    return await this.req('post', CP.vehicle.accept, data);
  }

  async ban(data) {
    return await this.req('post', CP.vehicle.ban, data);
  }

  async reject(data) {
    return await this.req('post', CP.vehicle.reject, data);
  }

  async activeOrders(data) {
    return await this.req('post', CP.vehicle.activeOrders, data);
  }
}

export default new Vehicle();
