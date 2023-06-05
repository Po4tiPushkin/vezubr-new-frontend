import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Agent extends ApiBaseClass {
  async add(data) {
    return await this.req('post', CP.agent.add, data);
  }

  async update(data) {
    return await this.req('post', CP.agent.update, data);
  }

  async list(data) {
    return await this.req('post', CP.agent.list, data);
  }

  async details(data) {
    return await this.req('post', CP.agent.details, data);
  }
}

export default new Agent();
