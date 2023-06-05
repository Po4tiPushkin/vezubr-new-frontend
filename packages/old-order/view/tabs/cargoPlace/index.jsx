import React, { useCallback, useMemo, useRef, useState, useContext } from 'react';
import { Ant, showAlert, showError, VzForm, VzTable, WhiteBox } from '@vezubr/elements';
import useColumns from './hooks/useColumns';
import useColumnsDefault from './hooks/useColumnsDefault';
import useFiltersActions from './hooks/useFilterActions';
import { CargoPlaceChangeContext, CargoPlaceSelectContext } from './context';
import { CargoPlace as CargoPlaceService } from '@vezubr/services';
import { Filters } from '@vezubr/components/tableFiltered';
import _get from 'lodash/get';
import _isEmpty from 'lodash/isEmpty';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { useSelector } from 'react-redux';

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const paramsToData = {
  statusAddress: 'statusAddress.addressString',
  deliveryId: 'deliveryAddress.id',
  externalId: 'deliveryAddress.externalId',
};

function filterDefault(record, params) {
  for (const paramName of Object.keys(params)) {
    const paramValue = (typeof params[paramName] === 'string') ? params[paramName].toLowerCase() : params[paramName];

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

const filters = [filterDefault];

function filteredData(data, paramsInput) {
  const params = { ...paramsInput };

  if (_isEmpty(params)) {
    return data;
  }

  return data.filter((record) => {
    let localParams = params;

    for (const filterFun of filters) {
      const filterInfo = filterFun(record, localParams);
      if (filterInfo.result === false) {
        return false;
      }

      localParams = filterInfo.params;
    }

    return true;
  });
}

export default function OrderCargoPlace(props) {
  const { order, cargoPlace: dataSource } = props;
  const dictionaries = useSelector(state => state.dictionaries);
  const dataFieldsRef = useRef([]);
  const [cargoPlaceData, setCargoPlaceData] = useState(dataSource);
  const [visibleButton, setVisibleButton] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const tableKey = editStatus ? 'editTable' : 'defaultTable';
  const editColumns = useColumns(cargoPlaceData);
  const defaultColumns = useColumnsDefault(cargoPlaceData);

  const editable = useMemo(() => {
    return order?.orderUiState?.state < 400;
  }, [order])

  const addressList = order?.points;
  const filtersActions = useFiltersActions(cargoPlaceData, addressList, order);
  const otherProps = useMemo(() => {
    if (editStatus) {
      const [columns, width] = editColumns;
      return {
        columns: columns,
        scroll: { x: width, y: 550 }
      }
    } else {
      const [columns, width] = defaultColumns;
      return {
        columns: columns,
        scroll: { x: width, y: 550 }
      }
    }
  }, [editStatus, editColumns, defaultColumns]);

  const [params, pushParamsInner] = useParamsState();
  const pushParams = useCallback(({ page, ...otherProps }) => pushParamsInner(otherProps), [pushParamsInner]);
  const filteredDataSource = useMemo(() => filteredData(cargoPlaceData, params), [
    params,
    filteredData,
    cargoPlaceData,
  ]);

  const fieldUpdate = (id, field, value, addressString) => {
    const fieldRef = field === 'status' ? field : 'statusPointId';
    const curIndexRef = dataFieldsRef.current.findIndex((item) => {
      return id === item?.id;
    });

    if (curIndexRef > -1) {
      dataFieldsRef.current[curIndexRef] = {
        ...dataFieldsRef.current[curIndexRef],
        ...{[fieldRef]: value},
      }
    } else {
      dataFieldsRef.current.push({
        id: id,
        [fieldRef]: value,
      });
    }

    const newCargoData = cargoPlaceData.map((item) => {
      if (item.id === id) {
        if (field !== 'status') {
          item[field] = {
            ...item[field],
            ...{
              id: value,
              addressString
            },
          }
        } else {
          item[field] = value;
        }
      }
      return item;
    });

    if (!visibleButton) {
      setVisibleButton(true);
    }
    setCargoPlaceData(newCargoData);
  }

  const updateAllFields = (field, value, addressString) => {
    const fieldRef = field !== 'status' ? 'statusPointId' : field;
    dataFieldsRef.current = dataSource.map((item, index) => {
      const findIndex = dataFieldsRef.current.findIndex((itemRef) => itemRef?.id === item.id);

      if (findIndex > -1) {
        return {
          ...dataFieldsRef.current[findIndex],
          ...{[fieldRef]: value},
        }
      } else {
        return {
          id: item.id,
          [fieldRef]: value,
        }
      }
    });

    const newData = cargoPlaceData.map((item) => {
      if (field !== 'status') {
        return {
          ...item,
          ...{[field]: {
              id: value,
              addressString
            }},
        }
      } else {
        return {
          ...item,
          [field]: value,
        }
      }
    });

    if (!visibleButton) {
      setVisibleButton(true);
    }
    setCargoPlaceData(newData);
  }

  const handleSave = async () => {
    if (dataFieldsRef.current.length > 0) {
      try {
        await CargoPlaceService.groupUpdate({ orderId: order?.id, cargoPlacesUpdate: dataFieldsRef.current});
        dataFieldsRef.current = [];
        setEditStatus(false);
        showAlert({ title: 'Грузоместа успешно сохранены'});
      } catch(e) {
        console.error(e);
        showError(e);
      }
    } else {
      setEditStatus(false);
    }
  };

  const handleCancel = () => {
    setCargoPlaceData(dataSource);
    setEditStatus(false);
  };

  const handleEdit = () => {
    setEditStatus(true);
  };

  return (
    <div className={'white-container connected-order flexbox column order-cargo-place order-view__tab'}>
      <WhiteBox.Header
        style={{ marginTop: 0 }}
        type={'h2'}
        hr={false}
        icon={<Ant.Icon type={'form'} />}
        iconStyles={{ color: '#F57B23' }}
      >
        Сведения о грузоместах
      </WhiteBox.Header>
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'cargo_place_order',
          filtersActions,
        }}
      />
      <div className={'order-cargo-place-viewer'}>
        <CargoPlaceSelectContext.Provider value={{cargoPlaceStatuses: dictionaries?.cargoPlaceStatuses, addressList}}>
          <CargoPlaceChangeContext.Provider value={{fieldUpdate, updateAllFields}}>
            <VzTable.Table
              {...otherProps}
              className={'order-cargo-place-viewer__table'}
              bordered={false}
              dataSource={filteredDataSource}
              rowKey={'id'}
              key={tableKey}
              pagination={false}
            />
          </CargoPlaceChangeContext.Provider>
        </CargoPlaceSelectContext.Provider>
        {editable && (editStatus ? (
          <VzForm.Actions>
            <Ant.Button onClick={handleCancel} className={'semi-wide margin-left-16'}>
              Отмена
            </Ant.Button>
            <Ant.Button type="primary" onClick={handleSave} className={'semi-wide margin-left-16'}>
              Сохранить
            </Ant.Button>
          </VzForm.Actions>
        ) : (
          <VzForm.Actions>
            <Ant.Button type="primary" onClick={handleEdit} className={'semi-wide margin-left-16'}>
              Редактировать
            </Ant.Button>
          </VzForm.Actions>
        ))}
      </div>
    </div>
  )
}