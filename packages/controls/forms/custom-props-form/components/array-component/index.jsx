import React, { useState, useCallback, useMemo } from 'react';
import { Ant, showError, VzForm, Loader } from '@vezubr/elements';

const ArrayComponent = (props) => {
  const { value, setValue, id } = props;
  const [inputValue, setInputValue] = useState('');

  const handleAddValue = useCallback(() => {
    if (inputValue && setValue && !value.find(el => el === inputValue)) {
      setValue([...value, inputValue])
    }
    setInputValue('');
  }, [inputValue, value]);

  const renderOptions = useMemo(() => {
    return value.map((el, index) => (
      <Ant.Select.Option label={el} value={el} key={index}>
        {el}
      </Ant.Select.Option>
    ))
  }, [value]);

  const resetSearchValue = () => {
    document.querySelector('#array-select').querySelector('input').value = '';
  }

  return (
    <Ant.Select
      id={'array-select'}
      dropdownRender={() => <></>}
      mode={'multiple'}
      value={value}
      onInputKeyDown={(e) => {
        if (e.key === 'Enter') {
          handleAddValue(); resetSearchValue();
        }
      }}
      onBlur={() => handleAddValue()}
      onSearch={(e) => setInputValue(e)}
      onChange={(e) => setValue(e)}
    >
      {renderOptions}
    </Ant.Select>
  )
}

export default ArrayComponent;