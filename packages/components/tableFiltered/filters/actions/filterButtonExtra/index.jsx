import React, { useState, useContext } from 'react';
import { FilterButton } from '@vezubr/elements';
import PropTypes from 'prop-types';

import ModalChooseFilters from '../../modals/ModalChooseFilters';
import FilterContext from '../../context';
import { FilterWrapper } from '../../helper';

function FilterButtonExtra(props) {
  const { extraFilters } = useContext(FilterContext);

  if (!extraFilters || extraFilters.length === 0) {
    return null;
  }

  const [openModal, setOpenModal] = useState(false);

  const open = () => {
    setOpenModal(true);
  };

  const close = () => {
    setOpenModal(false);
  };

  return (
    <FilterWrapper>
      <FilterButton
        {...{
          icon: 'plusBlue',
          className: 'rounded box-shadow',
          content: <p className="no-margin">Доп фильтры</p>,
          ...props.config,
          withMenu: false,
          onClick: open,
        }}
      />

      <ModalChooseFilters open={openModal} onClose={close} />
    </FilterWrapper>
  );
}

FilterButtonExtra.propTypes = {
  config: PropTypes.object,
};

export default FilterButtonExtra;
