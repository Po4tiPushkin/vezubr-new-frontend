import React from 'react';
import { Ant } from '@vezubr/elements';
import { useDebouncedCallback } from 'use-debounce';

const Search = (props) => {
  const { setSearchValue } = props;
  const [debounced] = useDebouncedCallback((value) => {
    if (!value || value?.length > 1) {
      setSearchValue(value);
    }
  }, 500)

  return (
    <Ant.Input
      placeholder="Поиск по номеру Тягачей"
      suffix={<Ant.Icon type="search" />}
      onChange={(e) => debounced(e.target.value.toLocaleLowerCase())}

    />
  )
}

export default Search