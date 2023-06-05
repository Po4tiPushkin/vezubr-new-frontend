import { observable, computed, action, runInAction } from 'mobx';
import { getContourTreeData } from '../utils';

import moment from 'moment';
import OrderDataBase from './OrderDataBase';

class OrderDataLoader extends OrderDataBase {
  get _excludeForSave() {
    return [
      ...super._excludeForSave,
      'contourTreeData',
      'requiredLoadersArray'
    ];
  }

  id;

  requestId = undefined;

  orderType = 2;

  bodyTypesAll;

  bodyGroupsBodyTypes;

  loadingTypes;

  transportOrderMaxWorkingDays;

  loadersOrderMaxWorkingDate;

  vehicleBodyTypeAvailableLoadingTypes;

  @observable.struct producers = [];
  
  @observable.struct _requiredLoaderSpecialities = {};

  set requiredLoaderSpecialities(requiredLoaderSpecialities) {
    let newLoaders = {}
    if (Array.isArray(requiredLoaderSpecialities)) {
      requiredLoaderSpecialities.map(({id, count}) => newLoaders[id] = parseInt(count) || null)
    } else {
      newLoaders = {
        ...newLoaders,
        ...requiredLoaderSpecialities
      }  
    }
    this.loadersCount = Object.entries(newLoaders).reduce((acc, [id, value]) => acc + value, 0)
    this._requiredLoaderSpecialities = newLoaders
  }

  @computed
  get requiredLoadersArray() {
    return Object.entries(this._requiredLoaderSpecialities).map(([key, value]) => ({
      id: key,
      count: value
    }));
  }
  
  @computed
  get requiredLoaderSpecialities() {
    return this._requiredLoaderSpecialities;
  }

  contours = [];

  @observable.struct calculation = {
    status: 'noValidData',
  };

  @observable.struct loadersCount = undefined;

  @observable.struct comment = undefined;

  @computed
  get disabledLoadingTypes() {
    return [];
  }

}

export default OrderDataLoader;
