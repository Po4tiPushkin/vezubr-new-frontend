import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Orders extends ApiBaseClass {
  async orderDetails(orderId) {
    return await this.req('get', CP.orders.orderDetails(orderId));
  }

  async loaderOrderDetails(orderId) {
    return await this.req('post', CP.orders.loaderOrderDetails, { orderId });
  }

  async getMonitorings() {
    if (typeof this.monitoringCancelToken !== 'undefined') {
      this.monitoringCancelToken.cancel('Operation canceled due to new request.');
    }
    this.monitoringCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.monitorForOrders, {}, false, this.monitoringCancelToken);
  }

  async monitoringBargains(params) {
    return await this.req('post', CP.orders.monitoringBargains, params);
  }

  async monitoringDocuments(params) {
    return await this.req('post', CP.orders.monitoringDocuments, params);
  }

  async monitoringExecuting(params) {
    return await this.req('post', CP.orders.monitoringExecuting, params);
  }

  async monitoringSelecting(params) {
    return await this.req('post', CP.orders.monitoringSelecting, params);
  }

  async ordersList(data) {
    if (typeof this.ordersListCancelToken !== 'undefined') {
      this.ordersListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.ordersListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.ordersList, data, false, this.ordersListCancelToken);
  }

  async drivers(data) {
    return await this.req('post', CP.drivers.list, data);
  }

  async refuseWaiting({ orderId }) {
    return await this.req('post', CP.orders.refuseWaiting(orderId));
  }

  async appoint(orderId, data) {
    return await this.req('post', CP.orders.appoint(orderId), data)
  }

  async requestReplacement({id, data}) {
    return await this.req('post', CP.orders.requestReplacement(id), data);
  }

  async requestLoadersReplacement(data) {
    return await this.req('post', CP.orders.requestLoadersReplacement, data);
  }

  async appointLoaders(id, data) {
    return await this.req('post', CP.orders.appointLoaders(id), data);
  }

  async setCustomIdentifier(data) {
    return await this.req('post', CP.orders.setCustomIdentifier, data);
  }

  async calculationUpdate(data) {
    return await this.req('post', CP.orders.calculationUpdate, data);
  }

  async finalizeWithoutCalculation(data) {
    return await this.req('post', CP.orders.finalizeWithoutCalculation, data);
  }

  async finalize(data) {
    return await this.req('post', CP.orders.finalize, data);
  }

  async docDelete(data) {
    return await this.req('post', CP.orders.docDelete, data);
  }

  async docReplace(data) {
    return await this.req('post', CP.orders.docReplace, data);
  }

  async docUpload(data) {
    return await this.req('post', CP.orders.docUpload, data);
  }

  async executionStart(data) {
    return await this.req('post', CP.orders.executionStart(data), { id: data });
  }

  async executionEnd(data) {
    return await this.req('post', CP.orders.executionEnd(data), { id: data });
  }

  async csvReport(orderId) {
    return await this.req('get', CP.orders.csvReport(orderId));
  }

  async getParkingPointsList(orderId) {
    return await this.req('get', CP.orders.parkingPointsList(orderId));
  }

  async pointStatusUpdate({ id, data }) {
    return await this.req('post', CP.orders.pointStatusUpdate(id), data)
  }

  async updatePointsPositions(data) {
    return await this.req('post', CP.orders.updatePointsPositions(data.id), { points: data.points });
  }

  async take(id) {
    return await this.req('post', CP.orders.take(id));
  }

  async exportList(data) {
    return await this.req('post', CP.orders.exportOrderList, data);
  }

  async responsibleEmployees({ id, data }) {
    return await this.req('post', CP.orders.responsibleEmployees(id), data);
  }

  async executionFinish(id) {
    return await this.req('post', CP.orders.executionFinish(id))
  }

  async history(id, data) {
    return await this.req('post', CP.orders.history(id), data)
  }
  
}

export default new Orders();
