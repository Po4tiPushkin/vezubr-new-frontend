import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Documents extends ApiBaseClass {
  async orderDetails({orderId, type}) {
    return await this.req('get', CP.documents.orderDetails(orderId, type));
  }
  
  async accept(data) {
    return await this.req('post', CP.documents.accept, data);
  }

  async orderDetailsInType({orderId, type}) {
    return await this.req('get', CP.documents.orderDetailsInType(orderId, type));
  }

  async info(id) {
    return await this.req('get', CP.documents.orderInfo(id))
  }

  async list(data) {
    return await this.req('post', CP.documents.list, data)
  }

  async addComment({orderDocumentId, text}) {
    return await this.req('post', CP.documents.addComment(orderDocumentId), { text } )
  }

}

export default new Documents();
