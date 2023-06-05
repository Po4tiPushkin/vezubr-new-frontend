import React, { useCallback, useMemo } from 'react';
import { Ant } from '../index';
import cn from 'classnames';
import PropTypes from 'prop-types';

function Table(props) {
  const { theme = 'default', className: classNameInput, ...otherProps } = props;

  const className = cn('vz-table-modern', `vz-table-theme--${theme}`, classNameInput);
  const width = otherProps.columns.reduce((acc, cur) => acc + (cur.width || 150), 0)
  return <Ant.Table {
    ...{
      ...otherProps,
      className,
      width,
      scroll: {
        ...otherProps.scroll,
        x: width
      }
    }
  }/>;
}

Table.propTypes = {
  className: PropTypes.string,
  theme: PropTypes.oneOf(['default', 'white']),
};

Table.contextTypes = {
  observer: PropTypes.object,
  history: PropTypes.object,
};

export default Table;
