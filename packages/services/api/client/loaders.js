import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Loaders extends ApiBaseClass {

  async createAndPublish(data) {
    return await this.req('post', CP.loaders.createAndPublish, data);
  }
  async preCalculate(data) {
    if (typeof this.preCalculateCancelToken !== 'undefined') {
      this.preCalculateCancelToken.cancel('Operation canceled due to new request.');
    }
    this.preCalculateCancelToken = this.axios.CancelToken.source();
    return await this.req('post', CP.loaders.calculate, data, false, this.preCalculateCancelToken);
  }
}

export default new Loaders();
