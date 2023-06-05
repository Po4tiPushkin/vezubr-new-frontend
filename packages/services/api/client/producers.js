import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Producers extends ApiBaseClass {
  async list(data) {
    return await this.req('get', CP.producers.list);
  }

  async approve(data) {
    return await this.req('post', CP.producers.approve, data);
  }
}

export default new Producers();
