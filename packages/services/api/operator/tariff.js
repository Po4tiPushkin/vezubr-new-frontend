import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Tariff extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.tariff.list, data);
  }

  async hourlyAdd(data) {
    return await this.req('post', CP.tariff.hourlyAdd, data);
  }

  async fixedAdd(data) {
    return await this.req('post', CP.tariff.fixedAdd, data);
  }

  async appoint(data) {
    return await this.req('post', CP.tariff.appoint, data);
  }

  async details(data) {
    return await this.req('post', CP.tariff.details, data);
  }
}

export default new Tariff();
