import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Vehicle extends ApiBaseClass {
  async info(id) {
    return await this.req('get', CP.vehicle.info(id));
  }

  async update(id, data) {
    return await this.req('post', CP.vehicle.update(id), data);
  }

  async list(data) {
    if (typeof this.vehicleListCancelToken !== 'undefined') {
      this.vehicleListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.vehicleListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.vehicle.list, data, false, this.vehicleListCancelToken);
  }

  async createWagon(data) {
    return await this.req('post', CP.vehicle.createWagon, data);
  }

  async getListForDashboard(data) {
    return await this.req('post', CP.vehicle.listForDashboard, data);
  }

  async updateTrailer({id, trailer}) {
    return await this.req('post', CP.vehicle.updateTrailer(id), {trailer});
  }

  async setLinkedDrivers(id, data) {
    return await this.req('post', CP.vehicle.setLinkedDrivers(id), {drivers: data});
  }

  async listCompatibleForTransportOrder(data) {
    return await this.req('get', CP.vehicle.listCompatibleForTransportOrder(data.orderId));
  }

  async wagonInfo(data) {
    return await this.req('post', CP.vehicle.wagonInfo, data);
  }

  async setMaintenance(vehicleId, data) {
    return await this.req('post', CP.vehicle.setMaintenance(vehicleId), data);
  }

  async unformPoly(data) {
    return await this.req('post', CP.vehicle.unformPoly, data);
  }

  async remove({vehicleId}) {
    return await this.req('delete', CP.vehicle.remove(vehicleId));
  }
  
  async create(data) {
    return await this.req('post', CP.vehicle.create, data);
  }

  async listCompatibleForOrderVehicle(id, data) {
    return await this.req('post', CP.vehicle.listCompatibleForOrderVehicle(id), data)
  }

  async listCompatibleForOrderTrailer(id, data) {
    return await this.req('post', CP.vehicle.listCompatibleForOrderTrailer(id), data)
  }

  async types() {
    return await this.req('get', CP.vehicle.types);
  }

}

export default new Vehicle();
