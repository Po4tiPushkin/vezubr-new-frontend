import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Rate extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.rate.list, data);
  }

  async add(data) {
    return await this.req('post', CP.rate.add, data);
  }

  async remove(data) {
    return await this.req('post', CP.rate.remove, data);
  }

  async details(data) {
    return await this.req('post', CP.rate.details, data);
  }
}

export default new Rate();
