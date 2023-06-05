import React from 'react';
import PropTypes from 'prop-types';
let selectedSort;
const TableHead = (props) => {
  const { value, setSort, className } = props;
  const sortBy = (value) => {
    selectedSort && selectedSort !== value ? (selectedSort.sortBy = null) : void 0;
    value.sortBy && value.sortBy === 'DESC' ? (value.sortBy = 'ASC') : (value.sortBy = 'DESC');
    selectedSort = value;
    setSort(value);
  };
  return (
    <th className={value.key + (value.sortable ? ' sortable' : '')}>
      <span>{value.name}</span>
      {value.sortable ? (
        <i
          className={
            'glyphicon glyphicon-triangle-bottom table-glyph-down ' +
            (value.sortBy && value.sortBy === 'DESC' ? 'orange' : '')
          }
          onClick={() => sortBy(value)}
        />
      ) : null}
      <span className={'bg-grey_0 th-background'} />
    </th>
  );
};

TableHead.propTypes = {
  value: PropTypes.object.isRequired,
  index: PropTypes.number,
  setSort: PropTypes.func,
};
export default TableHead;
