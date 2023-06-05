import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Orders extends ApiBaseClass {
  async loaderOrderDetails(orderId) {
    return await this.req('post', CP.orders.loaderOrderDetails, { orderId }, false, false, false);
  }

  async orderDetails(orderId) {
    return await this.req('post', CP.orders.info, { orderId }, false, false, false);
  }

  async getMonitorings() {
    return await this.req('post', CP.orders.monitorForOrders, {});
  }

  async getMonitoringMyProblems() {
    if (typeof this.monitoringCancelToken !== 'undefined') {
      this.monitoringCancelToken.cancel('Operation canceled due to new request.');
    }
    this.monitoringCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.monitorMyProblems, {}, false, this.monitoringCancelToken);
  }

  async getMonitoringOperatorProblems() {
    if (typeof this.monitoringCancelToken !== 'undefined') {
      this.monitoringCancelToken.cancel('Operation canceled due to new request.');
    }
    this.monitoringCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.monitorOperatorProblems, {}, false, this.monitoringCancelToken);
  }

  async getMonitoringUserProblems() {
    if (typeof this.monitoringCancelToken !== 'undefined') {
      this.monitoringCancelToken.cancel('Operation canceled due to new request.');
    }
    this.monitoringCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.orders.monitorUserProblems, {}, false, this.monitoringCancelToken);
  }

  async takeInAWork() {
    return await this.req('post', CP.orders.monitorTakeInAWork, {});
  }

  async ordersList(data) {
    return await this.req('post', CP.orders.ordersList, data);
  }

  async drivers(data) {
    return await this.req('post', CP.drivers.list, data);
  }

  async refuseWaiting(data) {
    return await this.req('post', CP.orders.refuseWaiting, data);
  }

  async appoint(data) {
    return await this.req('post', CP.orders.appoint, data);
  }

  async requestReplacement(data) {
    return await this.req('post', CP.orders.requestReplacement, data);
  }

  async setCustomIdentifier(data) {
    return await this.req('post', CP.orders.setCustomIdentifier, data);
  }

  async sendNotification(data) {
    return await this.req('post', CP.orders.sendNotification, data);
  }

  async cancelSos(data) {
    return await this.req('post', CP.orders.cancelSos, data);
  }
}

export default new Orders();
