import { Utils } from '@vezubr/common/common';
import useParams from "@vezubr/common/hooks/useParamsState";
import { VzTableFiltered } from '@vezubr/components';
import { Ant, showError } from '@vezubr/elements';
import { Profile as ProfileService, Unit as UnitService } from '@vezubr/services';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useColumns from './hooks/useColumns';
import useFiltersActions from './hooks/useFiltersActions';
const paramKeys = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
  page: 'page',
};

const QUERY_DEFAULT = {
  itemsPerPage: 100,
};

const getParamsQuery = (params) => {
  const paramsQuery = {
    ...params,
    page: +params.page || 1,
  }

  const minLengthFields = ['fullName', 'unitTitle', 'phone', 'email', ];

  for (const fieldName of minLengthFields) {
    if (paramsQuery[fieldName] && paramsQuery[fieldName].length < 2) {
      delete paramsQuery[fieldName];
    }
  }
  return paramsQuery;

}

const ProfileUsersSelectList = (props) => {
  const { onSave, onCancel } = props;
  const dictionaries = useSelector(state => state.dictionaries);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]);
  const [groups, setGroups] = useState([]);
  const { itemsPerPage } = QUERY_DEFAULT;
  const [{ dataSource, total }, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const [params, pushParams] = useParams({
    paramsDefault: {},
  });
  const [columns, width] = useColumns({ dictionaries, groups });

  const rowSelection = {
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
    },
  };

  const fetchUnits = async () => {
    try {
      const response = await UnitService.list({ itemsPerPage: 1000000 });
      setUnits(response);
    } catch (e) {
      showError(e);
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true);
      const paramsQuery = getParamsQuery(params)
      const users = await ProfileService.contractorUsers({ ...QUERY_DEFAULT, ...paramsQuery });
      const dataSource = Utils.getIncrementingId(Object.values(users.items), paramsQuery?.page)
      const total = users.itemCount;
      setData({ dataSource, total });
    } catch (e) {
      showError(e)
      console.error(e)
    }
    finally {
      setLoading(false)
    }
  }

  const handleSubmit = () => {
    if (onSave) {
      onSave(selectedRowKeys);
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

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

  const filtersActions = useFiltersActions({ units, dictionaries, groups });

  useEffect(() => {
    fetchUnits();
    if (APP === 'dispatcher') {
      fetchGroups();
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [params]);
  return (

    <div>
      <VzTableFiltered.Filters
        {...{
          params,
          pushParams,
          filtersActions
        }}
      />
      <VzTableFiltered.TableFiltered
        {...{
          params,
          paramKeys,
          pushParams,
          dataSource,
          columns,
          loading,
          rowKey: 'id',
          rowSelection,
          scroll: { x: width, y: 550 },
          paginatorConfig: {
            total,
            itemsPerPage,
          },
        }}
      />
      <div className='user-contractors__actions'>
        <Ant.Button onClick={handleCancel}>
          Отмена
        </Ant.Button>
        <Ant.Button onClick={handleSubmit}>
          Подтвердить
        </Ant.Button>
      </div>
    </div>
  )
}

export default ProfileUsersSelectList;