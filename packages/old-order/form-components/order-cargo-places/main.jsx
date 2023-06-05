import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import moment from 'moment';
import React, { useMemo, useCallback, useContext, useState, useEffect } from 'react';
import { runInAction } from 'mobx';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import * as Address from '@vezubr/address';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { OrderContext } from '../../context';
import { OrderCargoPlacesContext } from '../../context';
import { observer } from 'mobx-react';
import OrderCargoPlacesTable from './table';
import { uuid } from '@vezubr/common/utils';

const paramsToData = {
  statusAddress: 'statusAddress.addressString',
  deliveryAddress: 'deliveryAddress.addressString',
  deliveryId: 'deliveryAddress.id',
  externalId: 'deliveryAddress.externalId',
};

function filterCreatedAt(record, paramsInput) {
  const { createdAtFrom, createdAtTill, ...params } = paramsInput;

  let result = null;
  if (createdAtFrom && createdAtTill) {
    result = moment(record.createdAt).isBetween(createdAtFrom, createdAtTill);
  }

  return {
    params,
    result,
  };
}

function filterPinned(record, paramsInput, cargoPlaces) {
  const { pinned, ...params } = paramsInput;
  let result = true;

  const addressIn = cargoPlaces.get(record.id)?.departurePointPosition;
  const addressOut = cargoPlaces.get(record.id)?.arrivalPointPosition;

  const isFull = !!addressIn && !!addressOut;

  switch (pinned) {
    case '1':
      result = isFull ? true : false;
      break;
    case '2':
      result = isFull ? false : true;
      break;
  }

  return { params, result };
}

function filterCheckbox(record, paramsInput) {
  const { status, ...params } = paramsInput;

  let result = true;

  if (!_isEmpty(status)) {
    result = status.includes(record.status);
  }

  return { params, result };
}

function filterDefault(record, params) {
  for (const paramName of Object.keys(params)) {
    const paramValue = params[paramName].toLowerCase();

    const getTerPath = paramsToData[paramName] || paramName;
    const dataValue = (_get(record, getTerPath) || '').toString().toLowerCase();

    if (!dataValue) {
      return {
        result: false,
        params,
      };
    }

    if (!dataValue.includes(paramValue)) {
      return {
        result: false,
        params,
      };
    }
  }

  return {
    result: null,
    params,
  };
}

const filters = [filterPinned, filterCreatedAt, filterCheckbox, filterDefault];

function filteredData(data, paramsInput, cargoPlaces) {
  const params = { ...paramsInput };

  if (_isEmpty(params)) {
    return data;
  }

  return data.filter((record) => {
    let localParams = params;

    for (const filterFun of filters) {
      const filterInfo = filterFun(record, localParams, cargoPlaces);
      if (filterInfo.result === false) {
        return false;
      }

      localParams = filterInfo.params;
    }

    return true;
  });
}

function OrderCargoPlacesMain(props) {
  const {
    fieldNameStore,
    fieldNameAddresses,
    fieldNameAll,
    fieldNameAddressIn,
    fieldNameAddressOut,
    fieldNameValue,
    cargoPlaceStatuses,
  } = props;

  const { store } = useContext(OrderContext);
  const [sortedMark, setSortedMark] = useState(uuid());

  const [params, pushParamsInner] = useParamsState({
    paramsDefault: {
      createdAtFrom: moment().subtract(7, 'days').format('YYYY-MM-DD'),
      createdAtTill: moment().add(1, 'days').format('YYYY-MM-DD'),
    },
  });

  const pushParams = useCallback(({ page, ...otherProps }) => pushParamsInner(otherProps), [pushParamsInner]);

  const dataSourceAllInput = store.data[fieldNameAll];

  const dataSourceAll = useMemo(() => {
    const cargoPlaceStore = store.getDataItemNoComputed(fieldNameStore);
    const resultCargoPlaces = [...dataSourceAllInput];
    return resultCargoPlaces.sort((p1, p2) => {
      const placeUser1 = cargoPlaceStore.get(p1.id);
      const placeUser2 = cargoPlaceStore.get(p2.id);

      const placeUser1Full = placeUser1 && placeUser1[fieldNameAddressIn] && placeUser1[fieldNameAddressOut];
      const placeUser2Full = placeUser2 && placeUser2[fieldNameAddressIn] && placeUser2[fieldNameAddressOut];

      const placeUser1Part = placeUser1 && (placeUser1[fieldNameAddressIn] || placeUser1[fieldNameAddressOut]);
      const placeUser2Part = placeUser2 && (placeUser2[fieldNameAddressIn] || placeUser2[fieldNameAddressOut]);

      if (placeUser1Full && placeUser2Full) {
        return 0;
      }

      if (placeUser1Full && !placeUser2Full) {
        return -1;
      }

      if (!placeUser1Full && placeUser2Full) {
        return 1;
      }

      if (placeUser1Part && !placeUser2Part) {
        return -1;
      }

      if (!placeUser1Part && placeUser2Part) {
        return 1;
      }

      return 0;
    });
  }, [dataSourceAllInput, store, sortedMark]);

  const dataStore = store.getDataItem(fieldNameStore);

  const dataSource = useMemo(() => filteredData(dataSourceAll, params, dataStore), [
    params,
    dataSourceAll,
    filteredData,
    dataStore,
  ]);

  const addressesInput = store.data[fieldNameAddresses];

  const [addressesIn, addressesOut] = useMemo(() => {
    const addressesIn = [];
    const addressesOut = [];
    const addresses = Address.Utils.getRealAddresses(addressesInput);

    for (let index = 0; index < addresses.length; index++) {
      const address = addresses[index];

      if (address.isLoadingWork) {
        addressesIn.push(address);
      }

      if (address.isUnloadingWork) {
        addressesOut.push(address);
      }
    }

    return [addressesIn, addressesOut];
  }, [addressesInput]);

  const cargoPlacesAddAuto = useCallback(() => {
    const cargoPlaceStore = store.getDataItemNoComputed(fieldNameStore);

    const addressesInHash = {};
    addressesIn.forEach((a) => a.id && (addressesInHash[a.id] = a));

    const addressesOutHash = {};
    addressesOut.forEach((a) => a.id && (addressesOutHash[a.id] = a));

    let hasUpdated = false;

    runInAction(() => {
      for (const cargoPlace of dataSource) {
        const departureId = cargoPlace?.['departureAddress']?.id;
        const deliveryId = cargoPlace?.['deliveryAddress']?.id;

        const itemUpdated = {
          ...cargoPlaceStore.get(cargoPlace.id),
          cargoPlaceId: cargoPlace.id
        };

        let updated = false;

        // Если совпадает адрес погрузки
        if (departureId && addressesInHash?.[departureId]) {
          itemUpdated[fieldNameAddressIn] = addressesInHash[departureId].position;
          updated = true;
        }

        if (deliveryId && addressesOutHash?.[deliveryId]) {
          itemUpdated[fieldNameAddressOut] = addressesOutHash[deliveryId].position;
          updated = true;
          // Если адрес доставки совпадает а погрузки нет, тогда первый адрес берем
          if (!itemUpdated[fieldNameAddressIn] && addressesIn?.[0]?.position) {
            itemUpdated[fieldNameAddressIn] = addressesIn?.[0]?.position;
          }
        }

        if (updated) {
          cargoPlaceStore.set(cargoPlace.id, itemUpdated);
          hasUpdated = true;
        }
      }
    });

    if (!hasUpdated) {
      Ant.message.warn('Нет совпадений по адресам');
    }
  }, [
    addressesIn,
    addressesOut,
    fieldNameStore,
    fieldNameAddressIn,
    fieldNameAddressOut,
    fieldNameAll,
    store,
    dataSource,
  ]);

  const cargoPlacesAdd = useCallback((fieldName, position) => {
    const cargoPlaceStore = store.getDataItemNoComputed(fieldNameStore);
    runInAction(() => {

      for (const cargoPlace of dataSource) {
        const itemUpdated = {
          ...cargoPlaceStore.get(cargoPlace.id),
          cargoPlaceId: cargoPlace.id,
          [fieldName]: position
        };

        cargoPlaceStore.set(cargoPlace.id, itemUpdated);
      }
    });

  }, [
    fieldNameStore,
    dataSource,
  ]);

  const cargoPlacesResolve = useCallback(() => {
    cargoPlacesAddAuto();
    setSortedMark(uuid());
  }, [cargoPlacesAddAuto]);

  const cargoPlacesClearAll = useCallback(() => {
    runInAction(() => {
      const cargoPlaceStore = store.getDataItemNoComputed(fieldNameStore);

      dataSource.forEach((item) => {
        cargoPlaceStore.delete(item.id);
      });
      setSortedMark(uuid());
    });
  }, [fieldNameStore, dataSource, store]);

  const cargoPlacesClear = useCallback((fieldName) => {
    runInAction(() => {
      const cargoPlaceStore = store.getDataItemNoComputed(fieldNameStore);

      dataSource.forEach((item) => {
        const cargoPlace = cargoPlaceStore.get(item.id);

        if (!cargoPlace) {
          return;
        }

        const itemUpdated = {
          ...cargoPlace
        }

        delete itemUpdated[fieldName];

        if (!itemUpdated[fieldNameAddressIn] && !itemUpdated[fieldNameAddressOut]) {
          cargoPlaceStore.delete(item.id);
          return;
        }

        cargoPlaceStore.set(item.id, itemUpdated);

      });
      setSortedMark(uuid());
    });
  }, [fieldNameStore, dataSource, store, fieldNameAddressIn, fieldNameAddressOut]);

  const context = useMemo(
    () => ({
      cargoPlaceStatuses,
      fieldNameStore,
      fieldNameAddresses,
      fieldNameAll,
      fieldNameValue,
      fieldNameAddressIn,
      fieldNameAddressOut,
      addressesIn,
      addressesOut,
      cargoPlacesResolve,
      cargoPlacesClearAll,
      cargoPlacesAdd,
      cargoPlacesClear,
    }),
    [
      cargoPlaceStatuses,
      fieldNameStore,
      fieldNameAddresses,
      fieldNameAll,
      fieldNameValue,
      fieldNameAddressIn,
      fieldNameAddressOut,
      addressesIn,
      addressesOut,
      cargoPlacesResolve,
      cargoPlacesClearAll,
      cargoPlacesAdd,
      cargoPlacesClear
    ],
  );

  return (
    <OrderCargoPlacesContext.Provider value={context}>
      <OrderCargoPlacesTable params={params} pushParams={pushParams} dataSource={dataSource} />
    </OrderCargoPlacesContext.Provider>
  );
}

OrderCargoPlacesMain.propTypes = {
  cargoPlaceStatuses: PropTypes.array.isRequired,
  fieldNameStore: PropTypes.string.isRequired,
  fieldNameValue: PropTypes.string.isRequired,
  fieldNameAll: PropTypes.string.isRequired,
  fieldNameAddresses: PropTypes.string.isRequired,
  fieldNameAddressOut: PropTypes.string.isRequired,
  fieldNameAddressIn: PropTypes.string.isRequired,
};

export default observer(OrderCargoPlacesMain);
