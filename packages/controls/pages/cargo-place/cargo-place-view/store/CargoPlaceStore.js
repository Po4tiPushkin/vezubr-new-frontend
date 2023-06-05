import { action, computed, observable, toJS } from 'mobx';
import { decorateCargoPlace } from '../../utils';

class CargoPlaceStore {
  @observable _data;
  @observable _loading = false;

  @observable _dataIncluded = [];
  @observable _loadingIncluded = false;

  @observable _dataDispatch = [];
  @observable _loadingDispatch = false;

  setLoaded(isLoaded) {
    return (this.isLoaded = !!isLoaded);
  }
  setLoader(loading) {
    this._loading = !!loading;
  }
  @computed
  get isLoading() {
    return this._loading;
  }
  @action
  setDirtyData(data) {
    this._data = data;
  }
  @action
  updateDirtyData(data) {
    Object.assign(this._data, data);
  }
  @computed
  get dataDirty() {
    return toJS(this._data);
  }
  @computed
  get data() {
    return decorateCargoPlace(this._data);
  }

  setLoaderIncluded(loadingIncluded) {
    this._loadingIncluded = !!loadingIncluded;
  }
  setLoadedIncluded(isLoaded) {
    return (this.isLoaded = !!isLoaded);
  }
  @computed
  get isLoadingIncluded() {
    return this._loadingIncluded;
  }
  @action
  setDirtyDataIncluded(data) {
    this._dataIncluded = data;
  }
  @action
  updateDirtyDataIncluded(data) {
    Object.assign(this._dataIncluded, data);
  }
  @computed
  get dataDirtyIncluded() {
    return toJS(this._dataIncluded);
  }
  @computed
  get dataIncluded() {
    return this._dataIncluded;
  }

  setLoaderDispatch(loadingDispatch) {
    this._loadingDispatch = !!loadingDispatch;
  }
  setLoadedDispatch(isLoaded) {
    return (this.isLoaded = !!isLoaded);
  }
  @computed
  get isLoadingDispatch() {
    return this._loadingDispatch;
  }
  @action
  setDirtyDataDispatch(data) {
    this._dataDispatch = data;
  }
  @action
  updateDirtyDataDispatch(data) {
    Object.assign(this._dataDispatch, data);
  }
  @computed
  get dataDirtyDispatch() {
    return toJS(this._dataDispatch);
  }
  @computed
  get dataDispatch() {
    return this._dataDispatch;
  }
}

export default CargoPlaceStore;
