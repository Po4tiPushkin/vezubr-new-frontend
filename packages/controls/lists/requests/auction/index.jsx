import Utils from '@vezubr/common/common/utils';
import useCustomPropsColumns from '@vezubr/common/hooks/useCustomPropsColumns';
import useParams from '@vezubr/common/hooks/useParams';
import { AssignTransportToOrderNew } from '@vezubr/components';
import TableConfig from '@vezubr/components/tableConfig';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { showAlert, showError } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import moment from 'moment';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import useRowClassName from './hooks/useRowClassName';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
  };

  const minLengthFields = ['producerTitle', 'clientTitle', 'firstAddress', 'lastAddress'];
  for (const fieldName of minLengthFields) {
    if (paramsQuery[fieldName] && paramsQuery[fieldName].length < 3) {
      delete paramsQuery[fieldName];
    }
  }

  if (paramsQuery.requiredBodyTypes) {
    paramsQuery.requiredBodyTypes = paramsQuery.requiredBodyTypes.split(',').map((id) => +id);
  }
  if (paramsQuery.orderType) {
    paramsQuery.orderType = +paramsQuery.orderType;
  }

  if (paramsQuery.isInsuranceRequired) {
    paramsQuery.isInsuranceRequired = Boolean(+paramsQuery.isInsuranceRequired)
  }

  if (paramsQuery.hasComment) {
    paramsQuery.hasComment = Boolean(+paramsQuery.hasComment)
  }

  if (paramsQuery.hasAdditionalParams) {
    paramsQuery.hasAdditionalParams = Boolean(+paramsQuery.hasAdditionalParams)
  }

  if (paramsQuery.implementerEmployeeId) {
    paramsQuery.implementerEmployeeId = +paramsQuery.implementerEmployeeId
  }

  if (paramsQuery.requiredVehicleTypeId) {
    paramsQuery.requiredVehicleTypeId = +paramsQuery.requiredVehicleTypeId
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page;
  }

  return paramsQuery;
};

const tableKey = `requests-auction-${APP}`;

const RequestsAuction = (props) => {
  const history = useHistory();
  const { location } = history;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);
  let customPropsColumns = []

  const [params, pushParams] = useParams({
    history,
    location,
    paramsName: 'requests-auction',
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
  const [employees, setEmployeesList] = useState([]);
  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params, dictionaries);
    try {
      const response = await OrdersService.requestAuctionList({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.requests, paramsQuery?.page)
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

  if (APP !== 'producer') {
    customPropsColumns = useCustomPropsColumns('order')
  }

  const reload = () => {
    fetchData();
  }

  const oldColumns = useColumns({ dictionaries, user, reload });
  const [columns, width] = useColumnsGenerator(tableKey, [...oldColumns, ...customPropsColumns]);
  const [canRefreshFilters, setCanRefreshFilters] = useState(false);
  const filtersActions = useFiltersActions({
    pushParams,
    setCanRefreshFilters,
    employees,
    dictionaries
  });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchEmployees = async () => {
    try {
      const employees = await Utils.fetchAllEmployees()
      setEmployeesList(employees)
    } catch (e) {
      showError(e)
      console.error(e)
    }
  }

  useEffect(() => {
    fetchEmployees()
  }, [])
  useEffect(() => {
    fetchData();
  }, [params]);

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
          filterSetName: 'requests-auction',
          filtersActions,
          title: 'Активные заявки в торгах',
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
      <TableConfig tableKey={tableKey} onSave={fetchData} />
    </div>
  );
};

export default RequestsAuction;
