import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Drivers extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.drivers.list, data);
  }
}

export default new Drivers();
