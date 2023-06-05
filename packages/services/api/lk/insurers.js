import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Insurers extends ApiBaseClass {
  async info(id) {
    return await this.req('get', CP.insurers.info(id));
  }
  async list() {
    return await this.req('get', CP.insurers.list,);
  }
  async contractCreate(data) {
    return await this.req('post', CP.insurers.contractCreate, data);
  }
  async contractDelete(id) {
    return await this.req('post', CP.insurers.contractDelete(id));
  }
  async contracts(id) {
    return await this.req('get', CP.insurers.contracts(id));
  }
  async contract(id) {
    return await this.req('get', CP.insurers.contract(id));
  }
  async deactivateContract(contractId) {
    return await this.req('post', CP.insurers.deactivateContract(contractId));
  }

  async insuredOrders(id, filters) {
    if (typeof this.insuredOrdersCancelToken !== 'undefined') {
      this.insuredOrdersCancelToken.cancel('Operation canceled due to new request.');
    }
    this.insuredOrdersCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.insurers.insuredOrders(id), filters, false, this.insuredOrdersCancelToken);
  }

  async exportList(data) {
    return await this.req('post', CP.insurers.insuredOrdersExport, data);
  }

}

export default new Insurers();
