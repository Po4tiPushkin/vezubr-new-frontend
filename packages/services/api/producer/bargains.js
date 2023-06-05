import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Bargains extends ApiBaseClass {
  async list(filters) {
    if (typeof this.bargainOrderListCancelToken !== 'undefined') {
      this.bargainOrderListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.bargainOrderListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.bargains.list, filters, false, this.bargainOrderListCancelToken);
  }

  async delete({ id, offerId }) {
    return await this.req('delete', CP.bargains.delete(id, offerId));
  }

  async add({ id, data }) {
    return await this.req('post', CP.bargains.add(id), { sum: data });
  }

  async update({ id, offerId, data }) {
    return await this.req('post', CP.bargains.update(id, offerId), data);
  }

  async self(id) {
    return await this.req('get',CP.bargains.self(id));
  }
}

export default new Bargains();
