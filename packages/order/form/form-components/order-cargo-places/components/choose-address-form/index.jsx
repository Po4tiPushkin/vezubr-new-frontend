import { useCallback } from "react";
import React, { useMemo, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';

const CLS = 'order-choose-address-form';

function ChooseAddressForm(props) {
  const { addresses, position, onChange } = props;

  const handleChange = useCallback(e => {
    onChange(~~e.target.value);
  }, [onChange])

  const renderedRadioOptions = useMemo(
    () =>
      addresses.map(({ position, addressString }) => (
        <Ant.Radio className={`${CLS}__radio-group__item`} key={position} value={position}>
          {addressString}
        </Ant.Radio>
      )),
    [addresses],
  );

  return (
    <div className={CLS}>
      <Ant.Radio.Group className={`${CLS}__radio-group`} onChange={handleChange} value={position}>
        {renderedRadioOptions}
      </Ant.Radio.Group>
    </div>
  );
}

ChooseAddressForm.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object),
  position: PropTypes.number,
  onChange: PropTypes.func,
};

export default observer(ChooseAddressForm);
