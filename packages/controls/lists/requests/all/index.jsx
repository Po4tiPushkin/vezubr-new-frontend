import Utils from '@vezubr/common/common/utils';
import useCustomPropsColumns from '@vezubr/common/hooks/useCustomPropsColumns';
import { ProfileUsersSelectList } from '@vezubr/components';
import useParams from '@vezubr/common/hooks/useParams';
import TableConfig from '@vezubr/components/tableConfig';
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import { Ant, Modal, showAlert, showError } from '@vezubr/elements';
import { Orders as OrdersService, Requests as RequestsService } from '@vezubr/services';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
import useRowClassName from './hooks/useRowClassName';
import ExportCSV from '@vezubr/components/export/CSV';

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
    paramsQuery.isInsuranceRequired = Boolean(+paramsQuery.isInsuranceRequired);
  }

  if (paramsQuery.hasComment) {
    paramsQuery.hasComment = Boolean(+paramsQuery.hasComment);
  }

  if (paramsQuery.hasAdditionalParams) {
    paramsQuery.hasAdditionalParams = Boolean(+paramsQuery.hasAdditionalParams);
  }

  if (paramsQuery.implementerEmployeeId) {
    paramsQuery.implementerEmployeeId = +paramsQuery.implementerEmployeeId;
  }

  if (paramsQuery.requiredVehicleTypeId) {
    paramsQuery.requiredVehicleTypeId = +paramsQuery.requiredVehicleTypeId;
  }

  if (paramsQuery.page) {
    paramsQuery.page = +paramsQuery.page;
  }

  return paramsQuery;
};

const tableKey = `requests-all-${APP}`;

const Requests = (props) => {
  const history = useHistory();
  const { location } = history;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);
  let customPropsColumns = [];
  const [selectedRequests, setSelectedRequests] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [useExport, setUseExport] = useState(false);

  const [params, pushParams] = useParams({
    history,
    location,
    paramsName: 'requests-all',
    paramsDefault: {
      toStartAtDateFrom: moment().startOf('day').subtract(7, 'days').format('YYYY-MM-DD'),
      toStartAtDateTill: moment().endOf('day').format('YYYY-MM-DD'),
      requestGroupId: user.requestGroupIds.length == 1 ? user.requestGroupIds[0] : undefined
    },
  });
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const { dataSource, total } = data;
  const [employees, setEmployeesList] = useState([]);
  const [groups, setGroupsList] = useState([]);
  const [reasonsList, setReasonsList] = useState([]);
  const fetchData = async () => {
    setLoadingData(true);
    const paramsQuery = getParamsQuery(params, dictionaries);
    try {
      const response = await RequestsService.requestList({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(response?.requests, paramsQuery?.page);
      const total = response?.itemsCount || dataSource.length;
      setData({ dataSource, total });
      setLoadingData(false);
    } catch (e) {
      console.error(e);
      if (typeof e.data?.message !== 'undefined') {
        showError(e);
        setLoadingData(false);
      }
    }
  };

  if (APP !== 'producer') {
    customPropsColumns = useCustomPropsColumns('order');
  }

  const reload = () => {
    fetchData();
  };

  const oldColumns = useColumns({ dictionaries, user, reload, employees, reasonsList });
  const [columns, width] = useColumnsGenerator(tableKey, [...oldColumns, ...customPropsColumns]);
  const [canRefreshFilters, setCanRefreshFilters] = useState(false);
  const filtersActions = useFiltersActions({
    pushParams,
    setCanRefreshFilters,
    dictionaries,
    employees,
    groups,
    setUseExport,
  });

  const { itemsPerPage } = QUERY_DEFAULT;

  const fetchEmployees = async () => {
    try {
      const employees = await Utils.fetchAllEmployees();
      setEmployeesList(employees);
    } catch (e) {
      showError(e);
      console.error(e);
    }
  };

  const fetchGroups = async () => {
    try {
      const groups = await Utils.fetchAllGroups();
      setGroupsList(groups);
    } catch (e) {
      showError(e);
      console.error(e);
    }
  };

  const fetchReasons = async () => {
    try {
      const groups = await Utils.fetchAllCancellationReasons();
      setReasonsList(groups);
    } catch (e) {
      showError(e);
      console.error(e);
    }
  };

  useEffect(() => {
    fetchEmployees();
    if (APP === 'dispatcher') {
      fetchGroups();
    }
    fetchReasons();
  }, []);

  const getDataFuncForExport = React.useCallback(async (config) => {
    const paramsQuery = getParamsQuery(params, dictionaries);
    await Utils.exportList(
      RequestsService,
      {
        ...QUERY_DEFAULT,
        ...paramsQuery,
        ...{ itemsPerPage: 100, page: 1 },
      },
      config,
      {
        active: false,
      },
    );

    return () => { };
  }, [columns, params]);

  useEffect(() => {
    fetchData();
  }, [params]);

  const onSelectChange = (selectedRowKeys) => {
    setSelectedRequests(selectedRowKeys);
  };

  const rowSelection = React.useMemo(
    () => (APP !== 'client' ? {
      selectedRowKeys: selectedRequests,
      onChange: onSelectChange,
      fixed: true,
    } : null),
    [selectedRequests],
  );

  const rowClassName = useRowClassName();

  const takeRequest = React.useCallback(
    async (newUser) => {
      try {
        await RequestsService.takeRequest({
          orderIds: selectedRequests?.map((item) => item.split('-')[0]),
          employeeId: newUser,
        });
        showAlert({
          title: `Заявк${selectedRequests.length > 1 ? 'и' : 'а'} успешно ${
            showModal
              ? `переназначен${selectedRequests.length > 1 ? 'ы' : 'а'}`
              : `взят${selectedRequests.length > 1 ? 'ы' : 'а'} в работу`
          }`,
        });
        setShowModal(false);
        setSelectedRequests([]);
        reload();
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [selectedRequests],
  );

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
          filterSetName: 'requests',
          filtersActions,
          title: 'Архив заявок',
        }}
      />
      {
        APP !== 'client' ? (
          <div className="flexbox align-center justify-right margin-bottom-20">
            <Ant.Button
              type={'primary'}
              disabled={
                selectedRequests.length == 0 ||
                (!IS_ADMIN ? (
                  selectedRequests.some((value) => value.split('-')[1] != user?.decoded?.userId)
                ) : (
                  false
                ))
              }
              className={'margin-right-10'}
              onClick={() => setShowModal(true)}
            >
              Переназначить
            </Ant.Button>
            <Ant.Button
              type={'primary'}
              disabled={selectedRequests.length == 0 || selectedRequests.some((value) => value.split('-')[1])}
              className={'margin-right-10'}
              onClick={() => takeRequest(user?.decoded?.userId)}
            >
              Взять в работу
            </Ant.Button>
          </div>
        ) : null
      }
      <TableFiltered
        {...{
          tableKey,
          params,
          pushParams,
          loading: loadingData,
          columns,
          dataSource,
          rowClassName,
          rowKey: (record) => `${record.orderId}-${record.implementerEmployeeId || ''}`,
          scroll: { x: width, y: 550 },
          paramKeys,
          rowSelection,
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
        title={'Список Активных Заявок'}
        getDataFunc={getDataFuncForExport}
        filename={'Рейсы'}
      />
      <TableConfig tableKey={tableKey} onSave={fetchData} onExport={getDataFuncForExport} />
      <Modal visible={showModal} width={'85vw'} footer={[]} onCancel={() => setShowModal(false)}>
        <ProfileUsersSelectList
          onCancel={() => setShowModal(false)}
          onSave={(e) => takeRequest(e[0])}
          defaultParams={{ employeeRoles: [14] }}
          submitButtonText={'Передать в работу'}
        />
      </Modal>
    </div>
  );
};

export default Requests;
