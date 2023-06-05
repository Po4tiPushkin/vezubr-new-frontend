import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Common extends ApiBaseClass {

  async dictionaries() {
    return await this.req('get', CP.common.dictionaries);
  }

  async uploadFile(data) {
    if (typeof this.uploadCancelationToken !== 'undefined') {
      this.uploadCancelationToken.cancel('Operation canceled due to new request.');
    }
    this.uploadCancelationToken = this.axios.CancelToken.source();
    return await this.req('post', CP.common.uploadFile, data, false, this.uploadCancelationToken);
  }

  async favoriteAddresses(filters) {
    return await this.req('post', CP.common.favoriteAddresses, filters);
  }

  async updateFavoriteAddress(data) {
    return await this.req('post', CP.common.favoriteAddressesUpdate, data);
  }

  async deleteFavoriteAddress(data) {
    return await this.req('post', CP.common.favoriteAddressesDelete, data);
  }

  async getSharingSettings(role) {
    return await this.req('get', CP.common.counterSettings);
  }

  async getImage(imageUrl) {
    return await this.rawRequest('get', imageUrl, { responseType: 'blob' });
  }

  async getContractList() {
    return await this.req('post', CP.contracts.list);
  }

  async getConfigDeligateForClient(expeditorId) {
    const response = await this.req('get', CP.contracts.configDeligateForClient(expeditorId));
    return response;
  }

  async setConfigDeligateForClient(expeditorId, data) {
    return await this.req('post', CP.contracts.configDeligateForClient(expeditorId), data);
  }
}

export default new Common();
