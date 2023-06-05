import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Documents extends ApiBaseClass {
  async orderDetails({orderId, type}) {
    return await this.req('get', CP.documents.orderDetails(orderId, type));
  }
}

export default new Documents();
