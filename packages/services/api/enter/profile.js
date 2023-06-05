import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Profile extends ApiBaseClass {
  async contractor() {
    return await this.req('get', CP.profile.contractor);
  }

  async contractorUsers() {
    return await this.req('get', CP.profile.contractorUsers);
  }

  async contractorAddUser(data) {
    return await this.req('post', CP.profile.contractorUsers, data);
  }

  async contractorGetUser(id) {
    return await this.req('get', CP.profile.contractorUser(id));
  }

  async contractorEditUser({id, data}) {
    return await this.req('post', CP.profile.contractorUser(id), data);
  }

  async contractorDeleteUser(data) {
    return await this.req('post', CP.profile.contractorDeleteUser, data);
  }

  async contractorUpdate(data) {
    return await this.req('post', CP.profile.saveMain, data);
  }

  async contractorUpdateAdditional(data) {
    return await this.req('post', CP.profile.saveAdditional, data);
  }
}

export default new Profile();
