import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Register extends ApiBaseClass {
  async requestCode(data) {
    return await this.req('post', CP.register.requestCode, data);
  }

  async confirmCode(data) {
    return await this.req('post', CP.register.confirmCode, data);
  }

  async completeRegistration(data) {
    return await this.req('post', CP.register.completeRegistration, data);
  }

  async checkInn(data) {
    return await this.req('post', CP.register.checkInn, data);
  }
}

export default new Register();