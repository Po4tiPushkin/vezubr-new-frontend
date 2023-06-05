import React from 'react';
import PropTypes from 'prop-types';
import GenericElemDoc from './genericElemDoc';
import cn from 'classnames';

function GenericContracts(props) {
  const { col } = props;

  return <div className={cn('generic-contracts', { ['col-' + (col || 'no')]: !!col })}>{props.children}</div>;
}

GenericContracts.propTypes = {
  children: PropTypes.node.isRequired,
  col: PropTypes.oneOf([2]),
};

export { GenericContracts, GenericElemDoc };
