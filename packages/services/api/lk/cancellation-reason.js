import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class CancellationReason extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.cancellationReason.create, data);
  }
  async delete(id) {
    return await this.req('delete', CP.cancellationReason.detail(id))
  }
  async list(data) {
    return await this.req('post', CP.cancellationReason.list, data)
  }
  async detail(id) {
    return await this.req('get', CP.cancellationReason.detail(id))
  }
}

export default new CancellationReason();
