import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Address extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.address.list, data);
  }

  async info(id) {
    return await this.req('get', CP.address.info(id));
  }

  async contacts(id) {
    return await this.req('get', CP.address.contacts(id));
  }

  async openingHours(id) {
    return await this.req('get', CP.address.openingHours(id));
  }

  async update(data) {
    return await this.req('post', CP.address.update, data);
  }
}

export default new Address();
