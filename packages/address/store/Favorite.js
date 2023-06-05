import { observable, computed, action, runInAction } from 'mobx';
import _omit from 'lodash/omit';
import { Common as CommonService } from '@vezubr/services';
import { computedFn } from 'mobx-utils';

const EXCLUDE_PARAMS_FOR_SAVE = ['position', 'attachedFiles'];

class Favorite {
  @observable _dataSourceObject = {};

  @observable _deleting = {};

  @observable _updating = {};

  @observable _loading = false;

  @observable _oldClient = undefined;

  @observable _loaded = false;

  @observable _sort = 'DESC';

  @observable _dataSource = [];

  @observable _total = 0;

  @observable _page = 1;

  @observable _addressString = '';

  @observable _id = null;

  get id() {
    return this._id;
  }

  @computed
  set id(value) {
    this._loaded = false;
    this._id = value;
    this._page = 1;
  }

  @computed
  get dataSource() {
    return this._dataSource;
  }

  @computed
  get total() {
    return this._total;
  }

  setTotal(value) {
    this._total = value;
  }

  get page() {
    return this._page;
  }

  @computed
  set page(value) {
    this._loaded = false;
    this._page = value;
  }

  get addressString() {
    return this._addressString;
  }

  @computed
  set addressString(value) {
    this._loaded = false;
    this._addressString = value;
    this._page = 1;
  }

  dataSourceFiltered = computedFn(function (excludeAddresses) {
    const dataSource = [];
    for (const idString of this._dataSource) {
      const dataSourceAddress = this._dataSource.find((el) => +idString === el.id);

      const foundExclude = excludeAddresses?.find(
        (a) => a.longitude === dataSourceAddress.longitude && a.latitude === dataSourceAddress.latitude,
      );

      if (!foundExclude) {
        dataSource.push(dataSourceAddress);
      }
    }
    return dataSource;
  });

  getData(id) {
    return this._dataSource.find((el) => el.id === +id) || null;
  }

  getDataComputed = computedFn(function (id) {
    return this._dataSource.find((el) => el.id === +id) || {};
  });

  isDeleting = computedFn(function (id) {
    return !!this._deleting[id];
  });

  isUpdating = computedFn(function (id) {
    return !!this._updating[id];
  });

  @computed
  get loading() {
    return this._loading;
  }

  @computed
  get loaded() {
    return this._loading || this._loaded;
  }

  get sort() {
    return this._sort;
  }

  @computed
  set sort(input) {
    this._loaded = false;
    this._sort = input;
  }

  @action
  async remove(id) {
    this._deleting[id] = true;
    try {
      await CommonService.deleteFavoriteAddress({ id });
      runInAction(() => {
        delete this._deleting[id];
        delete this._dataSourceObject[id];
      });
    } catch (e) {
      runInAction(() => {
        delete this._deleting[id];
      });
      throw e;
    }
  }

  @action
  async update(id, values) {
    this._updating[id] = true;

    const updateAddress = {
      ...this._dataSource.find((el) => el.id === +id),
      ...values,
    };

    try {
      await CommonService.updateFavoriteAddress(_omit(updateAddress, EXCLUDE_PARAMS_FOR_SAVE));
      runInAction(() => {
        delete this._updating[id];
        this._dataSource = this._dataSource.map((el) => {
          if (el.id === +id) {
            el = updateAddress;
          }
          return el;
        });
      });
    } catch (e) {
      runInAction(() => {
        delete this._updating[id];
      });
      throw e;
    }
  }

  @action
  async fetch(client) {
    if (APP == 'dispatcher' && !client) {
      return null;
    }
    if (APP !== 'dispatcher' && this._loaded) {
      return null;
    }
    this._dataSource = [];
    this._dataSourceObject = {};
    this._loading = true;
    this._loaded = false;

    let filters = {
      isFavorite: 0,
      orderBy: 'id',
      orderDirection: this._sort,
      status: true,
      page: this._page,
      itemsPerPage: 100,
    };
    if (this._addressString) {
      filters.addressString = this._addressString;
    }
    if (this._id && !isNaN(this._id)) {
      filters.externalId = this._id;
    }
    if (client) {
      filters.contractorId = client;
      this._oldClient = client;
    }
    try {
      const response = await CommonService.favoriteAddresses(filters);
      runInAction(() => {
        this._dataSource = response?.points;
        this._loading = false;
        this._loaded = true;
        this._total = response?.itemsCount;
      });
    } catch (e) {
      console.error(e);
      runInAction(() => {
        this._loading = false;
      });
    }
  }

  @action
  delete(id) {}
}

export default new Favorite();
