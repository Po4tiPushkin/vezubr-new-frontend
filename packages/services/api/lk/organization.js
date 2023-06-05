import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Organization extends ApiBaseClass {
  async getOrganization(data) {
    if (typeof this.organizationCancelToken !== 'undefined') {
      this.organizationCancelToken.cancel('Operation canceled due to new request.');
    }
    this.organizationCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.organization.getOrganization, { inn: data }, false, this.organizationCancelToken);
  }
  async getOrganizationFull(data) {
    if (typeof this.organizationCancelToken !== 'undefined') {
      this.organizationCancelToken.cancel('Operation canceled due to new request.');
    }
    this.organizationCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.organization.getOrganization, data, false, this.organizationCancelToken);
  }
}

export default new Organization();