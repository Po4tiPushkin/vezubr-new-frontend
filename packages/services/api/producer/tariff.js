import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Tariff extends ApiBaseClass {
  async list(data) {
    return await this.req('post', CP.tariff.list, data);
  }

  async listForContractor(contractorId) {
    return await this.req('get', CP.tariff.listForContractor(contractorId));
  }

  async hourlyAdd(data) {
    return await this.req('post', CP.tariff.hourlyAdd, data);
  }

  async fixedAdd(data) {
    return await this.req('post', CP.tariff.fixedAdd, data);
  }

  async appoint(data) {
    return await this.req('post', CP.tariff.appoint, data);
  }

  async appointList(id, data) {
    return await this.req('post', CP.tariff.appointList(id), data);
  }

  async details({id}) {
    return await this.req('get', CP.tariff.details(id));
  }

  async createAppoints(id, data) {
    return await this.req('post', CP.tariff.createAppoints(id), data);
  }
  
  async remove(id) {
    return await this.req('delete', CP.tariff.remove(id));
  }
}

export default new Tariff();
