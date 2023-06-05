import { Utils } from '@vezubr/common/common';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/contour';
import { Ant, showError } from '@vezubr/elements';
import * as Address from '@vezubr/address';
import deepMerge from 'deepmerge';
import _concat from 'lodash/concat';
import _max from 'lodash/max';
import _min from 'lodash/min';
import moment from 'moment';
import React from 'react';
import { DISABLED_PREFIX, ORDER_DOCUMENTS_REQUIRED, REGULAR_ORDER_ARRIVE_AT_FIELDS } from '../constants';
import { Contractor as ContractorService, Orders as OrderService } from '@vezubr/services';

export function getDisabledFieldName(name) {
  return `${DISABLED_PREFIX}${name}`;
}

export async function getProducersForOrder(orderType, points, vehicleType) {
  return (await ContractorService.producerForOrderList({
    orderType,
    itemsPerPage: 10000,
    points: Array.isArray(points) ? [points[0], points[points.length - 1]] || [] : [points],
    vehicleType
  })).data || []
}

export function getAvailableLoadingTypesByIntersection(bodyTypes, vehicleBodyTypeAvailableLoadingTypes) {
  let loadingTypeIntersection = null;

  for (const bodyTypeId of bodyTypes) {
    const bodyTypeLoadingMap = vehicleBodyTypeAvailableLoadingTypes[bodyTypeId];

    if (loadingTypeIntersection === null) {
      loadingTypeIntersection = { ...bodyTypeLoadingMap };
      continue;
    }

    for (const loadingTypeId of Object.keys(bodyTypeLoadingMap)) {
      if (typeof loadingTypeIntersection[loadingTypeId] === 'undefined') {
        loadingTypeIntersection[loadingTypeId] = bodyTypeLoadingMap[loadingTypeId];
        continue;
      }

      if (!bodyTypeLoadingMap[loadingTypeId]) {
        loadingTypeIntersection[loadingTypeId] = false;
      }
    }
  }

  return Object.keys(loadingTypeIntersection || {})
    .filter((loadingTypeId) => loadingTypeIntersection[loadingTypeId])
    .map((v) => ~~v);
}

export function getHashOfContourProducer({ contourId, producerId }) {
  return `${contourId}-${producerId}`;
}

export function getContourProducerFromHash(hash) {
  const [contourIdString, producerIdString] = hash.split('-');

  const contourId = ~~contourIdString;
  const producerId = ~~producerIdString;

  return {
    contourId,
    producerId,
  };
}

export function fixCalculate(calucates) {
  const newCalculates = [];

  for (const calculate of calucates) {
    const newCalculate = { ...calculate };

    if (newCalculate.appoints.length > 1) {
      newCalculate.appoints = newCalculate.appoints.filter((ap) => ap.contourId !== CONTOUR_MAIN_ID);
    }

    newCalculates.push(newCalculate);
  }

  return newCalculates;
}

export function getBodyTypesTreeData(bodyTypes, bodyGroups, bodyTypesByBodyGroup, vehicleType, vehicleTypes) {
  const treeData = [];
  const { availableBodyTypes } = Array.isArray(vehicleTypes) ? vehicleTypes?.find(el => el.id === +vehicleType) || {} : {};

  for (const groupId of Object.keys(bodyGroups)) {
    const children = bodyTypesByBodyGroup[groupId].map((bodyTypeId) => ({
      title: bodyTypes.find(el => el.id === bodyTypeId)?.title,
      value: bodyTypeId,
      disabled: vehicleType && availableBodyTypes ? !availableBodyTypes[bodyTypeId] : false,
      key: bodyTypeId,
      id: `bodytype-${bodyTypeId}`
    }));

    treeData.push({
      id: `bodytype-group-${groupId}`,
      title: bodyGroups[groupId],
      value: `group-${groupId}`,
      key: `group-${groupId}`,
      children,
      disabled: !children.find(el => !el.disabled)
    });
  }

  return treeData;
}

export function getOrderDocumentCategoriesTreeData(orderDocumentCategoriesRequired, orderDocumentCategories) {
  const treeData = [];

  for (const categoryKey of Object.keys(orderDocumentCategoriesRequired)) {
    const children = orderDocumentCategoriesRequired[categoryKey].values.map((documemtId) => ({
      title: orderDocumentCategories.find(el => el.id === documemtId)?.title,
      value: documemtId,
      key: documemtId,
    }));
    treeData.push({
      title: orderDocumentCategoriesRequired[categoryKey].name,
      value: categoryKey,
      key: categoryKey,
      children,
    });
  }
  return treeData;
}

export function getCalculationHash(tariffsDynamicsOrderCalculationsData) {
  const minCost = {
    producer: null,
    contourId: null,
    value: NaN,
  };

  const maxCost = {
    producer: null,
    contourId: null,
    value: NaN,
  };

  const producers = {};
  const contours = {};
  const tariffs = {};
  tariffsDynamicsOrderCalculationsData.sort((a, b) => a.cost - b.cost)
  for (const calcItem of tariffsDynamicsOrderCalculationsData) {
    const { cost, appoints = [], tariff, costVatRate } = calcItem;

    const newCost = cost + (cost * costVatRate / 100)

    for (const appoint of appoints) {
      const { producerId, contourId, tariffId, contractId } = appoint;

      if (typeof contours[contourId] === 'undefined' || cost < contours[contourId]) {
        contours[contourId] = newCost;
      }

      if (isNaN(minCost.value) || cost < minCost.value) {
        minCost.producer = producerId;
        minCost.contourId = contourId;
        minCost.value = newCost;
      }

      if (isNaN(maxCost.value) || cost > maxCost.value) {
        maxCost.producer = producerId;
        maxCost.contourId = contourId;
        maxCost.value = newCost;
      }

      if (!producerId) {
        continue;
      }

      const hashId = getHashOfContourProducer({ producerId, contourId });
      if (producers[hashId]) {
        producers[hashId] = _concat(producers[hashId], newCost);
      } else {
        producers[hashId] = [newCost];
      };
      if (tariffs[hashId]) {
        tariffs[hashId] = _concat(tariffs[hashId], { ...tariff, contractId });
      } else {
        tariffs[hashId] = [{ ...tariff, contractId }];
      }
    }
  }

  return {
    minCost,
    maxCost,
    producers,
    contours,
    tariffs,
  };
}

export function deleteDuplicatedTariffs(tariffs) {
  let result = tariffs;
  let tempMap = new Map();
  result = result.map((value) => {
    const producerOnTariff = value.split(':')[0]
    if (tempMap.get(producerOnTariff)) {
      value = ''
    } else {
      tempMap.set(producerOnTariff, true)
    }
    return value
  })
  result = result.filter(value => value)

  return result
}

export function getContourTreeData(props) {
  const {
    contours: contoursInput = [],
    producers = [],
    calculationsHash = {},
    disabledNoCost = true,
    excludeMainContour = false,
  } = props;

  const producersCache = {};
  for (const producer of producers) {

    const id = producer.id;
    const companyName = (producer.companyName || producer.title || producer.inn || producer.id);
    const inn = producer.inn;
    const activeContract = producer.activeContract
    for (const { status, contour } of producer.contours) {
      if (contour === CONTOUR_MAIN_ID) {
        continue;
      }

      const hashId = getHashOfContourProducer({ producerId: producer.id, contourId: contour });
      const producerCost = calculationsHash?.producers?.[hashId];
      const tariffs = calculationsHash?.tariffs?.[hashId];
      let producerData;
      const value = 'prod:' + producer.id;
      if (Array.isArray(producerCost)) {
        const title =
          companyName +
          ': от ' +
          Utils.moneyFormat(_min(producerCost)) +
          ' до ' +
          Utils.moneyFormat(_max(producerCost));
        producerData = {
          title,
          value,
          inn,
          id,
          activeContract,
          key: value,
          icon: (p) => <Ant.Checkbox checked={p.selected} disabled={p.disabled} />,
          children: producerCost.map((cost, index) => ({
            title: `${producer.companyName || producer.title || producer.inn}; ${tariffs[index].id}; ${tariffs[index].title}; ${Utils.moneyFormat(cost)}`,
            cost,
            value: `${id}:${tariffs[index].id}:${tariffs[index].contractId}`,
            key: `${value}:${index}`,
          })),
        };
      } else {
        const title = companyName + (typeof producerCost !== 'undefined' ? ': ' + Utils.moneyFormat(producerCost) : '');
        producerData = {
          title,
          value: producerCost ? `${id}:${tariffs.id}` : value,
          inn,
          id,
          activeContract,
          cost: producerCost,
          icon: (p) => <Ant.Checkbox checked={p.selected} disabled={p.disabled} />,
          disabled: disabledNoCost && typeof producerCost === 'undefined',
          key: value,
        };
      }

      if (typeof producersCache[contour] === 'undefined') {
        producersCache[contour] = [];
      }

      producersCache[contour].push(producerData);
    }
  }

  const treeData = [];

  for (const contourInput of contoursInput) {
    if (excludeMainContour && contourInput.id === CONTOUR_MAIN_ID) {
      continue;
    }

    if (contourInput?.contractor_status && (contourInput.contractor_status !== 2)) {
      continue;
    }

    const contourCost = calculationsHash?.contours?.[contourInput.id];
    const contourId = contourInput.id;
    const value = 'contour:' + contourId;
    const title = contourInput.title;

    const contour = {
      title,
      cost: contourCost,
      value,
      contourId,
      icon: (p) => <Ant.Checkbox checked={p.selected} disabled={p.disabled} />,
      disabled: disabledNoCost && typeof contourCost === 'undefined',
      key: value,
    };

    if (producersCache[contourId]) {
      contour.children = producersCache[contourId];
    }

    treeData.push(contour);
  }

  return treeData;
}

export function getFlattenData(contourTreeData, contourTree, isTariff) {
  const flattenData = [{ title: 'Все подрядчики', children: [], key: contourTreeData[0]?.key, value: contourTreeData[0]?.value, }]
  if (contourTreeData) {
    contourTreeData.forEach(contour => {
      contour.children?.forEach(producer => {
        if (isTariff && producer.children?.length) {
          producer.children.forEach(tariff => tariff.disabled = !!contourTree.find(x => +x.split(':')[0] === producer.id && x !== tariff.value))
          if (flattenData[0].value) {
            flattenData[0].value = flattenData[0].value.concat(producer.value);
          } else {
            flattenData[0].value = [producer.value];
          }
        }
        flattenData[0].children = flattenData[0].children.concat(producer);
        if (!isTariff) {
          flattenData[0].children = flattenData[0].children.map(el => { el.disabled = !el.activeContract; return el })
        }
      });
    })
    if (flattenData[0].children.length === 0 || flattenData[0].children.find((value) => !value.disabled) == undefined) flattenData[0].disabled = true
  }
  flattenData[0].children.sort((a, b) => {
    if ((a.disabled && b.disabled) || (!a.disabled && !b.disabled)) {
      return 0;
    }
    if (a.disabled && !b.disabled) {
      return 1;
    }
    if (!a.disabled && b.disabled) {
      return -1;
    }
  })
  return flattenData
}

export function contourTreeToData(contourTree, autoRepublishContourTree) {
  let tree = Array.isArray(contourTree[0]) ? contourTree[0] : [...contourTree, ...autoRepublishContourTree]

  const tariffsInOrder = tree.filter((v) => !Number.isNaN(+v.split(':')[0]));
  const selectedTariffs = deleteDuplicatedTariffs(tariffsInOrder);
  const requiredProducers = tree.filter((v) => v.split(':')[0] === 'prod').map((v) => ~~v.split(':')[1]);
  const requiredContours = tree.filter((v) => v.split(':')[0] === 'contour').map((v) => ~~v.split(':')[1]);
  const data = {
    requiredContours: Array.from(new Set(requiredContours)),
    requiredProducers: Array.from(new Set(requiredProducers)),
    selectedTariffs: Array.from(new Set(selectedTariffs)),
  };

  return data
}

export function getAddressStore(address) {
  const newAddress = Address.Utils.getStoreAddress(address);
  if (newAddress?.requiredArriveAt) {
    if (typeof newAddress.requiredArriveAt === 'number') {
      newAddress.requiredArriveAt = moment.utc(newAddress.requiredArriveAt * 1000).format('YYYY-MM-DD HH:mm');
    } else {
      newAddress.requiredArriveAt = moment.utc(newAddress.requiredArriveAt).format('YYYY-MM-DD HH:mm');
    }
  }
  newAddress.contacts = newAddress.contacts || newAddress.contactName;
  delete newAddress.contactName;
  return newAddress;
}

export function getAddressSave(addressInput) {
  const address = Address.Utils.getRealAddress(addressInput);

  delete address.arrivedAt;
  delete address.leavedAt;
  delete address.completedAt;
  delete address.canChangePosition;
  delete address.verifiedBy;
  delete address.createdBy;
  delete address.externalId;
  delete address.skipped;
  delete address.expectedArrivalAt;
  delete address.addressId;

  // if (address?.attachedFiles && address.attachedFiles?.length > 0) {
  //   address.attachedFiles = address?.attachedFiles?.map(({ id }) => ({
  //     fileId: id?.toString(),
  //   }));
  // }
  return address;
}

export function getAddressesSave(addresses) {
  return Address.Utils.getRealAddresses(addresses).map(getAddressSave);
}

export function getAddressesStore(addressesInput) {
  return Object.values(addressesInput).map(getAddressStore);
}

export function getOrderDataSave(dataInput) {
  const data = {
    ...dataInput,
  };

  data.addresses = data.addresses.length && data.addresses.map((address) => {
    if (typeof address.contacts === 'string') {
      address.contacts = [address.contacts];
    }

    return address;
  });

  if (!data?.bodyTypes?.find(el => el === 2)) {
    delete data.vehicleTemperatureMax;
    delete data.vehicleTemperatureMin
    delete data.isThermograph;
  }

  if (!data.requiredPasses) {
    delete data.requiredPasses;
  } else {
    data.requiredPasses = Array.isArray(data.requiredPasses) ? data.requiredPasses : [data.requiredPasses];
  }

  if (data.clientRate === 0 && data.selectingStrategy === 2) {
    data.clientRate = null;
  }

  if (data.publishingType === "tariff") {
    data.clientRate = null;
  }

  if (data.publishingType === 'bargain') {
    data.bargainType = data.selectingStrategy == 2 ? "open" : "closed"
  }

  if (data.addresses) {
    data.addresses = getAddressesSave(data.addresses);
  }

  if (data.orderType == 2) {
    data.address = data.addresses[0]
    delete data.addresses
  }

  if (data.requiredLoaderSpecialities) {
    const requiredLoaderSpecialities = {};
    Object.keys(data.requiredLoaderSpecialities).filter(el => data.requiredLoaderSpecialities[el])
      .forEach(item => requiredLoaderSpecialities[item] = data.requiredLoaderSpecialities[item])
    data.requiredLoaderSpecialities = requiredLoaderSpecialities;
  }

  delete data.status;

  if (!data.customProperties) {
    data.customProperties = [];
  }

  return data;
}

export function getActiveOrderDataSave(dataInput) {
  const data = {
    ...dataInput,
  };

  if (data.addresses) {
    data.addresses = getAddressesSave(data.addresses);
    data.addresses = data.addresses.map((address) => {
      if (typeof address.contacts === 'string') {
        address.contacts = [address.contacts];
      }

      return address;
    });
  }

  return {
    addresses: data.addresses,
    cargoPlaces: data.cargoPlaces
  };
}

export function getOrderDataSaveDispatcher(dataInput) {
  const data = {
    ...getOrderDataSave(dataInput)
  };

  data.addresses = data.addresses.length && data.addresses.map((address) => {
    if (typeof address.contacts === 'string') {
      address.contacts = [address.contacts];
    }

    return address;
  });

  data.client = String(data.client);

  return data;
}

export function getOrderDataStore(order) {
  const data = {
    ...order,
  };

  const points = order?.addresses || order?.points;
  if (points) {
    data.addresses = getAddressesStore(deepMerge.all([order?.addresses || {}, order?.points || {}]));
  }

  data.status = data?.frontend_status?.state;

  const point = order?.point || order?.address;
  data.address = point ? getAddressStore(deepMerge.all([order?.address || {}, order?.point || {}])) : null;

  const date = moment(order.start_at_local);

  data.bodyTypes = Object.values(order?.bodyTypes || []);

  data.toStartAtDate = date.format('YYYY-MM-DD');
  data.toStartAtTime = date.format('HH:mm');

  data.comment = order.comment || order.client_comment;

  data.vehicleType = order?.vehicle_type?.id || data?.vehicleType;

  data.requiredContours = order?.required_contour_ids || order?.requiredContours || [];
  data.requiredProducers = order?.required_producer_ids || order?.requiredContours || [];

  data.requestId = order.request_id || order.requestId;

  data.assessedCargoValue = order.assessed_cargo_value || order.assessedCargoValue;

  data.maxHeightFromGroundInCm = order.maxHeightFromGroundInCm ? order.maxHeightFromGroundInCm : null;

  if (data.requiredPasses) {
    const requiredPasses = data.requiredPasses;
    data.requiredPasses = requiredPasses.length > 0 ? requiredPasses[0] : 0;
  }

  if (Array.isArray(data.customProperties)) {
    data.customProperties = data.customProperties.map(el => ({ values: el.values, latinName: el.customProperty.latinName }))
  }

  return data;
}

export function getOrderDocumentsRequired(orderDocumentCategories) {

  const documentsRequired = {}

  for (const articleString of orderDocumentCategories) {

    if (articleString?.id.length < 4) {
      continue;
    }
    const article = articleString?.id;

    for (const key of Object.keys(ORDER_DOCUMENTS_REQUIRED)) {
      const { rule, name } = ORDER_DOCUMENTS_REQUIRED[key];

      if (rule(article)) {

        if (!documentsRequired[key]) {
          documentsRequired[key] = {
            name,
            values: []
          }
        }

        documentsRequired[key].values.push(article)
      }
    }

  }

  return documentsRequired
}

export function isActiveUpdater(status, isTaken) {
  return ((status === 102 && isTaken) || (status > 200 && status < 307));
}

export function changeFirstAddressDate(store, time) {
  const newAddresses = store.data.addresses.map((address, index) => {
    if (index === 0 && !store.data.regular) {
      address.requiredArriveAt = time ? time : ''
    }
    return address
  })
  store.setDataItem('addresses', newAddresses)
}

export function handleTemperatures(values) {
  if (values?.bodyTypes?.includes(2)) {
    const oldMin = values.vehicleTemperatureMin
    values["vehicleTemperatureMin"] = _min([
      parseInt(values.vehicleTemperatureMin),
      parseInt(values.vehicleTemperatureMax)
    ])
    values["vehicleTemperatureMax"] = _max([
      parseInt(oldMin),
      parseInt(values.vehicleTemperatureMax)
    ])
  }
}

export const validateRegularOrderArriveAt = (data, arrivedAtState = null) => {
  let validated = true;
  let isSameState = !!arrivedAtState;

  if (!data) {
    return false;
  }
  if (!Array.isArray(data.addresses) || !data.addresses.length || !data.addresses[0]?.timeZoneId) {
    return false
  }
  for (const el of REGULAR_ORDER_ARRIVE_AT_FIELDS) {
    if ((Array.isArray(data[el]) && !data[el].length) || !data[el]) {
      validated = false;
      break;
    }
    if (isSameState) {
      if (Array.isArray(data[el])) {
        data[el].forEach(item => {
          if (!arrivedAtState[el].includes(item) && isSameState) {
            isSameState = false;
          }
        })
      }
      else if (data[el] !== arrivedAtState[el]) {
        isSameState = false;
      }
    }
  }
  if (isSameState || !validated) {
    return false
  }
  return true;
}

export function getLoadersOrderDataSave(dataInput) {
  const data = {
    ...dataInput,
  };


  if (data.clientRate === 0 && data.selectingStrategy === 2) {
    data.clientRate = null;
  }

  if (data.publishingType === "tariff") {
    data.clientRate = null;
  }

  if (data.address) {
    const address = getAddressSave(data.address);
    if (typeof address.contacts === 'string') {
      address.contacts = [address.contacts];
    }
    if (address.attachedFiles) {
      address.attachedFiles.map(el => { el.name = el.fileName || el.fileNameOrigin; el.fileId = String(el.fileId); delete el.fileName; return el })
    }
    delete address.position;
    delete address.loadingType;
    data.address = address;
  }

  delete data.addresses;
  delete data.status;
  return data;
}

export async function getInsuranceAmount(id) {
  try {
    const insuranceResp = await OrderService.insuranceAmount(id);
    return insuranceResp.insuranceAmount;
  } catch (e) {
    showError(e);
    console.error(e);
  }
}