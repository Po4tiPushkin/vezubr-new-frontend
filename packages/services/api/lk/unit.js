import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Unit extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.unit.create, data);
  }
  async delete(id) {
    return await this.req('delete', CP.unit.delete(id))
  }
  async list(data) {
    return await this.req('post', CP.unit.list, data)
  }
  async update(id, data) {
    return await this.req('post', CP.unit.update(id), data)
  }
}

export default new Unit();
