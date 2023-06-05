import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Organization extends ApiBaseClass {
  async getOrganization(data) {
    return await this.req('post', CP.organization.getOrganization, { inn: data });
  }
}

export default new Organization();