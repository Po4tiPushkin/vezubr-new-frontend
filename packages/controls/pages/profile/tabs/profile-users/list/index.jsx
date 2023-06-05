import React, { useState, useCallback, useMemo, useEffect } from 'react';
import t from '@vezubr/common/localization';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions'
import { VzTableFiltered } from '@vezubr/components';
import { EmptyBlockDeprecated, ButtonDeprecated } from '@vezubr/elements';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { useSelector } from 'react-redux';
import { Profile as ProfileService, Unit as UnitService, Employees as EmployeesService } from '@vezubr/services';
import { showAlert, showError } from "@vezubr/elements";
import { Utils } from '@vezubr/common/common';
const paramKeys = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
  page: 'page',
};

const tableKey = 'users';

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
    page: +params.page || 1,
  }

  const minLengthFields = ['fullName', 'unitTitle', 'phone', 'email',];

  for (const fieldName of minLengthFields) {
    if (paramsQuery[fieldName] && paramsQuery[fieldName].length < 2) {
      delete paramsQuery[fieldName];
    }
  }
  return paramsQuery;

}

function UsersList(props) {
  const dictionaries = useSelector((state) => state.dictionaries);
  const { goToEditUser, history } = props
  const user = useSelector(state => state.user);
  const { itemsPerPage } = QUERY_DEFAULT;
  const [params, pushParams] = useParamsState({ paramsDefault: { orderBy: "fullName", orderDirection: 'DESC' } });
  const [loadingData, setLoadingData] = useState(false);
  const [unitList, setUnitList] = useState([]);
  const [groups, setGroups] = useState([]);
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });

  const { dataSource, total } = data;

  const reloadUsers = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  const [columns, width] = useColumns({ dictionaries, userId: user?.id, goToEditUser, reloadUsers, groups })

  const fetchUnits = useCallback(async () => {
    try {
      const response = await UnitService.list({ itemsPerPage: 1000000 });
      setUnitList(response);
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, []);

  const fetchGroups = useCallback(async () => {
    try {
      const response = await ProfileService.contractorGroupsList({ itemsPerPage: 100 });
      const dataSource = response.requestGroups;
      let page = 2;
      const totalPages = Math.ceil(response.itemsCount / 100);
      while (page <= totalPages) {
        const newResponse =
          await ProfileService.contractorGroupsList({ itemsPerPage: 100, page });
        page += 1;
        dataSource.push(...newResponse.requestGroups);
      }
      setGroups(dataSource);
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [])
  const goToCreateUser = useCallback(() => {
    history.push(`/profile/users/add`);
  }, [history]);


  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const paramsQuery = getParamsQuery(params)
      const users = await ProfileService.contractorUsers({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(Object.values(users.items), paramsQuery?.page)
      const total = users.itemCount;
      setData({ dataSource, total });
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  }, [params]);

  const getDataFuncForExport = useCallback(async () => {
    const paramsQuery = getParamsQuery(params, dictionaries);
    await Utils.exportList(EmployeesService, {
      ...QUERY_DEFAULT,
      ...paramsQuery,
      ...{ itemsPerPage: 100, page: 1 },
    },);

    return () => { };
  }, [columns, params, dictionaries]);

  useEffect(() => {
    fetchUnits();
    if (APP === 'dispatcher') {
      fetchGroups();
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [params])

  const filtersActions = useFiltersActions({ dictionaries, unitList, groups, getDataFuncForExport });

  return (
    <div className={'center size-1'} style={{ 'overflowX': 'scroll' }}>
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          filterSetName: 'users',
          filtersActions
        }}
      />
      {!dataSource.length ? <EmptyBlockDeprecated theme={'users'} /> : null}
      {dataSource.length ? (
        <VzTableFiltered.TableFiltered
          {...{
            params,
            paramKeys,
            loading: loadingData,
            pushParams,
            dataSource,
            columns,
            rowKey: 'id',
            responsive: false,
            scroll: { w: width, y: 450 },
            paginatorConfig: {
              total,
              itemsPerPage,
            },
          }}
        />
      ) : null}
      {IS_ADMIN && (
        <div className={'bottom-wrapper flexbox justify-right'}>
          <ButtonDeprecated theme={'primary'} onClick={goToCreateUser} className={'mid'}>
            {t.profile('addUser')}
          </ButtonDeprecated>
        </div>
      )}
    </div>
  )
}

export default UsersList;
