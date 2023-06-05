import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Cartulary extends ApiBaseClass {
  async getCartulary(data) {
    return await this.req('post', CP.cartulary.getCartulary, data);
  }
  async addCartulary(data) {
    return await this.req('post', CP.cartulary.addCartulary, {
      orders: data,
    });
  }
}

export default new Cartulary();
