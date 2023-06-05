import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Common extends ApiBaseClass {
  async dictionaries() {
    return await this.req('post', CP.common.dictionaries);
  }

  async glossary() {
    return await this.req('get', CP.common.glossary);
  }

  async startupData() {
    return await this.req('post', CP.common.startupData);
  }

  async getManagers() {
    return await this.req('get', CP.common.managers);
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

  async saveContract(data) {
    return await this.req('post', CP.contracts.save, data);
  }
}

export default new Common();
