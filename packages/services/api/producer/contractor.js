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

  async byEmployees() {
    return await this.req('get', CP.contractor.byEmployees);
  }
}

export default new Contractor();
