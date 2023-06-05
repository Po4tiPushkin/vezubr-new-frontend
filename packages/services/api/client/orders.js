import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Orders extends ApiBaseClass {
  async monitoring() {
    return await this.req('get', CP.orders.monitoring);
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

  async orders(filters) {
    if (typeof this.ordersCancelToken !== 'undefined') {
      this.ordersCancelToken.cancel('Operation canceled due to new request.');
    }
    this.ordersCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.filteredList, filters, false, this.ordersCancelToken);
  }

  async preCalculate(data) {
    if (typeof this.preCalculateCancelToken !== 'undefined') {
      this.preCalculateCancelToken.cancel('Operation canceled due to new request.');
    }
    this.preCalculateCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.calculate, data, false, this.preCalculateCancelToken);
  }

  async createAndPublish(data) {
    return await this.req('post', CP.orders.createAndPublish, data);
  }

  async editTransportOrder(data) {
    return await this.req('post', CP.orders.editTransportOrder, data);
  }

  async editTransportOrderActive(orderId, data) {
    return await this.req('post', CP.orders.editTransportOrderActive(orderId), data);
  }

  async getTransportOrderEditingData(requestId) {
    return await this.req('post', CP.orders.getTransportOrderEditingData, { id: requestId });
  }

  // async getLoaderOrderEditingData(requestId) {
  //   return await this.req('post', CP.orders.getLoaderOrderEditingData, { requestId });
  // }
  
  async orderDetails(orderId) {
    return await this.req('get', CP.orders.orderDetails(orderId));
  }

  async loaderOrderDetails(orderId) {
    return await this.req('post', CP.orders.loaderOrderDetails, { orderId });
  }

  async bargainsList(data) {
    if (typeof this.bargainsListCancelToken !== 'undefined') {
      this.bargainsListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.bargainsListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.bargainsList, data, false, this.bargainsListCancelToken);
  }

  async acceptOrderCalculation(orderId, calculationId) {
    return await this.req('post', CP.orders.approveOrderCalculation(orderId, calculationId), {});
  }

  async acceptOrderDocument(orderId) {
    return await this.req('post', CP.orders.approveOrderDocuments(orderId));
  }


  async rejectOrderDocument({ orderId, startupMessage }) {
    return await this.req('post', CP.orders.rejectOrderDocuments(orderId), { startupMessage });
  }

  async rejectOrderCalculation(orderId, calculationId, startupMessage) {
    return await this.req('post', CP.orders.rejectOrderCalculation(orderId, calculationId), { startupMessage });
  }

  async cancelRequestAccept(orderId) {
    return await this.req('post', CP.orders.cancelRequestAccept(orderId), {});
  }

  async cancelRequestCancel(orderId) {
    return await this.req('post', CP.orders.cancelRequestCancel(orderId), {});
  }

  async cancelRequestChangeExecutor(orderId) {
    return await this.req('post', CP.orders.cancelRequestCancel(orderId), {});
  }

  async removeOrder(orderId) {
    return await this.req('delete', CP.orders.removeOrder(orderId));
  }

  async getDeferredList(params) {
    return await this.req('post', CP.orders.getDefferedList, params);
  }

  async cancelDeferredList(data) {
    return await this.req('post', CP.orders.cancelDeferredList, data);
  }

  async cancelDeferred(data) {
    return await this.req('post', CP.orders.cancelDeferred, data);
  }

  async publishDeferred(data) {
    return await this.req('post', CP.orders.publishDeferred, data);
  }

  async createTransportDeferred(data) {
    return await this.req('post', CP.orders.transportCreateDeferred, params);
  }

  async extendSelecting(orderId) {
    return await this.req('post', CP.orders.extendSelecting(orderId));
  }

  async cancelRequest(request) {
    return await this.req('post', CP.orders.cancelRequest, { request:String(request) });
  }

  async acceptExecutorChange(orderId) {
    return await this.req('post', CP.orders.acceptExecutorChange(orderId));
  }

  async declineExecutorChange(orderId) {
    return await this.req('post', CP.orders.rejectExecutorChange(orderId));
  }

  async ordersPaymentCreate(orderId) {
    return await this.req('post', CP.orders.ordersPaymentCreate, { orderId: orderId });
  }

  async ordersPaymentResult(orderId) {
    return await this.req('post', CP.orders.ordersPaymentResult, { orderId: orderId });
  }

  async updatePointsPositions(data) {
    return await this.req('post', CP.orders.updatePointsPositions(data.id), { points: data.points });
  }

  async skipAddress(data) {
    return await this.req('post', CP.orders.skipAddress(data.id, data.pointNumber), {});
  }

  async csvReport(orderId) {
    return await this.req('get', CP.orders.csvReport(orderId));
  }

  async getParkingPointsList(orderId) {
    return await this.req('get', CP.orders.parkingPointsList(orderId));
  }

  async regularOrderList(data) {
    if (typeof this.regularOrderListCancelToken !== 'undefined') {
      this.regularOrderListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.regularOrderListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.regularOrderList, data, false, this.regularOrderListCancelToken);
  }

  async createRegularOrder(data) {
    return await this.req('post', CP.orders.createRegularOrder, data)
  }

  async regularOrderDetails(id) {
    return await this.req('get', CP.orders.regularOrderDetails(id))
  }

  async editRegularOrder(id, data) {
    return await this.req('post', CP.orders.editRegularOrder(id), data)
  }

  async deleteRegularOrder(id) {
    return await this.req('delete', CP.orders.deleteRegularOrder(id))
  }

  async togglePauseRegularOrder(id, data) {
    return await this.req('post', CP.orders.togglePauseRegularOrder(id), data)
  }

  async arriveAt(data) {
    return await this.req('post', CP.orders.arriveAt, data);
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
