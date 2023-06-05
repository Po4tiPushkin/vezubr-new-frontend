import React from 'react';
import PropTypes from 'prop-types';
import _concat from 'lodash/concat';
import _compact from 'lodash/compact';
import AddressFieldAutocompleteDaData from '../../fields/address-field-autocomplete-da-data';

import { DaData as DDService, GeoCoding as GCService } from '@vezubr/services';
import { Utils } from '@vezubr/common/common';

import { FIELDS } from '../../fields/constants';

function AddressFormComponentDaData(props) {
  const { address, form, updatedFromMap, setCoordinate, rules } = props;

  const { getFieldError, setFieldsValue, getFieldValue } = form;

  const setCoordinatesByAddress = React.useCallback(
    async (addressString) => {
      try {
        const r = await GCService.geoCoder(addressString);
        if (r && r.length > 0) {
          const [longitude, latitude] = r[0]?.geometry?.coordinates || [];
          setCoordinate({
            latitude,
            longitude,
          });

          return;
        }
      } catch (e) {
        console.error(e);
      }

      setCoordinate({
        latitude: undefined,
        longitude: undefined,
      });
    },
    [setFieldsValue],
  );

  const setAddressByCoordinates = React.useCallback(
    async ({ latitude, longitude }) => {
      try {
        const resp = await GCService.reverseGeoCoder(latitude, longitude);
        if (resp.length) {
          const addressStringTransit = resp[0].properties.streetNameFormatted;
          const daData = (await DDService['address'](addressStringTransit)).suggestions.find(
            (s) => s.value && s?.data?.city && s?.data?.city_fias_id,
          );

          const addressString = daData?.value || addressStringTransit;
          const { city, city_fias_id } = daData?.data || {};

          setFieldsValue({
            [FIELDS.addressString]: addressString,
            [FIELDS.cityName]: city,
            [FIELDS.cityFiasId]: city_fias_id,
          });

          return;
        }
      } catch (e) {
        console.error(e);
      }

      setFieldsValue({
        [FIELDS.addressString]: undefined,
        [FIELDS.cityName]: undefined,
        [FIELDS.cityFiasId]: undefined,
      });
    },
    [setFieldsValue],
  );

  const onSelect = React.useCallback(
    (value, component) => {
      const { city, city_fias_id } = component?.props?.data || {};
      setFieldsValue({
        [FIELDS.cityName]: city,
        [FIELDS.cityFiasId]: city_fias_id,
      });

      setCoordinatesByAddress(value);
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
  }, [updatedFromMap, getFieldValue, setAddressByCoordinates]);

  return (
    <AddressFieldAutocompleteDaData
      form={form}
      initialValue={address?.[FIELDS.addressString]}
      placeholder={'Введите адрес'}
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
      label={'Адрес'}
      rules={rules[FIELDS.addressString]()}
      type={'address'}
      name={FIELDS.addressString}
    />
  );
}

AddressFormComponentDaData.propTypes = {
  address: PropTypes.object,
  form: PropTypes.object.isRequired,
  updatedFromMap: PropTypes.bool,
  rules: PropTypes.object.isRequired,
  setCoordinate: PropTypes.func.isRequired,
};

export default AddressFormComponentDaData;
