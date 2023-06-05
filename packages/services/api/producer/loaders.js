import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Loaders extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.loaders.create, data);
  }

  async list(data) {
    return await this.req('post', CP.loaders.list, data);
  }

  async info(id) {
    return await this.req('get', CP.loaders.info(id));
  }

  async update(id, data) {
    return await this.req('post', CP.loaders.update(id), data);
  }

  async setSickState(id, data) {
    return await this.req('post', CP.loaders.setSickState(id), data);
  }

  async remove({ driverId }) {
    return await this.req('post', CP.loaders.remove(driverId));
  }
}

export default new Loaders();
