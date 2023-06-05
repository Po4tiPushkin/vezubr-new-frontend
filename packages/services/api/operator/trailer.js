import ApiBaseClass from '../baseClass';
import { ApiConstants as CP } from './constants';

class Trailer extends ApiBaseClass {
  async create(data) {
    return await this.req('post', CP.trailer.add, data);
  }

  async info(data) {
    return await this.req('post', CP.trailer.info, data);
  }

  async update(data) {
    return await this.req('post', CP.trailer.update, data);
  }

  async list(
    data = {
      orderBy: 'plateNumber',
      orderDirection: 'DESC',
    },
  ) {
    return await this.req('post', CP.trailer.list, data);
  }

  async vehicleTrailerList(data) {
    return await this.req('post', CP.vehicle.trailerList, data);
  }

  async setMaintenance(data) {
    return await this.req('post', CP.trailer.setMaintenance, data);
  }
  async resetMaintenance(data) {
    return await this.req('post', CP.trailer.resetMaintenance, data);
  }
}

export default new Trailer();
