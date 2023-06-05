import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Registries extends ApiBaseClass {
  async getRegistries(data) {
    if (typeof this.getRegistriesCancelToken !== 'undefined') {
      this.getRegistriesCancelToken.cancel('Operation canceled due to new request.');
    }
    this.getRegistriesCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.registries.getRegistries, data, false , this.getRegistriesCancelToken);
  }

  async getRegistriesDetails(id) {
    return await this.req('get', CP.registries.getRegistriesDetails(id));
  }

  async attachFiles({id, ...data}) {
    return await this.req('post', CP.registries.attachFiles(id), data);
  }

  async reform(data) {
    return await this.req('post', CP.registries.reform(data.id), {orders:data.orders});
  }

  async appointNumber({id, data}) {
    return await this.req('post', CP.registries.appointNumber(id), data);
  }

  async addOrders({id,data}) {
    return await this.req('post', CP.registries.addOrders(id),{orders:data});
  }

  async removeOrders({id,data}) {
    return await this.req('post', CP.registries.removeOrders(id),{orders:data});
  }

  async create(data) {
    return await this.req('post',CP.registries.create,data);
  }
}

export default new Registries();
