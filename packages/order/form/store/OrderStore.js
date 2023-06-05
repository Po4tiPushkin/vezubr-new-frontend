import { observable, computed, action, runInAction, get } from 'mobx';
import _get from 'lodash/get';
import _compact from 'lodash/compact';
import _difference from 'lodash/difference';
import _concat from 'lodash/concat';
import _intersection from 'lodash/intersection';
import _pick from 'lodash/pick';
import { computedFn, deepObserve } from 'mobx-utils';
import { getDisabledFieldName, handleTemperatures } from '../utils';
import { DISABLED_PREFIX } from '../constants';

class OrderStore {
  @observable _data;

  _proxyData;

  @observable _errors = {};

  _validatorLazyDependencies = {};

  _disposerDeepObserve = null;

  _validators = {};

  constructor(params = {}) {
    const { DataStore, staticData, validators = {} } = params;
    this._setDataStore(new DataStore(staticData));
    this.setValidators(validators);
  }

  destroy() {
    if (this._disposerDeepObserve) {
      this._disposerDeepObserve();
    }
  }

  setValidators(validators = {}) {
    this._validators = validators;
  }

  @action
  _setDataStore(data) {
    this._data = data;

    this._disposerDeepObserve = deepObserve(data, (change, path, root) => {
      const isDeep = !!path;
      let field = (isDeep ? path.split('/')[0] : change.name).replace(/^_/, '');

      let newValue = change.newValue;

      if (isDeep) {
        newValue = root[field];
      }

      this._validateFieldWithDependencies(field, newValue);
    });

    this._proxyData = new Proxy(this._data, {
      get: (target, name) => {
        return target[name];
      },

      set: (obj, prop, value) => {
        throw new Error('use .setDataItem method');
      },
    });
  }

  @action
  clearErrors() {
    this._errors = {};
  }

  @action
  clearError(errorField) {
    delete this._errors[errorField];
  }

  get data() {
    return this._proxyData;
  }

  getError = computedFn(function (name) {
    return this._errors[name];
  });

  getDataItemNoComputed(name) {
    return this._data[name];
  }

  getDataItem = computedFn(function (name) {
    return this._data[name];
  });

  getDataItemPath = computedFn(function (path) {
    return _get(this._data, path);
  });

  isDisabled = computedFn(function (name) {
    const getterDisabled = getDisabledFieldName(name);
    return this._data[getterDisabled];
  });

  @action
  _getDataForValidators(name) {
    const _this = this;

    return new Proxy(this._data, {
      get: (target, property) => {
        if (typeof _this._validatorLazyDependencies[property] === 'undefined') {
          _this._validatorLazyDependencies[property] = {};
        }
        _this._validatorLazyDependencies[property][name] = true;
        return target[property];
      },

      set: (obj, prop, value) => {
        throw new Error('this data only for read ');
      },
    });
  }

  @action
  checkField(name, value) {
    if (this._validators[name]) {
      return this._validators[name](value, this._getDataForValidators(name));
    }
    return null;
  }

  @action
  _validateFieldWithDependencies(name, value, ignoreDisabled) {
    const fieldError = this.checkField(name, value);

    const getterDisabled = getDisabledFieldName(name);
    const isDisabled = this.data[getterDisabled]

    if (!ignoreDisabled || (ignoreDisabled && !isDisabled)) {
      this._errors[name] = fieldError;
    }

    if (this._validatorLazyDependencies[name]) {
      for (const depName of Object.keys(this._validatorLazyDependencies[name])) {
        this._validateFieldWithDependencies(depName, this.data[depName], ignoreDisabled);
      }
    }

    return this._errors[name];
  }

  get availablePropsForUpdate() {
    return Object.getOwnPropertyNames(this._data).filter(
      (key) => key.indexOf('_') !== 0 && key.indexOf(DISABLED_PREFIX) !== 0,
    );
  }

  @action
  checkFieldWithDependencies(name, value, ignoreDisabled = true) {
    return this._validateFieldWithDependencies(name, value, ignoreDisabled);
  }

  @action
  setDataItem(name, value) {
    this.setData({ [name]: value });
  }

  @action
  startBulkUpdate() {
    this._data._bulkUpdate = true;
  }

  @action
  endBulkUpdate() {
    this._data._bulkUpdate = false;
  }

  @action
  setData(params) {
    const availableProps = this.availablePropsForUpdate;
    const inputKeys = Object.keys(params);
    const props = _intersection(availableProps, inputKeys);
    Object.assign(this._data, _pick(params, props));
  }

  @action
  _getSaveProps({ excludeFields = [], onlyFields } = {}) {
    let props;

    if (onlyFields) {
      props = onlyFields;
    } else {
      props = Object.getOwnPropertyNames(this.data).filter(
        (key) => key.indexOf('_') !== 0 && key.indexOf(DISABLED_PREFIX) !== 0,
      );
      props = _difference(props, _compact(_concat(this.data._excludeForSave || [], excludeFields)));
    }

    return props;
  }

  @action
  getDirtyData({ excludeFields = [], onlyFields } = {}) {
    const props = this._getSaveProps({ excludeFields, onlyFields });

    const values = {};
    for (const prop of props) {
      const value = this.data[prop];
      if (value) {
        values[prop] = value;
      }
    }

    return values;
  }

  @action
  getValidateData({ excludeFields = [], onlyFields, ignoreDisabled = true } = {}) {
    const props = this._getSaveProps({ excludeFields, onlyFields });

    const values = {};
    for (const prop of props) {

      const value = this.data[prop];
      values[prop] = value;

      this._validateFieldWithDependencies(prop, value, ignoreDisabled);

    }

    handleTemperatures(values);
    if (values.vatRate > 0) {
      values.clientRate = Math.floor(values.clientRateVat);
      values.clientRateProducers = Math.floor(values.clientRateProducersVat);
      if (values.bidStep) {
        values.bidStep = Math.floor(values.bidStepVat);
      }
    }
    delete values.bidStepVat;
    delete values.vatRate
    delete values.clientRateVat
    delete values.clientRateProducersVat;
    const customPropsErrors = {};
    if (Array.isArray(values.customProperties)) {
      values.customProperties = values.customProperties.filter(el => Array.isArray(el?.values) &&
        el?.values.filter(item => item || item === 0).length
      );
      this._data.orderRequiredCustomProperties.forEach(el => {
        const propValues = values.customProperties.find(item => el.latinName === item.latinName)?.values;
        if (!propValues || !propValues.find(item => item || item === 0)) {
          customPropsErrors[el.latinName] = 'Обязательное поле'
        }
      })
      this._data.customPropertiesErrors = customPropsErrors;
    }
    else if (!this._data.customProperties) {
      this._data.orderRequiredCustomProperties.forEach(el => {
        customPropsErrors[el.latinName] = 'Обязательное поле'
      })
      this._data.customPropertiesErrors = customPropsErrors;
    }

    if (this._data.republishing) {
      this._data.customPropertiesErrors = {};
      values.isClientInsurance = this._data.isClientInsurance;
    }

    const hasError = _compact(props.map((name) => this._errors[name])).length > 0 ||
      Object.values(this._data?.customPropertiesErrors).length > 0;

    return {
      values,
      hasError,
    };
  }
}

export default OrderStore;
