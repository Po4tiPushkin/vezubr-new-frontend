import React from 'react';
import PropTypes from 'prop-types';
import IconsList from './iconsList';
const Icon = ({ name, ...other }) => {
  other.className = `element-icon ${other.className || ''}`;
	return (
    <img
      style={other.style}
      src={IconsList[name]}
      width={other.size ? other.size.width : null}
      height={other.size ? other.size.height : null}
      srcSet={`${IconsList[`${name}_2x`]} 2x`}
      alt={name}
      {...other}
    />
  );
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
  wide: PropTypes.bool,
  big: PropTypes.bool,
};

export default Icon;
