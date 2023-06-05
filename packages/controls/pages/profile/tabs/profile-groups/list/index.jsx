import { Utils } from '@vezubr/common/common';
import Cookies from '@vezubr/common/common/cookies';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import t from '@vezubr/common/localization';
import { VzTableFiltered } from '@vezubr/components';
import { ButtonDeprecated, showConfirm, showError } from '@vezubr/elements';
import { Profile as ProfileService } from '@vezubr/services';
import jwtDecode from 'jwt-decode';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import useColumns from './hooks/useColumns';
const paramKeys = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = 'groups';

function GroupsList(props) {
  const dictionaries = useSelector((state) => state.dictionaries);
  const { groupAddEditMode, goToEditGroup, history } = props;
  const { userId } = jwtDecode(Cookies.get(`${APP}Token`));

  const [params, pushParams] = useParamsState();
  const [loadingData, setLoadingData] = useState(false);
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const [defaultData, setDefaultData] = useState([]);

  const { dataSource, total } = data;

  const onDeleteGroup = async (groupId) => {
    try {
      showConfirm({
        content: 'Вы уверены?',
        title: '',
        onOk: async () => {
          await ProfileService.contractorDeleteGroup(groupId);
          reloadGroups()
        }
      })
    } catch (e) {
      showError(e)
      console.warn(e);
    }
  }

  const reloadGroups = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const [columns, width] = useColumns({ dictionaries, onDeleteGroup });

  const goToCreateGroup = useCallback(() => {
    history.push(`/profile/groups/add`);
  }, [history]);

  const fetchData = useCallback(async () => {
    setLoadingData(true);
    try {
      const groups = (await ProfileService.contractorGroupsList()).requestGroups || [];
      const dataSource = Utils.getIncrementingId(groups, 1);
      const total = dataSource.length;
      setData({ dataSource, total });
      setDefaultData(dataSource);
    } catch (e) {
      console.error(e);
      showError(e);
    }
    setLoadingData(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let newDataSource = defaultData;

    setLoadingData(true);
    const { orderBy, orderDirection, ...filterParams } = params;
    if (filterParams) {
      Object.entries(filterParams).forEach(([field, value]) => {
        newDataSource = newDataSource.filter((record) => {
          if (field === 'isActive') {
            return record[field] === value;
          } else {
            return true;
          }
        });
      });
    }

    if (orderBy && orderDirection) {
      newDataSource = _.sortBy(newDataSource, orderBy);

      if (orderDirection == 'DESC') {
        newDataSource = newDataSource.reverse();
      }
    }

    setData({
      dataSource: newDataSource,
      total,
    });
    setLoadingData(false);
  }, [params]);

  // const filtersActions = useFiltersActions();
  return (
    <div className={'center size-1'} style={{ overflowX: 'scroll' }}>

      <VzTableFiltered.TableFiltered
        {...{
          params,
          paramKeys,
          loading: loadingData,
          pushParams,
          dataSource,
          responsive: false,
          columns,
          rowKey: 'id',
          scroll: { w: width, y: 450 },
        }}
      />

      <div className={'bottom-wrapper flexbox justify-right'}>
        <ButtonDeprecated theme={'primary'} onClick={goToCreateGroup} className={'mid'}>
          {t.profile('addGroup')}
        </ButtonDeprecated>
      </div>
    </div>
  );
}

export default GroupsList;
