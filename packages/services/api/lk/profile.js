import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Profile extends ApiBaseClass {
  async contractor() {
    return await this.req('get', CP.profile.contractor);
  }

  async contractorUsers(data) {
    return await this.req('post', CP.profile.contractorUsers, data);
  }

  async contractorAddUser(data) {
    return await this.req('put', CP.profile.contractorUsers, data);
  }

  async contractorGetUser(id) {
    return await this.req('get', CP.profile.contractorUser(id));
  }

  async contractorEditUser({ id, data }) {
    return await this.req('put', CP.profile.contractorUser(id), data);
  }

  async contractorDeleteUser(data) {
    return await this.req('post', CP.profile.contractorDeleteUser, data);
  }

  async contractorGroupAdd(data) {
    return await this.req('post', CP.profile.contractorGroupAdd, data);
  }

  async contractorGetGroup(id) {
    return await this.req('get', CP.profile.contractorGroup(id));
  }

  async contractorGroupsList(data) {
    return await this.req('post', CP.profile.contractorGroups, data);
  }

  async contractorDeleteGroup(id) {
    return await this.req('delete', CP.profile.contractorGroup(id));
  }

  async contractorUpdate(data) {
    return await this.req('post', CP.profile.saveMain, data);
  }

  async contractorUpdateAdditional(data) {
    return await this.req('post', CP.profile.saveAdditional, data);
  }

  async contractorChangePassword(data) {
    return await this.req('post', CP.profile.contractorChangePassword, data)
  }

  async getContractorConfiguration() {
    return await this.req('get', CP.profile.contractorConfiguration);
  }

  async getBankInformation(bik) {
    return await this.req('get', CP.profile.getBankInformation(bik));
  }

  async sendContractorConfiguration(data) {
    return await this.req('post', CP.profile.contractorConfiguration, data);
  }

  async contractorEdit({ id, data }) {
    return await this.req('post', CP.profile.edit(id), data)
  }

  async getDelegationSettings() {
    return await this.req('get', CP.profile.getDelegationSettings);
  }

  async setDelegation(data) {
    return await this.req('post', CP.profile.setDelegation, data);
  }

  async getNumeratorTemplate() {
    return await this.req('get', CP.profile.numerator);
  }

  async setNumeratorTemplate(data) {
    return await this.req('post', CP.profile.numerator, data);
  }

  async getCustomPropsList() {
    return await this.req('get', CP.profile.customPropsList);
  }

  async createCustomProps(data) {
    return await this.req('post', CP.profile.customPropsCreate, data);
  }

  async customPropsEdit(id, data) {
    return await this.req('post', CP.profile.customPropsEdit(id), data);
  }

  async customPropsInfo(id) {
    return await this.req('get', CP.profile.customPropsInfo(id));
  }

  async customPropsDelete(id) {
    return await this.req('delete', CP.profile.customPropsDelete(id));
  }

  async getOrderReportOptions() {
    return await this.req('get', CP.profile.orderReportOptions);
  }

  async setOrderReportOptions(data) {
    return await this.req('post', CP.profile.orderReportOptions, data);
  }

  async refreshOrganization(data) {
    return await this.req('post', CP.profile.refreshOrganization, data);
  }

  async addGroupsToEmployee(data) {
    return await this.req('post', CP.profile.addGroupsToEmployee, data);
  }
}

export default new Profile();
