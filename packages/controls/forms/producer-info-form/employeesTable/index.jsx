import React, { useState, useCallback, useMemo, useEffect } from 'react';
import useColumns from './hooks/useColumns';
import { VzTableFiltered } from '@vezubr/components';
import { sortBy } from 'lodash'
import { EmptyBlockDeprecated, ButtonDeprecated } from '@vezubr/elements';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { useSelector } from 'react-redux';
import { Profile as ProfileService } from '@vezubr/services';
import { showAlert, showError } from "@vezubr/elements";
const paramKeys = {
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

function EmployeesTable(props) {
  const { employeesList = [] } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const user = useSelector((state) => state.user);

  const [params, pushParams] = useParamsState();

  const [loadingData, setLoadingData] = useState(false);

  const [data, setData] = useState({
    dataSource: [],
    total: 0,
  });
  const [defaultData, setDefaultData] = useState([])

  const { dataSource, total } = data;

  const [columns, width] = useColumns({ dictionaries })

  useEffect(() => {
    setData({dataSource: employeesList, total: employeesList.length});
    setDefaultData(employeesList);
  }, [employeesList]);

  useEffect(() => {
    let newDataSource = defaultData

    setLoadingData(true)
    const { orderBy, orderDirection } = params

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
  }, [params, defaultData])

  return (
    <div className={'center size-1 counterparty-main-form__table'}>
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
              width,
              responsive: false,
            }}
          />
        </>
      ) : null}
    </div>
  )
}
export default EmployeesTable;
