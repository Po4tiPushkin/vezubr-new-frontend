import React from 'react';
import PropTypes from 'prop-types';
import _concat from 'lodash/concat';
import _compact from 'lodash/compact';
import AddressFieldAutocompleteGooglePlace from '../../fields/address-field-autocomplete-google-place';

import { FIELDS } from '../../fields/constants';
import {
  getFiasByCoordinate,
  getFiasByPlace,
} from '@vezubr/services/fias/googlePlace';

function AddressFormComponentGooglePlace(props) {
  const { address, form, updatedFromMap, setCoordinate, rules, canChange = true } = props;

  const { getFieldError, setFieldsValue, getFieldValue, getFieldsValue } = form;

  const setCoordinatesByAddress = React.useCallback(
    async (data) => {
      const { cityName, cityFiasId, latitude, longitude } = await getFiasByPlace(data) || {};

      setFieldsValue({
        [FIELDS.cityName]: cityName,
        [FIELDS.cityFiasId]: cityFiasId,
      });

      setCoordinate({
        latitude,
        longitude,
      });

    },
    [setFieldsValue],
  );

  const setAddressByCoordinates = React.useCallback(
    async (latLng) => {
      const { addressString, cityName, cityFiasId } = await getFiasByCoordinate(latLng) || {};

      setFieldsValue({
        [FIELDS.addressString]: addressString,
        [FIELDS.cityName]: cityName,
        [FIELDS.cityFiasId]: cityFiasId,
      });
    },
    [setFieldsValue],
  );

  const onSelect = React.useCallback(
    (value, component) => {
      const { data } = component?.props;
      setCoordinatesByAddress(data);
    },
    [setFieldsValue],
  );

  React.useEffect(() => {
    if (updatedFromMap) {
      setAddressByCoordinates({
        latitude: getFieldValue(FIELDS.latitude),
        longitude: getFieldValue(FIELDS.longitude),
      });
    }
  }, [updatedFromMap, getFieldValue]);

  return (
    <AddressFieldAutocompleteGooglePlace
      form={form}
      initialValue={address?.[FIELDS.addressString]}
      placeholder={'Улица, дом, город...'}
      error={_compact(
        _concat(
          getFieldError(FIELDS.cityName),
          getFieldError(FIELDS.cityFiasId),
          getFieldError(FIELDS.latitude),
          getFieldError(FIELDS.longitude),
          getFieldError(FIELDS.timeZoneId),
        ),
      )}
      onSelect={onSelect}
      timer={500}
      label={'Фактический адрес'}
      rules={rules[FIELDS.addressString]()}
      type={'address'}
      name={FIELDS.addressString}
      disabled={!canChange}
    />
  );
}

AddressFormComponentGooglePlace.propTypes = {
  address: PropTypes.object,
  form: PropTypes.object.isRequired,
  updatedFromMap: PropTypes.bool,
  rules: PropTypes.object.isRequired,
  setCoordinate: PropTypes.func.isRequired,
};

export default AddressFormComponentGooglePlace;
