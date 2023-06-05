import React, { useState } from 'react';
import { FilterButton } from '@vezubr/elements';
import PropTypes from 'prop-types';

function ButtonContext(props) {
  const [dropDownOpen, setDropDownOpen] = useState(false);

  const menuOptions = {
    arrowPosition: 'right',
    ...props.menuOptions,
    show: dropDownOpen,
  };

  const toggleDropdown = () => {
    setDropDownOpen(!dropDownOpen);
  };

  const buttonProps = {
    icon: 'dotsBlue',
    className: 'circle box-shadow',
    ...props,
    withMenu: true,
    menuOptions,
    onClick: toggleDropdown,
  };

  return <FilterButton {...buttonProps} />;
}

ButtonContext.propTypes = {
  menuOptions: PropTypes.shape({
    list: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
};

export default ButtonContext;
