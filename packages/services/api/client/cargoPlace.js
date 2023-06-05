import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class CargoPlace extends ApiBaseClass {
  async list(data) {
    if (typeof this.cargoListCancelToken !== 'undefined') {
      this.cargoListCancelToken.cancel('Operation canceled due to new request.');
    }
    this.cargoListCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.cargoPlace.list, data, false, this.cargoListCancelToken);
  }

  async listForOrder(filter) {
    return await this.req('post', CP.cargoPlace.listForOrder, filter);
  }

  async orderView(id) {
    return await this.req('get', CP.cargoPlace.orderView(id));
  }

  async cargoIncluded(id) {
    return await this.req('get', CP.cargoPlace.cargoIncluded(id));
  }

  async info(id) {
    return await this.req('get', CP.cargoPlace.info(id));
  }
  async cargoDispatch(id) {
    return await this.req('get', CP.cargoPlace.cargoDispatch(id));
  }
  async update(updatedData) {
    return await this.req('post', CP.cargoPlace.update, updatedData);
  }
  async deleteCargoCard(id) {
    return await this.req('delete', CP.cargoPlace.deleteCargoCard(id));
  }
  async groupUpdate(data) {
    return await this.req('post', CP.cargoPlace.groupUpdate, data);
  }
  async journalList(data) {
    return await this.req('post', CP.cargoPlace.journalList, data);
  }
  async orderPlanning(data) {
    return await this.req('post', CP.cargoPlace.planning, data);
  }
}

export default new CargoPlace();
