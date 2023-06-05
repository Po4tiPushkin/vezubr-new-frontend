import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Requests extends ApiBaseClass {
  async requestList(data) {
    if (typeof this.requestListCancelToken !== 'undefined') {
      this.requestListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.requestListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.requests.requestList, data, false, this.requestListCancelToken);
  }
  async requestActiveList(data) {
    if (typeof this.requestActiveListCancelToken !== 'undefined') {
      this.requestActiveListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.requestActiveListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.requests.requestActiveList, data, false, this.requestActiveListCancelToken);
  }
  async takeRequest(data) {
    return await this.req('post', CP.requests.takeRequest, data);
  }
  async exportList(data, active) {
    return await this.req('post', active ? CP.requests.exportListActive : CP.requests.exportList, data);
  }

  async setSharingCustomProperties(id, data) {
    return await this.req('post', CP.requests.setSharingCustomProperties(id), data);
  }

}

export default new Requests();
