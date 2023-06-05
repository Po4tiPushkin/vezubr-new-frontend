import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Api extends ApiBaseClass {
  async login(data) {
    return await this.req('post', CP.user.login, data);
  }

  async forgotPasswordRequest(data) {
    return await this.req('post', CP.user.forgotPasswordRequest, data);
  }

  async forgotPasswordChange(data) {
    return await this.req('post', CP.user.forgotPasswordChange, data);
  }

  async getByCode(code) {
    return await this.req('get', CP.user.getByCode(code));
  }
}

export default new Api();
