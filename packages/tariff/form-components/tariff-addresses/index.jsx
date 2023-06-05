import React, { useCallback, useContext } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import * as Order from '@vezubr/order/form';
import { TariffContext } from '../../context';
import { TARIFF_DISABLED_LOADING_TYPES } from '../../constants';

function TariffAddresses(props) {
  const { loadingTypes } = props;

  const { store } = useContext(TariffContext);

  const { addresses } = store;

  const error = store.getError('addresses');

  const { field: fieldError, items: itemsError } = error ? JSON.parse(error) : {};

  const onChange = useCallback((addresses) => {
    store.setAddresses(addresses);
  }, []);

  const canMoveEditAddressPredicate = useCallback(() => {
    return store?.editable;
  },[store?.editable])

  return (
    <Order.FormFieldAddresses
      disabled={!store.editable}
      errors={itemsError}
      error={fieldError}
      onChange={onChange}
      canMovePredicateFn={canMoveEditAddressPredicate}
      addresses={addresses}
      useMap={true}
      useFavorite={true}
      loadingTypes={loadingTypes}
      disabledLoadingTypes={TARIFF_DISABLED_LOADING_TYPES}
      validatorAddressItem={Order.Validators.validateAddressItem}
    />
  );
}

TariffAddresses.propTypes = {
  loadingTypes: PropTypes.object.isRequired,
};

export default observer(TariffAddresses);
