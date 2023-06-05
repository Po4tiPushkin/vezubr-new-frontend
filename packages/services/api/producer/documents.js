import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Documents extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.documents.list, data);
  }

  async orderDetailsInType({orderId, type}) {
    return await this.req('get', CP.documents.orderDetailsInType(orderId, type));
  }

  async getItem(orderId) {
    return await this.req('get', CP.documents.getItem(orderId),);
  }

  async addComment({orderDocumentId, text}) {
    return await this.req('post', CP.documents.addComment(orderDocumentId), {text});
  }

  async getCommentList(id) {
    return await this.req('get', CP.documents.getCommentList(id));
  }

  async accept(orderDocumentId) {
    return await this.req('post', CP.documents.accept,  orderDocumentId);
  }

  async deleteDocument(id) {
    return await this.req('delete', CP.documents.deleteDocument(id));
  }

  async replaceDocument(id, file) {
    return await this.req('post', CP.documents.replaceDocument(id), { file });
  }

  async uploadDocument(orderId, orderDocumentId, file) {
    return await this.req('post', CP.documents.uploadDocument, { orderId, orderDocumentId, file });
  }
}

export default new Documents();
