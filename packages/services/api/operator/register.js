import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Register extends ApiBaseClass {
  async requestCode(data) {
    return await this.req('post', CP.register.requestCode, data);
  }
}

export default new Register();