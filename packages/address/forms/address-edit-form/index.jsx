import React, { useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Ant, showError, VzForm } from '@vezubr/elements';
import AddressMapPicker from '../../components/address-map-picker';
import t from '@vezubr/common/localization';
import { Utils } from '@vezubr/common/common';
import { FIELDS } from '../../fields/constants';
import { Address as AddressService } from '@vezubr/services';
import AddressFormComponentGooglePlace from '../../from-components/address-form-component-google-place';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { GeoCoding as GeoCodingService } from '@vezubr/services';
import { AddressContext } from '../../components/form-field-addresses/context';
import ExistingAddressModal from '@vezubr/components/existingAdressesModal';

function AddressEditForm(props) {
  const {
    address,
    addresses,
    currentIndex,
    canChange,
    form,
    onSubmit,
    onCancel,
    saving,
    useMap,
    children,
    validators,
  } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue } = form;

  const { client, onClearCurrentIndex, onReplaceFromFavorite } = React.useContext(AddressContext);
  const [existingAddressModalVisible, setExistingAddressModalVisible] = React.useState(false);
  const [existingAddresses, setExistingAddresses] = React.useState([]);

  const [mapUpdatedHash, setMapUpdatedHash] = React.useState(Utils.uuid);

  const rules = VzForm.useCreateAsyncRules(validators);

  const handleSave = React.useCallback(() => {
    if (onSubmit) {
      onSubmit(form);
    }
  }, [form, onSubmit]);

  const mapRef = React.useRef(null);

  const fetchTimeZone = React.useCallback(
    async ({ latitude, longitude }) => {
      try {
        const response = await GeoCodingService.getTimeZone(latitude, longitude);
        if (response?.timeZoneId) {
          setFieldsValue({
            [FIELDS.timeZoneId]: response?.timeZoneId,
          });
        }
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [setFieldsValue],
  );

  const onUpdatePositionFromMap = React.useCallback(
    async ({ lat: latitude, lng: longitude }) => {
      const existingAddressesResp = await Utils.checkForAlreadyExistingAddresses({
        latitude,
        longitude,
        setExistingAddressModalVisible,
        client,
      });
      if (existingAddressesResp.length > 0) {
        setExistingAddresses(existingAddressesResp);
      }
      fetchTimeZone({ latitude, longitude });

      setFieldsValue({
        [FIELDS.latitude]: latitude,
        [FIELDS.longitude]: longitude,
      });

      setMapUpdatedHash(Utils.uuid);
    },
    [setFieldsValue],
  );

  const onChooseFromExisting = (address) => {
    setFieldsValue({ ...address });
    onClearCurrentIndex();
    setExistingAddressModalVisible(false);
    onReplaceFromFavorite(address, currentIndex);
    onReplaceFromFavorite(address, currentIndex);
  };

  const setCoordinate = React.useCallback(
    ({ latitude, longitude }) => {
      fetchTimeZone({ latitude, longitude });

      setFieldsValue({
        [FIELDS.latitude]: latitude,
        [FIELDS.longitude]: longitude,
      });

      const map = mapRef.current?.leafletElement;
      if (map && latitude && longitude) {
        map.setView([latitude, longitude]);
      }
    },
    [setFieldsValue],
  );

  const prevMapUpdatedHash = usePrevious(mapUpdatedHash);
  const updatedFromMap = prevMapUpdatedHash && prevMapUpdatedHash !== mapUpdatedHash;

  const point = {
    position: address?.position,
    latitude: getFieldValue(FIELDS.latitude) || address?.[FIELDS.latitude],
    longitude: getFieldValue(FIELDS.longitude) || address?.[FIELDS.longitude],
  };

  return (
    <div className={cn('address-edit-form', { 'address-edit-form--has-children': !!children })}>
      <div className={'address-edit-form__content'}>
        <div className={'address-edit-form__fields'}>
          <VzForm.Group>
            <AddressFormComponentGooglePlace
              form={form}
              rules={rules}
              updatedFromMap={updatedFromMap}
              address={address}
              setCoordinate={setCoordinate}
              canChange={canChange}
            />

            {getFieldDecorator(FIELDS.cityName, {
              rules: rules[FIELDS.cityName](),
              initialValue: address?.[FIELDS.cityName],
            })(<Ant.Input type={'hidden'} />)}

            {getFieldDecorator(FIELDS.cityFiasId, {
              rules: rules[FIELDS.cityFiasId](),
              initialValue: address?.[FIELDS.cityFiasId],
            })(<Ant.Input type={'hidden'} />)}

            {getFieldDecorator(FIELDS.latitude, {
              rules: rules[FIELDS.latitude](),
              initialValue: address?.[FIELDS.latitude],
            })(<Ant.Input type={'hidden'} />)}

            {getFieldDecorator(FIELDS.longitude, {
              rules: rules[FIELDS.longitude](),
              initialValue: address?.[FIELDS.longitude],
            })(<Ant.Input type={'hidden'} />)}

            {getFieldDecorator(FIELDS.timeZoneId, {
              rules: rules[FIELDS.timeZoneId](),
              initialValue: address?.[FIELDS.timeZoneId],
            })(<Ant.Input type={'hidden'} />)}
          </VzForm.Group>
          {children && children({ form, address, rules, canChange })}
        </div>

        {useMap && (
          <div className={'address-edit-form__map'}>
            <AddressMapPicker
              ref={mapRef}
              point={point}
              addresses={addresses}
              viewRoute={false}
              onChange={onUpdatePositionFromMap}
              disabled={!canChange}
            />
          </div>
        )}
      </div>

      <VzForm.Actions className={'address-edit-form__actions'}>
        <Ant.Button type={'ghost'} onClick={onCancel}>
          {t.order('cancel')}
        </Ant.Button>

        {canChange && (
          <Ant.Button type={'primary'} onClick={handleSave} loading={saving}>
            Сохранить
          </Ant.Button>
        )}
      </VzForm.Actions>
      <ExistingAddressModal
        onSubmit={onChooseFromExisting}
        existingAddresses={existingAddresses}
        modalVisible={existingAddressModalVisible}
        setModalVisible={setExistingAddressModalVisible}
        modalText={'У вас уже есть адреса с такими координатами. Хотите использовать один из них или создать новый?'}
        confirmText={'Использовать существующий'}
        currentAddress={address.id}
      />
    </div>
  );
}

AddressEditForm.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object),
  address: PropTypes.object,
  form: PropTypes.object,
  children: PropTypes.func,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  useMap: PropTypes.bool,
  saving: PropTypes.bool,
  canChange: PropTypes.bool,
  validators: PropTypes.objectOf(PropTypes.func).isRequired,
};

export default Ant.Form.create({ name: 'address_edit_form' })(AddressEditForm);
