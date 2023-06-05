import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Offers extends ApiBaseClass {
  async list(id) {
    return await this.req('get', CP.offers.list(id));
  }

  async accept({ id, data }) {
    return await this.req('post', CP.offers.accept(id), { offer: data });
  }
}

export default new Offers();
