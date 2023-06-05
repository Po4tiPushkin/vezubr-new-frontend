import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { connect, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import TableConfig from '@vezubr/components/tableConfig';
import { Orders as OrdersService, Profile as ProfileService, Common as CommonService } from '@vezubr/services';
import useParams from '@vezubr/common/hooks/useParams';

import useColumns from './hooks/useColumns';
import useRowClassName from './hooks/useRowClassName';
import useFiltersActions from './hooks/useFiltersActions';
import ExportCSV from '@vezubr/components/export/CSV';
import csvRenderCols from '@vezubr/components/export/CSV/renderCols';
import moment from 'moment';
import t from '@vezubr/common/localization';
import { showError, showAlert, Ant } from '@vezubr/elements';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { camelCaseToSnakeCase } from '@vezubr/common/utils';

import Utils from '@vezubr/common/common/utils';
import useRelatedOrdersColumns from './hooks/useRelatedOrdersColumns';
import useCustomPropsColumns from '@vezubr/common/hooks/useCustomPropsColumns';

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
    paramsQuery.orderUiStates = paramsQuery.orderUiStates.split(',').map((el) => (!isNaN(el) ? +el : el));
    const orderUiStates = [...paramsQuery.orderUiStates];
    let uiStatesForClient = [];
    let uiStatesForProducer = [];
    orderUiStates.forEach((item) => {
      if (isNaN(item) && item?.[0] === '3') {
        item = +item.split('-')[1];
      }
      if (APP !== 'producer' && dictionaries.performerUiStateForClient.find((val) => val.id == item) !== undefined) {
        uiStatesForClient.push(item);
        paramsQuery.orderUiStates = paramsQuery.orderUiStates.filter((value) => value !== item);
        paramsQuery.uiStatesForClient = [...uiStatesForClient];
      }
      if (APP !== 'client' && dictionaries.performerUiStateForProducer.find((val) => val.id == item) !== undefined) {
        uiStatesForProducer.push(item);
        paramsQuery.orderUiStates = paramsQuery.orderUiStates.filter((value) => value !== item);
        paramsQuery.uiStatesForProducer = [...uiStatesForProducer];
      }
    });
    paramsQuery.orderUiStates = paramsQuery.orderUiStates.filter((el) => !isNaN(el));
  }

  if (paramsQuery.firstCities) {
    paramsQuery.firstCities = paramsQuery.firstCities.split(',').map((idString) => +idString);
  }

  if (paramsQuery.lastCities) {
    paramsQuery.lastCities = paramsQuery.lastCities.split(',').map((idString) => +idString);
  }

  if (paramsQuery.requiredBodyTypes) {
    paramsQuery.requiredBodyTypes = paramsQuery.requiredBodyTypes.split(',').map((id) => +id);
  }

  if (paramsQuery.appointedBodyTypes) {
    paramsQuery.appointedBodyTypes = paramsQuery.appointedBodyTypes.split(',').map((id) => +id);
  }

  if (paramsQuery.vehicleTypeCategory) {
    paramsQuery.vehicleTypeCategory = +paramsQuery.vehicleTypeCategory;
  }

  if (paramsQuery.orderType) {
    paramsQuery.orderType = +paramsQuery.orderType;
  }

  if (paramsQuery.orderBy) paramsQuery.orderBy = camelCaseToSnakeCase(paramsQuery.orderBy);

  if (paramsQuery.responsibleEmployee) {
    paramsQuery.responsibleEmployee = +paramsQuery.responsibleEmployee;
  }

  if (paramsQuery.clientTitle && paramsQuery.clientTitle?.length < 3) {
    delete paramsQuery.clientTitle;
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page;
  }

  return paramsQuery;
};

const tableKey = `orders-${APP}`;

const Orders = (props) => {
  const history = useHistory();
  const { location } = history;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);
  let customPropsColumns = []

  const [params, pushParams] = useParams({
    history,
    location,
    paramsName: 'orders',
    paramsDefault: {
      toStartAtDateFrom: moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
      toStartAtDateTill: moment().endOf('day').format('YYYY-MM-DD'),
    },
  });
  const [loadingData, setLoadingData] = useState(false);
  const onOpenRelatedOrdersModal = (value) => setRelatedModalVisible(value);
  const relatedColumns = useRelatedOrdersColumns({ params, pushParams, onOpenRelatedOrdersModal });
  const [relatedModalVisible, setRelatedModalVisible] = useState(false);
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const [employees, setEmployees] = useState([]);

  const { dataSource, total } = data;

  const [useExport, setUseExport] = useState(false);
  if (APP !== 'producer') {
    customPropsColumns = useCustomPropsColumns('order')
  }

  const oldColumns = useColumns({ dictionaries, user, onOpenRelatedOrdersModal });

  const [columns, width] = useColumnsGenerator(tableKey, [...oldColumns, ...customPropsColumns]);
  const [canRefreshFilters, setCanRefreshFilters] = useState(false);
  const [cities, setCities] = useState([]);
  const [citiesTotal, setCitiesTotal] = useState(100000);
  const filtersActions = useFiltersActions({
    dictionaries,
    setUseExport,
    pushParams,
    setCanRefreshFilters,
    employees,
    cities,
    tableKey,
  });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params, dictionaries);
    try {
      const response = await OrdersService.orders({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.orders, paramsQuery?.page)
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

  const fetchCities = useCallback(async () => {
    try {
      const response = await CommonService.cities({ itemsPerPage: citiesTotal });
      if (citiesTotal < response.itemsCount) {
        setCitiesTotal(response.itemsCount);
      } else {
        setCities(response.cities);
      }
    } catch (e) {
      console.error(e);
    }
  }, [citiesTotal]);

  useEffect(() => {
    fetchCities();
  }, [citiesTotal]);

  useEffect(() => {
    fetchData();
  }, [params]);

  useEffect(() => {
    const fetchEmployees = async () => {
      const response = await Utils.fetchAllEmployees();
      setEmployees(response);
    };
    fetchEmployees();
  }, []);

  const getDataFuncForExport = useCallback(async (config) => {
    const paramsQuery = getParamsQuery(params, dictionaries);
    await Utils.exportList(OrdersService, {
      ...QUERY_DEFAULT,
      ...paramsQuery,
      ...{ itemsPerPage: 100, page: 1 },
    },
    config
    );

    return () => { };
  }, [columns, params]);


  const rowClassName = useRowClassName();

  return (
    <div>
      <Filters
        {...{
          params,
          pushParams,
          paramKeys,
          canRefreshFilters,
          setCanRefreshFilters,
          visibleSaveButtons: true,
          filterSetName: 'orders',
          filtersActions,
          title: 'Рейсы',
          tableKey,
        }}
      />
      <TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowClassName,
          rowKey: 'number',
          scroll: { x: width, y: 550 },
          paramKeys,
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <ExportCSV
        useExport={useExport}
        onFinishFunc={() => setUseExport(false)}
        setLoadingStatusFunc={setLoadingData}
        title={'Список Рейсов'}
        getDataFunc={getDataFuncForExport}
        filename={'Рейсы'}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} onExport={getDataFuncForExport} />
      <Ant.Modal
        header={'Связанные рейсы'}
        visible={!!relatedModalVisible}
        onClose={(e) => setRelatedModalVisible(false)}
        onCancel={(e) => setRelatedModalVisible(false)}
        destroyOnClose={true}
        maskClosable={true}
        footer={null}
        width={800}
      >
        <Ant.Table
          pagination={false}
          dataSource={dataSource?.find((item) => item.orderId == relatedModalVisible)?.relatedOrders}
          columns={relatedColumns}
          rowKey={'id'}
        />
      </Ant.Modal>
    </div>
  );
};

export default Orders;
