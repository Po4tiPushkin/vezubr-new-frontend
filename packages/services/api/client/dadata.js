import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class DaData extends ApiBaseClass {
  async inn(data) {
    return await this.req('post', CP.getDadata.inn, { query: data });
  }

  async fio(data) {
    return await this.req('post', CP.getDadata.fio, { query: data });
  }

  async email(data) {
    return await this.req('post', CP.getDadata.email, { query: data });
  }

  async address(data) {
    return await this.req('post', CP.getDadata.address, { query: data });
  }

  async bank(data) {
    return await this.req('post', CP.getDadata.bank, { query: data });
  }

  async fms_unit(data) {
    return await this.req('post', CP.getDadata.fms_unit, { query: data });
  }
}

export default new DaData('dadata');
