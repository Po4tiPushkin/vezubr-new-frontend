import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { showError, Ant } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import MultiSelectActions from './elements/actions';
import MultiSelectTable from './elements/table';
import useFields from './elements/hooks/useFields';
const MultiSelect = (props) => {

  const { selectedRows = [], tableName, onSave, other, ...otherProps } = props;
  const [visibleModal, setVisibleModal] = useState(false);
  const [dataSource, setDataSource] = useState(selectedRows);

  const [currentField, setCurrentField] = useState(null);
  const dictionaries = useSelector((state) => state.dictionaries);
  const fields = useFields({ tableName, dictionaries, other });

  useEffect(() => {
    setDataSource(selectedRows);
  }, [selectedRows])

  useEffect(() => {
    if (currentField) {
      setCurrentField(prev => ({...prev, values: fields.find(el => currentField.id === el.id)?.values }))
    }
  }, [fields])


  const onSubmit = useCallback(() => {
    let submitData = [...dataSource]
    const newFields = fields.filter(field => field.value !== currentField?.value);
    submitData = submitData.filter(item => item.newValue !== undefined && item.newValue !== null).map(el => {
      return Object.assign(
        {
          id: el.id,
          [currentField?.value]: el?.newValue
        },
        ...newFields.map(val => {
          return {
            [val?.value]: el?.[val?.value]
          }
        })
      )
    })
    if (onSave) {
      onSave(submitData);
      setVisibleModal(false)
    }
  }, [dataSource, currentField])

  return (
    <div>
      <MultiSelectActions setVisibleModal={setVisibleModal} selectedRows={dataSource} {...otherProps} />
      {visibleModal ?
        <Ant.Modal
          visible={visibleModal}
          width={1100}
          onOk={onSubmit}
          destroyOnClose={true}
          onCancel={() => setVisibleModal(false)}
        >
          <MultiSelectTable
            currentField={currentField}
            setCurrentField={setCurrentField}
            dataSource={dataSource}
            setDataSource={setDataSource}
            fields={fields}
            other={other}
            {...otherProps}
          />
        </Ant.Modal>
        :
        null
      }
    </div>
  )
}

export default MultiSelect;