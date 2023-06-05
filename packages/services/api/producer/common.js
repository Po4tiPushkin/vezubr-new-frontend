import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Common extends ApiBaseClass {
  async dictionaries() {
    return await this.req('get', CP.common.dictionaries);
  }

  async uploadFile(data) {
    return await this.req('post', CP.common.uploadFile, data);
  }

  async getImage(imageUrl) {
    return await this.rawRequest('get', imageUrl, { responseType: 'blob' });
  }

  async getContractList() {
    const response = await this.req('post', CP.contracts.list);
    return response?.data;
  }

  async getSharingSettings(role) {
    return await this.req('get', CP.common.counterSettings);
  }

  async counterPartiesList(role) {
    return await this.req('get', CP.common.counterPartiesList(role));
  }

  async getConfigDeligateForContractor(expeditorId) {
    const response = await this.req('get', CP.contracts.configDeligateForContractor(expeditorId));
    return response;
  }

  async setConfigDeligateForContractor(expeditorId, data) {
    return await this.req('post', CP.contracts.configDeligateForContractor(expeditorId), data);
  }
}

export default new Common();
