import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Vehicle extends ApiBaseClass {
  async createMono(data) {
    return await this.req('post', CP.vehicle.createMono, data);
  }

  async monoInfo(data) {
    return await this.req('post', CP.vehicle.monoInfo, data);
  }
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

  async resetMaintenance(data) {
    return await this.req('post', CP.vehicle.resetMaintenance, data);
  }

  async remove({vehicleId}) {
    return await this.req('delete', CP.vehicle.remove(vehicleId));
  }

  async scanDocument(data) {
    return await this.req('post', CP.vehicle.scanDocument, data);
    //https://producer.vezubr.com/docs/v1#tag/Driver/paths/~1driver~1scan-document-passport/post
    // https://producer.vezubr.com/docs/v1#tag/Driver/paths/~1driver~1scan-document-driver-license/post
  }

  async activeOrders(data) {
    return await this.req('post', CP.vehicle.activeOrders, data);
  }

  async create(data) {
    return await this.req('post', CP.vehicle.create, data);
  }

  async import(data) {
    return await this.req('post', CP.vehicle.import, data);
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
