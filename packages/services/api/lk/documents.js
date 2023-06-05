import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Documents extends ApiBaseClass {
  async orderDetails({ orderId, type }) {
    return await this.req('get', CP.documents.orderDetails(orderId, type));
  }

  async accept(data) {
    return await this.req('post', CP.documents.accept, data);
  }

  async orderDetailsInType({ orderId, type }) {
    return await this.req('get', CP.documents.orderDetailsInType(orderId, type));
  }

  async info(id) {
    return await this.req('get', CP.documents.orderInfo(id))
  }

  async list(data) {
    return await this.req('post', CP.documents.list, data)
  }

  async addComment({ orderDocumentId, text }) {
    return await this.req('post', CP.documents.addComment(orderDocumentId), { text })
  }

  async flowList(data) {
    if (typeof this.flowListCancelToken !== 'undefined') {
      this.flowListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.flowListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.documents.flowList, data, false, this.flowListCancelToken);
  }

  async sign(id) {
    return await this.req('get', CP.documents.sign(id));
  }

}

export default new Documents();
