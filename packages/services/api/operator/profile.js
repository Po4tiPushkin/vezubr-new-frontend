import ApiBaseClass from '../baseClass';
import Utils from '@vezubr/common/common/producerUtils';
import { ApiConstants as CP } from './constants';

class Profile extends ApiBaseClass {
  async companyInfo() {
    return await this.req('post', CP.profile.companyInfo);
  }

  async companySecondaryInfo() {
    return await this.req('post', CP.profile.companySecondaryInfo);
  }

  async users() {
    return await this.req('post', CP.profile.usersList);
  }

  async mainSave(data) {
    return await this.req('post', CP.profile.mainSave, data);
  }

  async extraSave(data) {
    return await this.req('post', CP.profile.extraSave, data);
  }

  async contractorUserUpdate(userId, data) {
    return await this.req('post', CP.profile.userUpdate, Utils.serializeUpdate(userId, data));
  }

  async contractorUserAdd(data) {
    return await this.req('post', CP.profile.userAdd, Utils.serializeAdd(data));
  }

  async contractorUserDelete(data) {
    return await this.req('post', CP.profile.userDelete, Utils.serializeDeletingData(data));
  }
}

export default new Profile();
