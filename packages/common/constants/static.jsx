import moment from 'moment';
import * as Const from './constants';
import * as TableConst from './tableConstants';
import * as FilterConst from './filterConstants';
import * as MapFiltersConst from './mapFilters';

const timeInterval = () => {
  const gap = 30;
  const start = moment().startOf('day');
  const end = moment().endOf('day');

  start.minutes(Math.ceil(start.minutes() / gap) * gap);

  const result = [];

  const current = moment(start);

  while (current <= end) {
    result.push(current.format('HH:mm'));
    current.add(gap, 'minutes');
  }

  return result;
};

const TIME_INTERVAL = timeInterval();

class Static {
  static customerTypes() {
    return Const.CUSTOMER_TYPES[APP];
  }

  static get patterns() {
    return Const.PATTERNS;
  }

  static get times() {
    return TIME_INTERVAL;
  }

  /**
   * Some parameters are designed as object but they are accept integer or string. Its' need for handling UI stuff, during request mapOrderData in common/utils.jsx will handle it.
   * @returns {{toStartAtDate, toStartAtTime, orderIdentifier, comment, sanitaryBookIsRequired, sanitaryPassportRequired, rampCompatibilityRequired, palletJackIsRequired, fasteningIsRequired, vehicleType, bodyType, assessedCargoValue, cargoTypes, conicsIsRequired, loadersCountRequired, loadersRequiredOnAddress, loadersTime, addresses, maxHeightFromGroundInCm, vehicleMinHeight, vehicleMinWidth}}
   */
  static get orderFields() {
    return Const.ORDER_DEF_FORMAT;
  }

  static get userFields() {
    return Const.USER_DEF_FORMAT;
  }

  static get producerUserFields() {
    return Const.PRODUCER_USER_DEF_FORMAT;
  }

  static get operatorUserFields() {
    return Const.OPERATOR_USER_DEF_FORMAT;
  }

  static get loaderFields() {
    return Const.LOADERS_DEF_FORMAT;
  }

  static get addressFields() {
    return Const.ADDRESS_DEF_FORMAT;
  }

  static getPattern(val) {
    return Const.PATTERNS[val];
  }

  static tableHeaders(val, type) {
    return TableConst.getTableHeaders(val, type);
  }

  static getTableRows(val, type) {
    return TableConst.getTableRows(val, type);
  }

  static getCheckTable(name) {
    return TableConst.checkTable(name);
  }

  static get producerTransportFields() {
    return Const.PRODUCER_TRANSPORT_DEF_FORMAT;
  }

  static get producerWagonFields() {
    return Const.PRODUCER_WAGON_DEF_FORMAT;
  }

  static get producerDriverFields() {
    return Const.PRODUCER_DRIVER_DEF_FORMAT;
  }

  static get producerTractorFields() {
    return Const.PRODUCER_TRACTOR_DEF_FORMAT;
  }

  static getFilterTypes(type) {
    let result;
    switch (type) {
      case 'orders':
        result = FilterConst.FILTERS_LIST;
        break;
      case 'producerOrders':
        result = FilterConst.PRODUCER_ORDER_FILTER_LIST;
        break;
      case 'operatorOrders':
        result = FilterConst.OPERATOR_ORDER_FILTER_LIST;
        break;
      case 'invoices':
        result = FilterConst.BILLS_FILTERS_LIST;
        break;
      case 'deferred':
        result = FilterConst.DEFERRED_FILTERS_LIST;
        break;
      case 'auctions':
        result = FilterConst.AUCTIONS_FILTERS_LIST;
        break;
      case 'transports':
        result = FilterConst.TRANSPORTS_FILTER_LIST;
        break;
      case 'drivers':
        result = FilterConst.DRIVER_FILTER_LIST;
        break;
      case 'tractors':
        result = FilterConst.TRACTORS_FILTER_LIST;
        break;
      case 'registries':
        result = FilterConst.REGISTRIES_FILTER_LIST;
        break;
      case 'cartulary':
        result = FilterConst.CARTULARY_FILTER_LIST;
        break;
      case 'documents':
        result = FilterConst.DOCUMENTS_FILTER_LIST;
        break;
      case 'trailers':
        result = FilterConst.TRAILERS_FILTER_LIST;
        break;
      case 'loaders':
        result = FilterConst.LOADERS_FILTER_LIST;
        break;
      case 'clients':
        result = FilterConst.CLIENTS_FILTER_LIST;
        break;
      case 'producer':
        result = FilterConst.PRODUCER_FILTER_LIST;
        break;
      case 'operatorTransports':
        result = FilterConst.OPERATOR_TRANSPORTS_FILTER_LIST;
        break;
      case 'operatorDrivers':
        result = FilterConst.OPERATOR_DRIVER_FILTER_LIST;
        break;
      default:
        result = FilterConst.FILTERS_LIST;
    }
    return result;
  }

  static getMapFilters(type = 'client', subType) {
    if (subType) {
      return MapFiltersConst.MAP_FILTERS[type][subType];
    }
    return MapFiltersConst.MAP_FILTERS[type];
  }
}

export default Static;
