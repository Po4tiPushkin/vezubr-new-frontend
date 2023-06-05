import React, { useState, useCallback, useMemo, useEffect } from 'react';
import t from '@vezubr/common/localization';
import useColumns from './hooks/useColumns';
import { VzTableFiltered } from '@vezubr/components';
import { sortBy } from 'lodash'
import { EmptyBlockDeprecated, ButtonDeprecated } from '@vezubr/elements';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { useSelector } from 'react-redux';
import { showAlert, showError } from "@vezubr/elements";
import useColumnsGenerator from '@vezubr/components/tableConfig/hooks/useColumnsGenerator';
import { Contragents } from '@vezubr/services/index.operator';
import User from './user';

const paramKeys = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const tableKey = 'users'

function UsersList(props) {
  const dictionaries = useSelector((state) => state.dictionaries);
  const { id, info } = props
  const [params, pushParams] = useParamsState();
  const [loadingData, setLoadingData] = useState(false);
  const [userId, setUserId] = useState(null);
  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const [defaultData, setDefaultData] = useState([])

  const { dataSource, total } = data;

  const [columns, width] = useColumns({ dictionaries })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = (await Contragents.getUsersList({ contractorId: id })).data?.users.filter(el => el?.id);
        setData({ dataSource: response, total: response?.length })
      } catch (e) {
        console.error(e)
      }
    }
    fetchData();
  }, [id]);

  useEffect(() => {
    let newDataSource = defaultData

    setLoadingData(true)
    const { orderBy, orderDirection, ...filterParams } = params
    if (filterParams) {
      Object.entries(filterParams).forEach(([field, value]) => {
        newDataSource = newDataSource.filter(record => {
          if (field == 'employeeRoles') {
            const findArray = value.map(i => record[field].includes(i))
            return !findArray.includes(false)
          }

          if (Array.isArray(record[field])) {
            return record[field].includes(value);
          }

          if (typeof record[field] == 'string') {
            return record[field].toLowerCase().includes(value.toLowerCase());
          } else if (typeof record[field] == 'number') {
            return record[field] == value || value.includes(record[field])
          }
        })
      })
    }

    if (orderBy && orderDirection) {
      newDataSource = _.sortBy(newDataSource, orderBy)

      if (orderDirection == 'DESC') {
        newDataSource = newDataSource.reverse()
      }
    }

    setData({
      dataSource: newDataSource,
      total
    })
    setLoadingData(false)
  }, [params])

  if (userId) {
    return <User userId={userId} contractorId={id} setUserId={setUserId} />
  }

  return (
    <div className={'center size-1'}>
      {!dataSource.length ? <EmptyBlockDeprecated theme={'users'} /> : null}
      {dataSource.length ? (
        <>
          <VzTableFiltered.TableFiltered
            {...{
              params,
              paramKeys,
              loading: loadingData,
              pushParams,
              dataSource,
              columns,
              rowKey: 'id',
              scroll: { x: width, y: 450 },
              onRow: (record) => {
                return {
                  onClick: () => setUserId(record?.id)

                }
              }
            }}
          />
        </>
      ) : null}
    </div>
  )
}

export default UsersList;
