import { Tariff as TariffService } from '@vezubr/services';

const loaderTariffList = new (class {
  _loader = null;
  _count = 0;
  _hash = null;

  load() {
    if (this._loader !== null) {
      this._count++;
      return this._loader;
    }

    this._loader = TariffService.list();
    this._count++;

    return this._loader;
  }

  async getHash() {
    if (this._hash !== null) {
      this._count++;
      return this._hash;
    }

    const response = await this.load();
    const tariffs = response?.tariffs || response?.data?.tariffs || [];
    const tariffsHash = {};

    for (const tariff of tariffs) {
      tariffsHash[tariff.id] = tariff;
    }

    this._hash = tariffsHash;
    return this._hash;
  }

  unload() {
    if (this._count) {
      this._count--;
    }

    if (!this._count) {
      this._loader = null;
      this._hash = null;
    }
  }
})();

export default loaderTariffList;
