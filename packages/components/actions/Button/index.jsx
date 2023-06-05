import React, { useState } from 'react';
import { FilterButton } from '@vezubr/elements';
import PropTypes from 'prop-types';

function Button(props) {
  return <FilterButton {...props} />;
}

Button.propTypes = {
  config: PropTypes.object,
};

export default Button;
