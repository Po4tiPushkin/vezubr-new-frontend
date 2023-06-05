import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Common extends ApiBaseClass {
  async dictionaries() {
    return await this.req('get', CP.common.dictionaries);
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

  async counterPartiesList(role) {
    return await this.req('get', CP.common.counterPartiesList(role));
  }

  async favoriteAddresses(filters) {
    return await this.req('post', CP.common.favoriteAddresses, filters);
  }

  async getSharingSettings() {
    return await this.req('get', CP.common.sharingSettings);
  }

  async setSharingSettings(data) {
    return await this.req('post', CP.common.sharingSettings, data);
  }

  async getContourSettings() {
    return await this.req('get', CP.common.contourSettings);
  }

  async setContourSettings(data) {
    return await this.req('post', CP.common.contourSettings, data);
  }

  async updateFavoriteAddress(data) {
    return await this.req('post', CP.common.favoriteAddressesUpdate, data);
  }

  async deleteFavoriteAddress({ id }) {
    return await this.req('delete', CP.common.favoriteAddressesDelete(id));
  }

  async getBargainSettings() {
    return await this.req('get', CP.common.bargainSettings);
  }

  async setBargainSettings(data) {
    return await this.req('post', CP.common.bargainSettings, data); 
  }

  async getSharingListProducer({ id }) {
    return await this.req('get', CP.common.sharingListProducer(id));
  }

  async deleteContractorSharing(orderId, producerIds) {
    return await this.req('post', CP.common.deleteContractorSharing(orderId), producerIds);
  }

  async createManualSharingForEdit(orderId, appoints) {
    return await this.req('post', CP.common.createManualSharingForEdit(orderId), appoints);
  }

  async cities(data) {
    return await this.req('post', CP.common.cities, data);
  }

  async getConfigDeligate(expeditorId) {
    return await this.req('get', CP.contracts.configDeligate(expeditorId));
  }

  async setConfigDeligate(expeditorId, data) {
    return await this.req('post', CP.contracts.configDeligate(expeditorId), data);
  }

  async countryList(data) {
    return await this.req('post', CP.common.countries, data);
  }
}

export default new Common();
