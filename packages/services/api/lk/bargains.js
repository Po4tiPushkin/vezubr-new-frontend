import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Bargains extends ApiBaseClass {
  async list(id) {
    return await this.req('get', CP.bargains.list(id));
  }
  async orderList(data) {
    if (typeof this.bargainOrderListCancelToken !== 'undefined') {
      this.bargainOrderListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.bargainOrderListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.bargains.orderList, data, false, this.bargainOrderListCancelToken);
  }

  async accept({ id, data }) {
    return await this.req('post', CP.bargains.accept(id), { offer: data });
  }

  async delete({ orderId, offerId }) {
    return await this.req('delete', CP.bargains.delete(orderId,offerId));
  }

  async add({ orderId, data }) {
    return await this.req('post', CP.bargains.add(orderId), { sum: data });
  }

  async self(id) {
    return await this.req('get', CP.bargains.self(id));
  }

  async updateBasicOffers({id, data}) {
    return await this.req('post', CP.bargains.updateBasicOffers(id), data);
  }
}

export default new Bargains();
