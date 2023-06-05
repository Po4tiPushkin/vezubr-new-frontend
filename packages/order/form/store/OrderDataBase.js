import { observable, computed, runInAction } from 'mobx';
import _intersection from 'lodash/intersection';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/contour';
import _difference from 'lodash/difference';
import * as Address from '@vezubr/address';
import { getAvailableLoadingTypesByIntersection, contourTreeToData, getContourTreeData } from '../utils';
import moment from 'moment';

function geTimeZoneByAddresses(addresses) {
  return addresses && addresses.length && Address.Utils.getRealAddresses(addresses)?.[0]?.timeZoneId;
}

function getMomentTimeZoneByAddresses(date, dateFormat, addresses) {
  const timeZoneId = geTimeZoneByAddresses(addresses);

  return timeZoneId ? moment.tz(date, dateFormat, timeZoneId) : moment(date, dateFormat);
}

function getRealAddressesPosition(addresses) {
  return (addresses || [])
    .filter((a) => !a.isNew)
    .map((a, index) => ({ ...a, position: index + 1 }))
}

class OrderDataBase {
  get _excludeForSave() {
    return [
      'bodyTypesAll',
      'bodyGroupsBodyTypes',
      'loadingTypes',
      'vehicleBodyTypeAvailableLoadingTypes',
      'bodyGroup',
      'contourTree',
      'calculation',
      'isDisabledMain',
      'cargoPlacesStore',
      'cargoPlacesAll',
      'producers',
      'clientRatePlaceholder',
      'clientRateVatPlaceholder',
      'preliminaryRate',
      'contours',
      'disabledLoadingTypes',
      'pickedDate',
      'cargoPlacesResolve',
      'transportOrderMaxWorkingDays',
      'loadersOrderMaxWorkingDate',
      'useClientRate',
      'bargainsEndDate',
      'bargainsEndTime',
      'bargainsEndDateTimePicker',
      'tradingPlatforms',
      'autoRepublishContourTree',
      'autoRepublishContourTreeData',
      'currentUser',
      'regular',
      'useBidStep',
      "insuranceAmount",
      "republishing",
      "customPropertiesErrors",
      "orderRequiredCustomProperties",
      "numerationType",
      "isClientInsurance"
    ];
  }

  id;

  requestId = undefined;

  @observable orderType = undefined;

  publishingType = undefined;

  insuranceAmount = null;

  @observable.struct isInsuranceRequired = false;

  @observable.struct clientNumber = undefined;

  bodyTypesAll;

  bodyGroupsBodyTypes;

  loadingTypes;

  vatRate = undefined;

  vehicleBodyTypeAvailableLoadingTypes;

  transportOrderMaxWorkingDays;

  loadersOrderMaxWorkingDate;

  orderRequiredCustomProperties = [];

  currentUser = undefined;

  _bulkUpdate = false;

  @observable.struct responsibleEmployees = [];

  @observable.struct isLiftingValidationRequired = true;

  @observable.struct producers = [];

  @observable.struct status = undefined;

  @observable.struct _clientRate = undefined;

  @observable.struct pointChangeType = undefined;

  @observable.struct _customProperties = undefined;

  @observable isClientInsurance

  @observable _customPropertiesErrors = {};

  @computed
  get customProperties() {
    return this._customProperties
  }

  set customProperties(customProperties) {
    this._customProperties = customProperties;
    this._customPropertiesErrors = {};
  }

  @computed get customPropertiesErrors() {
    return this._customPropertiesErrors;
  }

  set customPropertiesErrors(values) {
    this._customPropertiesErrors = values;
  }

  @computed
  get client() {
    return this._client || null
  }

  set client(client) {
    this.addresses = [];
    this._client = client;
  }

  @computed
  get clientRate() {
    return this.publishingType === "tariff" ? null : this._clientRate
  }

  set clientRate(clientRate) {
    if (clientRate) {
      const newSumWithoutVat = parseInt(clientRate)
      const newSumWithVat = (newSumWithoutVat + (newSumWithoutVat * this.vatRate / 100))
      this._clientRate = newSumWithoutVat
      this._clientRateVat = newSumWithVat
    } else {
      this._clientRate = undefined
      this._clientRateVat = undefined
    }
  }

  @observable.struct _clientRateVat = undefined;

  @computed
  get clientRateVat() {
    return this.publishingType === "tariff" ? null : this._clientRateVat
  }

  set clientRateVat(clientRateVat) {
    if (clientRateVat) {
      const newSumWithVat = parseInt(clientRateVat)
      const newSumWithoutVat = (newSumWithVat * (100 / (100 + this.vatRate)))
      this._clientRate = newSumWithoutVat
      this._clientRateVat = newSumWithVat
    } else {
      this._clientRate = undefined
      this._clientRateVat = undefined
    }
  }

  @observable.struct clientRatePlaceholder = undefined;

  @observable.struct clientRateVatPlaceholder = undefined;

  @observable.struct preliminaryRate = undefined;

  @observable.struct cargoPlacesAll = [];

  @observable.struct selectingStrategy = 1;

  @observable.struct _useClientRate = false;

  @observable.struct _useBidStep = false;

  @observable.struct bargainsEndDate = undefined;

  @observable.struct bargainsEndTime = undefined;

  @observable.struct disabledLoadingTypesByVehicleAndBody = [];

  @observable.struct tradingPlatforms = [];

  @observable.struct vehicleTemperatureMin = null;

  @observable.struct vehicleTemperatureMax = null;

  @observable.struct isThermograph = false;

  _cargoPlaces = observable.map({});

  contours = [];

  @observable.struct _bidStep = undefined;

  @observable.struct _bidStepVat = undefined;

  @computed
  get bidStep() {
    return this._bidStep
  }

  set bidStep(step) {
    if (step) {
      const newSumWithoutVat = parseInt(step);
      const newSumWithVat = (newSumWithoutVat + (newSumWithoutVat * this.vatRate / 100));
      this._bidStep = newSumWithoutVat;
      this._bidStepVat = newSumWithVat;
    } else {
      this._bidStep = undefined
      this._bidStepVat = undefined
    }
  }

  @computed
  get bidStepVat() {
    return this._bidStepVat
  }

  set bidStepVat(stepVat) {
    if (stepVat) {
      const newSumWithVat = parseInt(stepVat)
      const newSumWithoutVat = (newSumWithVat * (100 / (100 + this.vatRate)))
      this._bidStep = newSumWithoutVat
      this._bidStepVat = newSumWithVat
    } else {
      this._bidStep = undefined
      this._bidStepVat = undefined
    }
  }

  constructor(params) {
    runInAction(() => {
      if (params) {
        Object.assign(this, params);
      }
    });
  }

  @observable.struct calculation = {
    status: 'noValidData',
  };

  @observable.struct _toStartAtDate = undefined;

  @observable.struct toStartAtTime = undefined;

  @computed
  get useClientRate() {
    return this._useClientRate;
  }

  set useClientRate(flag) {
    this._useClientRate = flag;

    if (!flag) {
      this.clientRate = undefined;
    }
  }

  @computed
  get useBidStep() {
    return this._useBidStep;
  }

  set useBidStep(flag) {
    this._useBidStep = flag;

    if (!flag) {
      this.bidStep = undefined;
    }
  }

  @computed
  get isDisabledMain() {
    const { status } = this;
    return status && status > 200;
  }

  @computed
  get pickedDate() {
    const { toStartAtDate, toStartAtTime, addresses } = this;
    if (toStartAtDate && toStartAtDate) {
      const dateFormat = 'YYYY-MM-DD HH:mm';
      const dateString = `${toStartAtDate} ${toStartAtTime}`;
      return getMomentTimeZoneByAddresses(dateString, dateFormat, addresses);
    }

    return null;
  }

  @computed
  get bargainsEndDateTimePicker() {
    const { bargainsEndDate, bargainsEndTime } = this;
    if (bargainsEndDate && bargainsEndTime) {
      return moment(`${this.bargainsEndDate} ${this.bargainsEndTime}`, 'YYYY-MM-DD HH:mm:ss');
    }
    return null;
  }

  @computed
  get bargainsEndDatetime() {
    const { bargainsEndDateTimePicker } = this;

    if (bargainsEndDateTimePicker) {
      return bargainsEndDateTimePicker.clone().tz(this?.addresses?.[0].timeZoneId || moment.tz.guess()).format('YYYY-MM-DD HH:mm:ss');
    }

    return undefined;
  }

  set bargainsEndDatetime(dateTime) {
    const currDate = moment.utc(dateTime, 'YYYY-MM-DD HH:mm:ss').local();

    this.bargainsEndDate = currDate.format('YYYY-MM-DD');
    this.bargainsEndTime = currDate.format('HH:mm:ss');
  }

  set cargoPlaces(cargoPlaces) {
    for (const p of cargoPlaces) {
      const { cargoPlaceId, ...otherProps } = p;
      this._cargoPlaces.set(cargoPlaceId, otherProps);
    }
  }

  @computed
  get cargoPlacesStore() {
    return this._cargoPlaces;
  }

  @computed
  get cargoPlaces() {
    return Array.from(this._cargoPlaces)
      .map(([cargoPlaceId, v]) => ({ ...v, cargoPlaceId }))
      .filter(({ departurePointPosition, arrivalPointPosition }) => !!departurePointPosition && !!arrivalPointPosition);
  }

  @computed
  get toStartAtDate() {
    return this._toStartAtDate;
  }

  @computed
  get disabled__toStartAtTime() {
    return this.isDisabledMain;
  }

  @computed
  get disabled__toStartAtDate() {
    return this.isDisabledMain;
  }

  set toStartAtDate(value) {

    this._toStartAtDate = value;

    if (value && !this._bulkUpdate && !this.regular) {
      const { addresses } = this;
      const valueMoment = getMomentTimeZoneByAddresses(value, 'YYYY-MM-DD', addresses);

      if (valueMoment.isValid()) {
        if (valueMoment.isAfter(moment(), 'date')) {
          this.toStartAtTime = '08:00';
        } else if (valueMoment.isSame(moment(), 'date')) {
          const timeZoneId = geTimeZoneByAddresses(addresses);
          const current = moment().add(5, 'minute');
          if (timeZoneId) {
            current.tz(timeZoneId);
          }

          let minute = current.minute();
          if (minute % 10) {
            minute = (~~(minute / 10) + 1) * 10;
            current.minute(minute);
          }

          this.toStartAtTime = current.format('HH:mm');

          if (!current.isSame(moment(), 'day')) {
            this._toStartAtDate = current.format('YYYY-MM-DD');
          }
        }
      }
    }

  }

  @observable.struct vehicleType = undefined;

  @observable.struct insurance = false;

  @observable.struct cargoCategoryId = undefined;

  @computed
  get disabled__vehicleType() {
    return !!this.status;
  }

  @observable.struct assessedCargoValue = undefined;
  @computed
  get disabled__orderIdentifier() {
    return this.isDisabledMain;
  }

  @computed
  get requiredPassesDetectionMode() {
    if (this.requiredPasses === 0) {
      return 1;
    }
    if (this.requiredPasses === null) {
      return 2;
    }

    return 3;
  }

  set requiredPassesDetectionMode(mode) {
    let value = 0;
    if (mode === 3) {
      value = 1;
    }
    this.requiredPasses = value;
  }

  @observable.struct requiredPasses = 0;

  @computed
  get disabled__requiredPasses() {
    return this.isDisabledMain;
  }

  set bodyGroup(bodyGroupId) {
    if (this.bodyGroupsBodyTypes[bodyGroupId]) {
      this.bodyTypes = this.bodyGroupsBodyTypes[bodyGroupId];
    }
  }

  @computed
  get bodyGroup() {
    for (const bodyGroupIdString of Object.keys(this.bodyGroupsBodyTypes)) {
      const groupTypes = this.bodyGroupsBodyTypes[bodyGroupIdString];
      if (_intersection(this.bodyTypes, groupTypes).length > 0) {
        return ~~bodyGroupIdString;
      }
    }

    return undefined;
  }

  @observable.struct bodyTypes = [];

  @observable.struct _client = false;

  @observable.struct minVehicleBodyLengthInCm = undefined;

  @observable.struct minVehicleBodyHeightInCm = undefined;

  @observable.struct maxHeightFromGroundInCm = undefined;

  @observable.struct comment = undefined;

  @observable.struct innerComment = undefined;

  @observable.struct trackPolyline = null;

  @observable.struct trackEncoder = null;

  @observable.struct _addresses = [];

  @observable.struct _innerComments = [];

  set innerComments(value) {
    this._innerComments = value
  }

  @computed
  get innerComments() {
    return this._innerComments;
  }

  set addresses(addressesInput) {
    const prevAddresses = getRealAddressesPosition(this._addresses);

    function mapReducePosition(m, a) {
      m[a.guid] = a.position;
      return m;
    }

    if (prevAddresses.length) {
      const newAddresses = getRealAddressesPosition(addressesInput);

      const newAddressesMapPosition = newAddresses.reduce(mapReducePosition, {});
      const prevAddressesMapPosition = prevAddresses.reduce(mapReducePosition, {});
      const mapPositions = Object.keys(prevAddressesMapPosition).reduce((m, prevKey) => {
        const prevPosition = prevAddressesMapPosition[prevKey];

        if (!newAddressesMapPosition[prevKey]) {
          m[prevPosition] = 0;
          return m;
        }

        m[prevPosition] = newAddressesMapPosition[prevKey];
        return m;

      }, {});

      for (const cargoPlace of this._cargoPlaces.values()) {
        if (cargoPlace?.departurePointPosition && !mapPositions[cargoPlace.departurePointPosition]) {
          delete cargoPlace.departurePointPosition;
        }

        if (cargoPlace?.departurePointPosition && mapPositions[cargoPlace.departurePointPosition]) {
          cargoPlace.departurePointPosition = mapPositions[cargoPlace.departurePointPosition];
        }

        if (cargoPlace?.arrivalPointPosition && !mapPositions[cargoPlace.arrivalPointPosition]) {
          delete cargoPlace.arrivalPointPosition;
        }

        if (cargoPlace?.arrivalPointPosition && mapPositions[cargoPlace.arrivalPointPosition]) {
          cargoPlace.arrivalPointPosition = mapPositions[cargoPlace.arrivalPointPosition];
        }
      }
    }

    const pickerDate = this.pickedDate;
    const firstAddress = addressesInput[0];

    if (pickerDate && firstAddress && !firstAddress.requiredArriveAt && firstAddress.addressString && !this.regular) {
      firstAddress.requiredArriveAt = pickerDate.format('YYYY-MM-DD HH:mm');
    }
    this._addresses = addressesInput.length ?
      addressesInput.map(el => {
        if (el.timeZone) {
          el.timeZoneId = el.timeZone
        }
        return el;
      })
      : addressesInput;
  }

  @computed
  get addresses() {
    return this._addresses;
  }

  @computed
  get disabledLoadingTypes() {
    return this.bodyTypes.length !== 0
      ? _difference(
        Object.keys(this.loadingTypes).map((l) => ~~l),
        getAvailableLoadingTypesByIntersection(this.bodyTypes, this.vehicleBodyTypeAvailableLoadingTypes),
      )
      : [];
  }

  @computed
  get contourTree() {
    const { requiredContours = [], requiredProducers = [], selectedTariffs = [] } = this;
    if (this.publishingType === "tariff") {
      return [
        ...selectedTariffs.filter(item => APP == 'dispatcher' && !this.republishing ? item.startsWith(this.currentUser) : true)
      ];
    } else {
      if (APP === 'dispatcher') {
        return [
          ...requiredContours.map((v) => 'contour:' + v),
          ...(this.republishing ? requiredProducers : []).map((v) => 'prod:' + v),
        ];
      } else {
        return [
          ...requiredProducers.map((v) => 'prod:' + v)
        ]
      }

    }
  }

  @computed
  get disabled__contourTree() {
    return this.isDisabledMain;
  }

  set contourTree(contourTree) {
    const data =
      contourTreeToData(contourTree, (this.regular && this.autoRepublish && APP == 'dispatcher') ? this.autoRepublishContourTree : [])
    Object.assign(this, data);

    if (this.requiredContours.indexOf(CONTOUR_MAIN_ID) !== -1) {
      this.insurance = true;
    }
  }

  @computed
  get autoRepublishContourTree() {
    const { requiredProducers = [], selectedTariffs = [] } = this;
    if (APP === 'dispatcher') {
      if (this.publishingType === "tariff") {
        return [
          ...selectedTariffs.filter(item => !item.startsWith(this.currentUser))
        ];
      } else {
        return [
          ...requiredProducers.map((v) => 'prod:' + v),
        ];
      }
    } else {
      return null
    }
  }

  set autoRepublishContourTree(autoRepublishContourTree) {
    if (APP === 'dispatcher') {
      const data = contourTreeToData(this.contourTree, this.autoRepublish ? autoRepublishContourTree : [])
      Object.assign(this, data);
    }

    if (this.requiredContours.indexOf(CONTOUR_MAIN_ID) !== -1) {
      this.insurance = true;
    }
  }

  @computed
  get contourTreeData() {
    const {
      contours,
      producers,
      calculation: { hash: calculationsHash },
      publishingType
    } = this;

    return getContourTreeData({
      contours,
      producers,
      calculationsHash: publishingType == 'tariff' ? calculationsHash : {},
      disabledNoCost: (publishingType == 'tariff'),
      excludeMainContour: false,
    });
  }

  @observable.struct requiredContours = [];

  @observable.struct requiredProducers = [];

  @observable.struct selectedTariffs = [];

  @observable.struct startOfPeriod = undefined;

  @observable.struct endOfPeriod = undefined;

  @observable.struct unit = undefined;

  @observable.struct _amount = undefined;

  @observable.struct offset = undefined;

  @observable.struct title = undefined;

  @observable.struct regular = false;

  @observable.struct republishing = false;

  @observable.struct autoRepublish = false;

  @observable.struct _clientRateProducers = null;

  @computed
  get clientRateProducers() {
    return this.publishingType === "tariff" ? null : this._clientRateProducers
  }

  set clientRateProducers(clientRateProducers) {
    if (clientRateProducers) {
      const newSumWithoutVat = parseInt(clientRateProducers)
      const newSumWithVat = (newSumWithoutVat + (newSumWithoutVat * this.vatRate / 100))
      this._clientRateProducers = newSumWithoutVat
      this._clientRateProducersVat = newSumWithVat
    } else {
      this._clientRateProducers = undefined
      this._clientRateProducersVat = undefined
    }
  }

  @observable.struct _clientRateProducersVat = null;

  @computed
  get clientRateProducersVat() {
    return this.publishingType === "tariff" ? null : this._clientRateProducersVat
  }

  set clientRateProducersVat(clientRateProducersVat) {
    if (clientRateProducersVat) {
      const newSumWithVat = parseInt(clientRateProducersVat)
      const newSumWithoutVat = (newSumWithVat * (100 / (100 + this.vatRate)))
      this._clientRateProducers = newSumWithoutVat
      this._clientRateProducersVat = newSumWithVat
    } else {
      this._clientRateProducers = undefined
      this._clientRateProducersVat = undefined
    }
  }

  @computed
  get amount() {
    return this._amount
  }

  set amount(amount) {
    let newAmount
    if (!Array.isArray(amount)) {
      newAmount = [amount]
    } else {
      newAmount = [...amount].sort((a, b) => a - b)
    }
    this._amount = newAmount
  }

  @observable.struct cargoDeclaredVolume = undefined

  @observable.struct cargoDeclaredWeight = undefined

  @observable.struct cargoDeclaredPlacesCount = undefined

  @observable.struct cargoPackagingType = undefined

  @computed
  get autoRepublishContourTreeData() {
    const {
      contours,
      producers,
      calculation: { hashProds: calculationsHash },
      publishingType
    } = this;

    return getContourTreeData({
      contours,
      producers,
      calculationsHash: publishingType == 'tariff' ? calculationsHash : {},
      disabledNoCost: (publishingType == 'tariff'),
      excludeMainContour: false,
    });
  }

}

export default OrderDataBase;
