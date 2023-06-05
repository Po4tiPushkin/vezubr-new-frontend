import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Filters, TableFiltered, } from '../../../tableFiltered';
import useParamsState from '@vezubr/common/hooks/useParamsState';

import useColumns from './hooks/useColumns';
import { showError, Ant, WhiteBox, VzForm } from '@vezubr/elements';
import MultiSelectFields from '../fields';
const tableKey = 'multiselect-table';

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const MultiSelectTable = (props) => {
  const {
    tableName,
    fields = [],
    dataSource = [],
    setDataSource,
    onSubmit,
    currentField,
    setCurrentField,
    history,
    location,
    other,
    loading
  } = props;
  const [params, pushParams] = useParamsState({});
  const [allValues, setAllValues] = useState(null);

  const renderFieldsOptions = useMemo(() => {
    return fields.map((el) => (
      <Ant.Select.Option key={el.id} value={el.value}>
        {el.title}
      </Ant.Select.Option>
    ))
  }, [fields]);

  const resetValues = useCallback(() => {
    setDataSource(dataSource.map(el => { el.newValue = null; return el }));
    setAllValues(null);
  }, [dataSource]);

  const onChangeAllFields = useCallback((id, value) => {
    setAllValues(value);
    setDataSource(dataSource.map(el => { el.newValue = value; return el }));
  }, [dataSource]);

  const onChangeCurrentField = useCallback((e) => {
    resetValues();
    setCurrentField(fields.find(el => el.value === e));
  }, [fields]);

  const renderAllValuesField = useMemo(() => {

    return (
      <VzForm.Item
        label={'Выберите статус для заполнения всех новых значений'}
      >
        <MultiSelectFields currentField={currentField} value={allValues} onChangeValue={onChangeAllFields} />
      </VzForm.Item>
    )
  }, [currentField, allValues])

  const renderFields = useMemo(() => {
    return (
      <WhiteBox.Header
        type={"h2"}
        hr={false}
        icon={<Ant.Icon type={"edit"} />}
        addon={
          <Ant.Select
            style={{ width: '399px', padding: '0 0 0 10px' }}
            value={currentField?.value}
            onChange={(e) => onChangeCurrentField(e)}
          >
            {renderFieldsOptions}
          </Ant.Select>
        }
      >
        Выберите поля для внесения изменений:
      </WhiteBox.Header>
    )
  }, [currentField]);

  const onChangeValue = useCallback((id, value) => {
    const newDataSource = dataSource.map((el) => {
      if (el.id === id) {
        el.newValue = value
      }
      return el;
    });
    setDataSource(newDataSource);
  }, [dataSource]);

  const columns = useColumns({ currentField, onChangeValue });
  return (
    <div className='multiSelect__table'>
      <div>
        {renderFields}
      </div>
      {other && (
        Object.keys(other).map(el => {
          return (other[el]?.render && other[el].render.valuesCheck.includes(currentField?.id))
            ?
            other[el]?.render.render
            :
            <></>
        })
      )}
      {currentField?.value && renderAllValuesField}
      <TableFiltered
        {...{
          params,
          pushParams,
          columns,
          dataSource,
          paramKeys,
          rowKey: 'id',
          scroll: { x: 700, y: 550 },
          loading: loading?.table,
          responsive: false,
        }}
      />
    </div>
  )
}

export default MultiSelectTable;