import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Contour extends ApiBaseClass {
  async joinContour(code) {
    return await this.req('post', CP.contour.join(code));
  }
}

export default new Contour();