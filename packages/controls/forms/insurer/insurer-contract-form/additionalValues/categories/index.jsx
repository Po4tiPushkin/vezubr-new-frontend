import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import useColumns from './hooks/useColumns';
import useParamsState from '@vezubr/common/hooks/useParamsState';
import { TableFiltered } from "@vezubr/components/tableFiltered";

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const Categories = (props) => {
  const { values, editable = false, setValues } = props;
  const dictionaries = useSelector(state => state.dictionaries);
  const [params, pushParams] = useParamsState();
  const [dataSource, setDataSource] = useState(
    !editable && values && Array.isArray(values) ?
      dictionaries.cargoTypes.filter(el => values.includes(el.id))
      :
      dictionaries.cargoTypes
  );

  useEffect(() => {
    const { orderBy, orderDirection } = params
    if (orderBy && orderDirection) {
      let newDataSource = _.sortBy(dataSource, orderBy)
      if (orderDirection == 'DESC') {
        newDataSource = newDataSource.reverse()
      }
      setDataSource(newDataSource);
    }
  }, [params]);

  const columns = useColumns();

  const rowSelection = {
    selectedRowKeys: values,
    onChange: (selectedRowKeys, selectedRows) => {
      setValues(selectedRowKeys);
    },
  };

  return (
    <>
      <TableFiltered
        {...{
          params,
          pushParams,
          columns,
          dataSource,
          rowKey: 'id',
          scroll: { x: 600, y: 350 },
          paramKeys,
          rowSelection: editable ? rowSelection : null,
          responsive: false,
        }}
      />
    </>
  )
}

export default Categories;