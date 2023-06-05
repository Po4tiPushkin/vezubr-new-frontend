import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Changelog extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.changelog.list, data);
  }
}

export default new Changelog();
