import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class CargoPlace extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.cargoPlace.list, data);
  }
  async orderView(id) {
    return await this.req('get', CP.cargoPlace.orderView(id));
  }

  async cargoIncluded(id) {
    return await this.req('get', CP.cargoPlace.cargoIncluded(id));
  }

  async groupUpdate({ orderId, cargoPlacesUpdate }) {
    return await this.req('post', CP.cargoPlace.groupUpdate(orderId), { cargoPlacesUpdate });
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
}

export default new CargoPlace();
