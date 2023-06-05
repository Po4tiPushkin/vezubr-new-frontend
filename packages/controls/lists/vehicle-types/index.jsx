import useParamsState from '@vezubr/common/hooks/useParamsState';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { Vehicle as VehicleService } from '@vezubr/services';
import React, { useCallback, useEffect, useState } from 'react';

import _sortBy from 'lodash/sortBy';
import _difference from 'lodash/difference';
import { showError, Ant } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import useColumns from './hooks/useColumns';
import { store } from '../../infrastructure';
import useFiltersActions from './hooks/useFiltersActions';
import t from '@vezubr/common/localization';

const paramKeys = {
  category: 'category',
  liftingCapacityMin: 'liftingCapacityMin',
};

const QUERY_DEFAULT = {
  category: null,
  liftingCapacityMin: null,
};

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  if (paramsQuery.liftingCapacityMin) {
    paramsQuery.liftingCapacityMin = +paramsQuery.liftingCapacityMin.replaceAll(',', '.') * 1000;
  }

  return paramsQuery;
};

const VehicleTypes = (props) => {
  const { dataSource = dictionaries.vehicleTypes, getVehicleTypes: getVehicleTypesInput, filtersVisible = true, hint = t.transports('vehicleTypesSettingsHint'), title = 'Типы ТС' } = props
  const [params, pushParams] = useParamsState({ paramsDefault: QUERY_DEFAULT });
  // const [dataSource, setDataSource] = useState(dataSourceInput);
  const dictionaries = useSelector((state) => state.dictionaries);
  const [loading, setLoading] = useState(false);
  const [selectedVehicleTypes, setSelectedVehicleTypes] = useState(dictionaries.contourVehicleTypes.map((item) => item.id));
  const [defaultSelected, setDefaultSelected] = useState(dictionaries.contourVehicleTypes.map((item) => item.id));

  const getVehicleTypes = useCallback(async () => {
    try {
      setLoading(true);
      const paramsQuery = getParamsQuery(params);
      await getVehicleTypesInput({ ...QUERY_DEFAULT, ...paramsQuery })
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [params]);

  const onSave = useCallback(
    async (vehicleTypes) => {
      try {
        await VehicleService.setContourTypes({ vehicleTypes });
        getVehicleTypes();
        const newVehicleTypes = _sortBy(
          await VehicleService.contourTypes({ category: null, liftingCapacityMin: null }),
          (d) => d.orderPosition,
        );
        store.dispatch({
          type: 'SET_DICTIONARIES',
          dictionaries: {
            ...dictionaries,
            contourVehicleTypes: newVehicleTypes,
          },
        });
        setDefaultSelected(newVehicleTypes.map((item) => item.id));
      } catch (e) {
        showError(e);
        console.error(e);
      }
    },
    [params],
  );

  const onCancel = React.useCallback(() => {
    setSelectedVehicleTypes(defaultSelected);
  }, [defaultSelected]);

  const edited = React.useMemo(() => {
    return (
      _difference(selectedVehicleTypes, defaultSelected).length > 0 ||
      _difference(defaultSelected, selectedVehicleTypes).length > 0
    );
  }, [selectedVehicleTypes, defaultSelected]);

  useEffect(() => {
    getVehicleTypes();
  }, [params]);

  const rowSelection = {
    selectedRowKeys: selectedVehicleTypes,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedVehicleTypes(selectedRowKeys);
    },
  };

  const columns = useColumns(dictionaries);
  const filtersActions = useFiltersActions(
    {
      onSave,
      selectedVehicleTypes,
      onCancel,
      edited,
      filtersVisible,
      vehicleBodies: dictionaries.vehicleBodies
    });
  return (
    <div className='vehicle-types__table'>
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          showArrow: false,
          filterSetName: 'vehicle-types',
          filtersActions,
          title: (
            <>
              <Ant.Tooltip
                placement="right"
                title={hint}
              >
                <div className={`settings-page__hint-title`}>{title} {<Ant.Icon type={'info-circle'} />}</div>
              </Ant.Tooltip>
            </>
          ),
          classNames: 'vehicle-types__settings',
        }}
      />
      <TableFiltered
        {...{
          params,
          pushParams,
          loading,
          columns,
          dataSource: [...dataSource].sort(el => (!!dictionaries.contourVehicleTypes.find(item => item.id === el.id) ? -1 : 1)),
          rowKey: 'id',
          scroll: { x: true, y: 350 },
          paramKeys,
          rowSelection,
          responsive: false,
        }}
      />
    </div>
  );
};

export default VehicleTypes;
