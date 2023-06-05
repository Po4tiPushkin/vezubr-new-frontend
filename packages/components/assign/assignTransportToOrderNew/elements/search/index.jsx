import React from 'react';
import { Icon, Input, Select } from '@vezubr/elements/antd';
import { useDebouncedCallback } from 'use-debounce';
const Search = (props) => {
  const { setFilterValue, filterValue, filterState, setFilterState, vehicleTypes = [] } = props;
  const [debounced] = useDebouncedCallback((value) => {
    setFilterValue(value)
  }, 500)

  return (
    <div className="assignModal__search">
      <div className="item">
        <Input
          allowClear={true}
          suffix={<Icon type="search" />}
          // value={filterValue}
          placeholder="Поиск по номеру ТС / фамилии водителя"
          onChange={(e) => debounced(e.target.value.toLowerCase())}
        />
      </div>
    </div>
  )
}

export default Search;