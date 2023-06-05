import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Vehicle extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.vehicle.list, data);
  }

  async types() {
    return await this.req('get', CP.vehicle.types);
  }
}

export default new Vehicle();
