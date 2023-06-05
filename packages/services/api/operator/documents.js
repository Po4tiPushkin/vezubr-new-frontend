import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Documents extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.documents.list, data);
  }
}

export default new Documents();
