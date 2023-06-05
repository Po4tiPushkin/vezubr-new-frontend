import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Employees extends ApiBaseClass {
  async exportList(data) {
    return await this.req('post', CP.employees.exportEmployees, data);
  }

}

export default new Employees();
