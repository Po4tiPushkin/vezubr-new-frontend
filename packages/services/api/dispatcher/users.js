import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Api extends ApiBaseClass {
  async login(data) {
    return await this.req('post', CP.user.login, data);
  }

  async saveInterfaceSettings(data) {
    return await this.req('post', `${CP.settings.interfaceSettings}`, data);
  }

  async getInterfaceSettings() {
    return await this.req('get', `${CP.settings.interfaceSettings}`);
  }

  async getContractorConfiguration() {
    return await this.req('get', `${CP.profile.contractorConfiguration}`);
  }

  async saveContractorConfiguration(data) {
    return await this.req('post', `${CP.profile.contractorConfiguration}`, data);
  }

  async getNotificationSettings() {
    return await this.req('get', `${CP.settings.getNotificationSettings}`);
  }

  async saveNotificationSettings(data) {
    return await this.req('post', `${CP.settings.saveNotificationSettings}`, data);
  }

  async switchToDelegated(contractor) {
    return await this.req('post', CP.profile.switchToDelegated, { contractor })
  }

  async joinContour(code) {
    return await this.req('post', CP.user.joinContour(code));
  }
}

export default new Api();
