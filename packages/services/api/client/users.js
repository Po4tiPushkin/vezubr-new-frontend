import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Api extends ApiBaseClass {
  async login(data) {
    return await this.req('post', CP.user.login, data);
  }

  async validate() {
    return await this.req('get', 'validate');
  }

  async register(data, type) {
    return await this.req('post', CP.user[type], data);
  }

  async requestCode(data) {
    return await this.req('post', CP.user.requestCode, data);
  }
  async confirmPhone(data) {
    return await this.req('post', CP.user.confirmPhone, data);
  }

  async companyProfile(inn) {
    return await this.req('get', `${CP.user.companyProfile}/${inn}`);
  }

  async resetPassword(email) {
    return await this.req('post', `${CP.user.forgotPassword}`, email);
  }

  async recover(data) {
    return await this.req('post', `${CP.user.recoverPassword}`, data);
  }

  async verifyEmail(code) {
    return await this.req('post', `${CP.user.verifyEmail}/${code}`, {});
  }

  async getNotificationSettings() {
    return await this.req('get', `${CP.settings.getNotificationSettings}`);
  }

  async saveNotificationSettings(data) {
    return await this.req('post', `${CP.settings.saveNotificationSettings}`, data);
  }

  async saveInterfaceSettings(data) {
    return await this.req('post', `${CP.settings.interfaceSettings}`, data);
  }

  async getInterfaceSettings() {
    return await this.req('get', `${CP.settings.interfaceSettings}`);
  }

  async checkInn(data) {
    return await this.req('post', CP.user.checkInn, data);
  }

  async joinContour(code) {
    return await this.req('post', CP.user.joinContour(code));
  }

  async switchToDelegated(contractor) {
    return await this.req('post', CP.profile.switchToDelegated, { contractor })
  }
}

export default new Api();
