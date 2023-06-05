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
    return await this.req('post', CP.contractor.clientList, data, false , this.clientListCancelToken);
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

}

export default new Contractor();
