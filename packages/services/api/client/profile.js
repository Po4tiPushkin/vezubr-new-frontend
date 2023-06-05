import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Profile extends ApiBaseClass {
  async contractor() {
    return await this.req('get', CP.profile.contractor);
  }

  async contractorBalanceDetails() {
    return await this.req('get', CP.profile.balanceDetails);
  }

  async contractorTransaction(data) {
    return await this.req('get', CP.profile.contractorTransactions, { params: data });
  }

  async contractorUpdate(data) {
    return await this.req('post', CP.profile.saveMain, data);
  }

  async contractorGetUser(id) {
    return await this.req('get', CP.profile.contractorUser(id));
  }

  async contractorUpdateAdditional(data) {
    return await this.req('post', CP.profile.saveAdditional, data);
  }

  async contractorUsers() {
    return await this.req('get', CP.profile.contractorUsers);
  }

  async contractorUserUpdate({id, data}) {
    return await this.req('post', CP.profile.contractorUserUpdate(id), data);
  }

  async contractorUserAdd(data) {
    return await this.req('post', CP.profile.contractorUserAdd, data);
  }

  async contractorUserDelete(data) {
    return await this.req('post', CP.profile.contractorUserDelete, data);
  }

  async getBankInformation(bik) {
    return await this.req('get', CP.profile.getBankInformation(bik));
  }

  async passwordChange(data) {
    return await this.req('post', CP.profile.changePassword, data);
  }

  async contractorBindingCreateInit() {
    return await this.req('post', CP.profile.contractorBindingCreateInit);
  }

  async contractorBindingSetPrimaryCard(data) {
    return await this.req('post', CP.profile.contractorBindingSetPrimaryCard, data);
  }

  async contractorBindingCreateFinish(data) {
    return await this.req('post', CP.profile.contractorBindingCreateFinish, data);
  }

  async contractorBindingDelete(data) {
    return await this.req('post', CP.profile.contractorBindingDelete, data);
  }

  async getContractorConfiguration() {
    return await this.req('get', CP.profile.contractorConfiguration);
  }

  async sendContractorConfiguration(data) {
    return await this.req('post', CP.profile.contractorConfiguration, data);
  }

  async contractorEdit({id,data}) {
    return await this.req('post',CP.profile.edit(id),data)
  }

  async contractorUser(id) {
    return await this.req('get', CP.profile.contractorUser(id));
  }  

}

export default new Profile();
