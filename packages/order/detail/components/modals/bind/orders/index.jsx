import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { useSelector } from 'react-redux';
import { Orders as OrdersService } from '@vezubr/services';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import moment from 'moment';
import { showError, showAlert, Ant } from '@vezubr/elements';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { camelCaseToSnakeCase } from "@vezubr/common/utils"

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params, dictionaries) => {
  const paramsQuery = {
    ...params,
  };
  if (paramsQuery.orderUiStates) {
    paramsQuery.orderUiStates = paramsQuery.orderUiStates.map(el => (!isNaN(el) ? +el : el));
    const orderUiStates = [...paramsQuery.orderUiStates]
    let uiStatesForClient = []
    let uiStatesForProducer = []
    orderUiStates.forEach((item) => {
      if (isNaN(item) && item?.[0] === '3') {
        item = +item.split('-')[1];
      }
      if (APP !== 'producer' && dictionaries.performerUiStateForClient.find(val => val.id == item) !== undefined) {
        uiStatesForClient.push(item)
        paramsQuery.orderUiStates = paramsQuery.orderUiStates.filter((value) => value !== item)
        paramsQuery.uiStatesForClient = [...uiStatesForClient]
      }
      if (APP !== 'client' && dictionaries.performerUiStateForProducer.find(val => val.id == item) !== undefined) {
        uiStatesForProducer.push(item)
        paramsQuery.orderUiStates = paramsQuery.orderUiStates.filter((value) => value !== item)
        paramsQuery.uiStatesForProducer = [...uiStatesForProducer]
      }
    })
    paramsQuery.orderUiStates = paramsQuery.orderUiStates.filter(el => !isNaN(el));
  }

  if (paramsQuery.firstCities) {
    paramsQuery.firstCities = paramsQuery.firstCities.split(',').map((idString) => +idString);
  }

  if (paramsQuery.lastCities) {
    paramsQuery.lastCities = paramsQuery.lastCities.split(',').map((idString) => +idString);
  }

  if (paramsQuery.vehicleTypeCategory) {
    paramsQuery.vehicleTypeCategory = +paramsQuery.vehicleTypeCategory;
  }

  if (paramsQuery.orderType) {
    paramsQuery.orderType = +paramsQuery.orderType;
  }

  if (paramsQuery.orderBy) paramsQuery.orderBy = camelCaseToSnakeCase(paramsQuery.orderBy)

  if (paramsQuery.responsibleEmployee) {
    paramsQuery.responsibleEmployee = +paramsQuery.responsibleEmployee;
  }

  if (paramsQuery.clientTitle && paramsQuery.clientTitle?.length < 3) {
    delete paramsQuery.clientTitle;
  }

  return paramsQuery;
};

const tableKey = `orders-bind`;

const Orders = (props) => {
  const { selectedRows = [], setSelectedRows } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);

  const [params, pushParams] = useParamsState({
    paramsDefault: {
      toStartAtDateFrom: moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
      toStartAtDateTill: moment().endOf('day').format('YYYY-MM-DD'),
    },
  });
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const { dataSource, total } = data;

  const oldColumns = useColumns({ dictionaries, user });

  const [columns, width] = useColumnsGenerator(tableKey, oldColumns);

  const filtersActions = useFiltersActions({
    dictionaries,
  });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params, dictionaries);
    try {
      const response = await OrdersService.orders({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = response?.orders || [];
      const total = response?.itemsCount || dataSource.length;
      setData({ dataSource, total });
      setLoadingData(false);
    } catch (e) {
      console.error(e);
      if (typeof e.message !== 'undefined') {
        showError(e);
        setLoadingData(false);
      }
    }
  };

  useEffect(() => {
    fetchData();
  }, [params]);

  const rowSelection = {
    selectedRowKeys: selectedRows,
    onChange: (selectedRowKeys) => {
      setSelectedRows(selectedRowKeys);
    },
  };

  return (
    <div>
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          filterSetName: 'orders-bind',
          filtersActions,
          title: 'Рейсы',
          showArrow: false,
        }}
      />
      <TableFiltered
        {...{
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowKey: 'orderId',
          scroll: { x: width, y: '40vh' },
          paramKeys,
          rowSelection,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
    </div>
  );
}

export default Orders;
