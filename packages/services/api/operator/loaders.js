import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Loaders extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.loaders.add, data);
  }

  async list(data) {
    return await this.req('post', CP.loaders.list, data);
  }

  async info(data) {
    return await this.req('post', CP.loaders.info, data);
  }

  async update(data) {
    return await this.req('post', CP.loaders.update, data);
  }
}

export default new Loaders();
