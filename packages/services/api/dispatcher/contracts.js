import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Contracts extends ApiBaseClass {
  async contourList(data) {
    return await this.req('post', CP.contracts.contourList, data);
  }
  
  async agreementsWithoutContractList(data) {
    return await this.req('post', CP.contracts.agreementsWithoutContractList, data);
  }

  async assignAgreementToContract(id, data) {
    return await this.req('post', CP.contracts.assignAgreementToContract(id), data);
  }

  async createContract(data) {
    return await this.req('post', CP.contracts.createContract, data);
  }

  async updateContract({id, data}) {
    return await this.req('post', CP.contracts.updateContract(id), data);
  }

  async createAgreement(data) {
    return await this.req('post', CP.contracts.createAgreement, data);
  }

  async deleteAgreement({id}) {
    return await this.req('delete', CP.contracts.deleteAgreement(id));
  }

  async getContract(id) {
    return await this.req('get', CP.contracts.getContract(id));
  }

  async getProfile(id) {
    return await this.req('get', CP.contracts.getProfile(id));
  }

  async assignTariff(data) {
    return await this.req('post', CP.contracts.assignTariff, data);
  }

  async tariffsForAssign(id) {
    return await this.req('get', CP.contracts.tariffsForAssign(id));
  }
  
  async margin(id, data) {
    return await this.req('post', CP.contracts.margin(id), data);
  }

  async endContract(id) {
    return await this.req('post', CP.contracts.endContract(id))
  }
}

export default new Contracts();
