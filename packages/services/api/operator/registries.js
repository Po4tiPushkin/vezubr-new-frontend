import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Registries extends ApiBaseClass {
  async getRegistries(data) {
    return await this.req('post', CP.registries.getRegistries, data);
  }

  async getRegistriesDetails(data) {
    return await this.req('post', CP.registries.getRegistriesDetails, data);
  }

  async attachFiles(data) {
    return await this.req('post', CP.registries.attachFiles, data);
  }

  async reform(data) {
    return await this.req('post', CP.registries.reform, data);
  }

  async appointNumber(data) {
    return await this.req('post', CP.registries.appointNumber, data);
  }
}

export default new Registries();
