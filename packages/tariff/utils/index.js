import { TARIFF_HOURLY_DEFAULT_SERVICE, TARIFF_FIXED_DEFAULT_SERVICE, SPEICALITIES_TO_SERVICES } from '../constants';
import { Address as AddressService } from '@vezubr/services';
import { uuid } from '@vezubr/common/utils';
export function convertTariffDataWithParams({ tariffInput, vehicleBodies, costWithVat = false }) {
  const {
    baseWorkCost: baseWorkCostInput,
    baseWorkCosts: baseWorkCostsInput,
    serviceCosts: serviceCostsInput,
    serviceCost: serviceCostInput,
    serviceParams,
  } = tariffInput?.params || {};

  const baseWorkCosts = baseWorkCostInput || baseWorkCostsInput || [];

  const serviceCosts = [...(serviceCostInput || serviceCostsInput || [])];

  const bodyTypes = vehicleBodies.map((v) => ~~v);

  for (const baseWorkCost of baseWorkCosts) {
    if (!baseWorkCost.bodyTypes) {
      baseWorkCost.bodyTypes = bodyTypes;
    }
  }
  for (const serviceCost of serviceCosts) {
    if (!serviceCost.bodyTypes) {
      serviceCost.bodyTypes = bodyTypes;
    }
  }

  if (tariffInput.type === 4) {
    baseWorkCosts.forEach(el => {
      el.cost = el.cost / 100
    })
  }

  let tariff = {
    ...tariffInput,
    baseWorkCosts,
    serviceCosts,
    serviceParams,
  };

  // tariff.addresses = tariffInput.route ? Order.Utils.getAddressesStore(tariffInput.route) : [];

  delete tariff['params'];

  if (costWithVat) {
    tariff = getTariffWithVatRate(tariff)
  }

  return tariff;
}


export const convertTariffDataWithParamsLoaders = ({ tariffInput, costWithVat = false, loaderSpecialities }) => {
  const {
    baseLoadersWorkCosts: baseWorkCosts,
    loadersServiceCosts: serviceCosts,
    loadersWorkDistanceCosts: distanceCosts = [],
    specialityServiceCosts = []
  } = tariffInput?.params || {};

  let serviceCostsFromSpecialityCosts = specialityServiceCosts.map(el => {
    Object.keys(SPEICALITIES_TO_SERVICES).forEach(item => {
      if (SPEICALITIES_TO_SERVICES[item].includes(el.article)) {
        el.article = +item;
      }
    })
    el.id = el.speciality
    return el;
  });


  let tariff = {
    ...tariffInput,
    baseWorkCosts,
    serviceCosts: [...serviceCosts, ...serviceCostsFromSpecialityCosts],
    distanceCosts,
  };

  if (costWithVat) {
    tariff = getTariffWithVatRate(tariff);
  }

  return tariff;

}

export function getDefaultServices(tariffInput) {

  if (!tariffInput) {
    return;
  }
  if (!Array.isArray(tariffInput?.params?.serviceCosts) || tariffInput?.params?.serviceCosts.length === 0) {
    return tariffInput;
  }
  const { serviceCosts } = tariffInput.params
  const defaultBodyTypes = serviceCosts[0].bodyTypes;
  const defaultVehicleId = serviceCosts[0].vehicleTypeId;
  let defaultServices = TARIFF_HOURLY_DEFAULT_SERVICE;
  if (tariffInput.type === 3) {
    defaultServices = TARIFF_FIXED_DEFAULT_SERVICE;
  }

  defaultServices.forEach(el => {
    if (!serviceCosts.find(item => item.article === el)) {
      tariffInput.params.serviceCosts.push({
        article: el,
        costPerService: 0,
        bodyTypes: defaultBodyTypes,
        vehicleTypeId: defaultVehicleId
      })
    }
  })

  return tariffInput
}

export function getArrayFromMapWithMerge(mapValues, getKey, input) {
  const inputHash = {};
  if (input) {
    for (const inputValue of input) {
      const key = getKey(inputValue);
      inputHash[key] = inputValue;
    }
  }

  const result = [];

  for (const mapValue of mapValues) {
    const key = getKey(mapValue);
    const item = {
      ...mapValue,
      ...(inputHash?.[key] || {}),
    };
    result.push(item);
  }

  return result;
}

export function costFieldOperation(value, operation) {
  if (typeof value == 'number') {
    return operation(value);
  }

  return value;
}

export const getTariffWithVatRate = (tariffInput) => {
  if (!tariffInput?.costVatRate) {
    return tariffInput;
  }
  const { costVatRate } = tariffInput;
  const newTariff = { ...tariffInput }
  if (Array.isArray(newTariff?.serviceCosts)) {
    newTariff.serviceCosts = newTariff.serviceCosts.map(el => {
      if (el.article == 9901) {
        return el
      }
      el.costPerService = (el.costPerService + el.costPerService * (costVatRate / 100));
      el.costPerService = Math.round(+el.costPerService)
      return el
    })
  }
  // if (Array.isArray(newTariff?.serviceParams)) {
  //   newTariff.serviceParams = newTariff.serviceParams.map(el => {
  //     el.value = (el.value + el.value * (costVatRate / 100));
  //     el.value = Math.round(+el.value)
  //     return el;
  //   })
  // }
  if (Array.isArray(newTariff?.baseWorkCosts)) {
    newTariff.baseWorkCosts = newTariff.baseWorkCosts.map(el => {
      el.cost = (el.cost + el.cost * (costVatRate / 100));
      el.cost = Math.round(+el.cost)
      return el;
    })
  }
  if (Array.isArray(newTariff?.distanceCosts)) {
    newTariff.distanceCosts = newTariff.distanceCosts.map(el => {
      el.cost = (el.cost + el.cost * (costVatRate / 100));
      el.cost = Math.round(+el.cost)
      return el;
    })
  }

  return newTariff;
}


export const convertTariffAddresses = (routes, type) => {
  let addresses = [];
  if (Array.isArray(routes)) {
    if (type === 'route_points') {
      addresses = routes.map(item => ({
        ...item,
        addressString: item.title
      }));
    }
    else if (type === 'route_cities') {
      return {
        cities: routes.map(item => ({
          cityName: item.title,
          guid: uuid(),
          isNew: false
        }))
      }
    }

  }
  return { addresses };
}

export const convertRouteTypes = (type) => {
  if (typeof type === 'number' || typeof type === 'string') {
    switch (type) {
      case 0:
        return 'route_points'
      case 1:
        return 'route_cities'
      case 'route_points':
        return 0
      case 'route_cities':
        return 1
    }
  }

  return null
}

export const compareArray = (arr1, arr2) => {
  if (arr1.length != arr2.length)
    return false;

  for (var i = 0, l = arr1.length; i < l; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}


export const getPlaceholder = (placeholders, vehicle, item, type, isMileage) => {
  let temp = null;
  if (type === 'services') {
    temp = placeholders.serviceCosts?.find(
      el => el.vehicleTypeId === vehicle.vehicleTypeId && el.article === item.article && compareArray(el.bodyTypes, vehicle.bodyTypes)
    );
    if (temp) temp.cost = temp.costPerService;
  }
  if (type === 'baseWorks') {
    if (isMileage) {
      temp = placeholders?.baseWorkCosts.find(el =>
        el.vehicleTypeId === vehicle.vehicleTypeId &&
        el.mileage === vehicle.mileage &&
        compareArray(el.bodyTypes, vehicle.bodyTypes) &&
        el.workMinutes === vehicle.workMinutes
      )
    } else {
      temp = placeholders?.baseWorkCosts?.find(el =>
        el.vehicleTypeId === vehicle.vehicleTypeId
        && el.hoursWork === item.hoursWork
        && el.hoursInnings === item.hoursInnings
        && compareArray(el.bodyTypes, vehicle.bodyTypes)
      );
    }
  }
  return temp?.cost;
}