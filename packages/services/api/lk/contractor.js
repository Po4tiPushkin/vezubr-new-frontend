import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Contractor extends ApiBaseClass {
  async counterPartiesList(role) {
    return await this.req('get', CP.contractor.counterPartiesList(role));
  }

  async clientList(data) {
    if (typeof this.clientListCancelToken !== 'undefined') {
      this.clientListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.clientListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.contractor.clientList, data, false, this.clientListCancelToken);
  }

  async approve(data) {
    return await this.req('post', CP.contractor.approve, data);
  }

  async delegatedList(id) {
    return await this.req('get', CP.contractor.delegatedList(id));
  }

  async delegatedUpdate(id, data) {
    return await this.req('post', CP.contractor.delegatedUpdate(id), data);
  }

  async producerList(data) {
    if (typeof this.producerListCancelToken !== 'undefined') {
      this.producerListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.producerListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.contractor.producerList, data, false, this.producerListCancelToken);
  }

  async producerForOrderList(data) {
    return await this.req('post', CP.contractor.producerForOrderList, data);
  }

  async byEmployees() {
    return await this.req('get', CP.contractor.byEmployees);
  }

  async notificationsCount() {
    return await this.req('get', CP.contractor.notificationsCount);
  }

  async notificationsList(data) {
    return await this.req('post', CP.contractor.notificationsList, data);
  }

  async switchStatus(id, data) {
    return await this.req('post', CP.contractor.switchStatus(id), data);
  }

  async getCustomProperty(id) {
    return await this.req('get', CP.contractor.getCustomProperty(id))
  }

  async setCustomProperty(id, data) {
    return await this.req('post', CP.contractor.setCustomProperty(id), data)
  }

  async exportList(data) {
    return await this.req('post', CP.contractor.export, data);
  }

  async getFrontSettings(data) {
    return await this.req('get', CP.contractor.frontSettings, data);
  }

  async setFrontSettings(data) {
    if (typeof this.setFrontSettingsCancelToken !== 'undefined') {
      this.setFrontSettingsCancelToken.cancel('Operation canceled due to new request.');
    }
    this.setFrontSettingsCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.contractor.frontSettings, data, false, this.setFrontSettingsCancelToken);
  }

  async listByResponsibleEmployee(data) {
    return await this.req('post', CP.contractor.listByResponsibleEmployee, data);
  }

  async assignResponsible(data) {
    return await this.req('post', CP.contractor.assignResponsible, data)
  }

  async removeResponsible(data) {
    return await this.req('post', CP.contractor.removeResponsible, data)
  }

  async createChild(data) {
    return await this.req('post', CP.contractor.createChild, data)
  }

}

export default new Contractor();
