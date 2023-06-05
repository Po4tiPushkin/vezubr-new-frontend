import React from 'react';
import PropTypes from 'prop-types';

function FilterWrapper(props) {
  return <div className={`filter-item ${props.classNames}`}>{props.children}</div>;
}
FilterWrapper.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export { FilterWrapper };
