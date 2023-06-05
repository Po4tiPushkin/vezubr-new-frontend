import React, { useCallback, useMemo } from 'react';
import { VzTable, Ant } from '@vezubr/elements';
const MultiSelectFields = (props) => {
  const { currentField, onChangeValue, value, id = 0 } = props;

  const getFieldOptions = useCallback(() => {
    return currentField.values.map((el) => (
      <Ant.Select.Option key={el.id} value={el.value}>
        {el.title}
      </Ant.Select.Option>
    ))
  }, [currentField]);

  const renderField = useMemo(() => {
    if (!currentField) {
      return null;
    };
    switch (currentField.type) {
      case 'select':
        return (
          <Ant.Select value={value} onChange={(e) => onChangeValue(id, e)} >
            {getFieldOptions()}
          </Ant.Select>
        )
      case 'input':
        return (
          <Ant.Input value={value} onChange={(e) => onChangeValue(id, e.target.value)} />
        )
    };
  }, [value, id, currentField]);

  return (
    <>
      {renderField}
    </>
  )
};

export default MultiSelectFields;
