import ApiBaseClass from '../baseClass';
import Utils from '@vezubr/common/common/producerUtils';
import { ApiConstants as CP } from './constants';

class Profile extends ApiBaseClass {
  async contractor() {
    return await this.req('get', CP.profile.contractor)
  }

  async contractorBalance() {
    return await this.req('get', CP.profile.contractor)
  }

  async contractorUsers() {
    return await this.req('get', CP.profile.contractorUsers);
  }

  async contractorGetUser(userId) {
    return await this.req('get', CP.profile.contractorUser(userId));
  }

  async contractorChangePassword(data) {
    return await this.req('post', CP.profile.passwordChange, data);
  }

  async contractorUpdate(data) {
    return await this.req('post', CP.profile.mainSave, data);
  }

  async contractorUpdateAdditional(data) {
    return await this.req('post', CP.profile.extraSave, data);
  }

  async getBankInformation(bik) {
    return await this.req('get', CP.profile.getBankInformation(bik));
  }

  async contractorEditUser({id, data}) {
    return await this.req('post', CP.profile.contractorUser(id), data);
  }

  async contractorAddUser(data) {
    return await this.req('post', CP.profile.userAdd, data);
  }

  async contractorDeleteUser(data) {
    return await this.req('post', CP.profile.userDelete, data);
  }

  async contractorUsers() {
    return await this.req('get', CP.profile.contractorUsers);
  }

  async getDelegationSettings() {
    return await this.req('get', CP.profile.getDelegationSettings);
  }

  async setDelegation(data) {
    return await this.req('post', CP.profile.setDelegation, data);
  }
  
  async contractorEdit({id,data}) {
    return await this.req('post',CP.profile.edit(id),data)
  }
}

export default new Profile();
