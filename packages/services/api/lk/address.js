import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Address extends ApiBaseClass {
  async list(data) {
    if (typeof this.addressListCancelToken !== 'undefined') {
      this.addressListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.addressListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.address.list, data, false, this.addressListCancelToken);
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

  async updateOpeningHours(id, data) {
    return await this.req('post', CP.address.openingHours(id), data);
  }

  async update(data) {
    return await this.req('post', CP.address.update, data);
  }
  async delete(id) {
    return await this.req('delete', CP.address.delete(id));
  }

  async regionsList(data) {
    return await this.req('get', CP.address.regionsList, data);
  }

  async journalList(data) {
    return await this.req('post', CP.address.journalList, data);
  }

  async groupUpdate(data) {
    return await this.req('post', CP.address.groupUpdate, data);
  }

  async exportList(data) {
    return await this.req('post', CP.address.exportList, data);
  }

  async listByCoordinates(data) {
    return await this.req('post', CP.address.listByCoordinates, data);
  }
}

export default new Address();
