import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Contour extends ApiBaseClass {
  async add(data) {
    return await this.req('post', CP.contour.add, data);
  }

  async details(data) {
    return await this.req('post', CP.contour.details, data);
  }

  async update(data) {
    return await this.req('post', CP.contour.update, data);
  }

  async list(data) {
    return await this.req('post', CP.contour.list, data);
  }
}

export default new Contour();
