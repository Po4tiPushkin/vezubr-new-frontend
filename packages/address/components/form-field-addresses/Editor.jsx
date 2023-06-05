import React, { useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Ant, Modal, VzForm } from '@vezubr/elements';
import AddressEditForm from '../../forms/address-edit-form';
import { AddressContext } from './context';

function Editor(props) {
  const { currentIndex, onCancel, children, validatorAddressItem } = props;

  const { canChangePredicateFn, onUpdatedAddress, onClearCurrentIndex, useMap, addresses, positions } = useContext(AddressContext);

  const [currentAddress, otherAddress] = useMemo(() => {
    if (currentIndex === null) {
      return [undefined, addresses];
    }

    let currentAddress = null;
    const otherAddress = [];
    let newPast = false;

    for (let index = 0; index < addresses.length; index++) {
      const address = addresses[index];

      let position = index + 1;
      if (newPast && (!currentAddress || !currentAddress.isNew)) {
        position = index;
      }

      if (index === currentIndex) {
        currentAddress = { ...address, position };
      } else {
        otherAddress.push({ ...address, position });
      }

      if (address.isNew) {
        newPast = true;
      }
    }

    return [currentAddress, otherAddress];
  }, [addresses, currentIndex]);

  const canChange = !currentAddress?.disabled && canChangePredicateFn(currentAddress, positions?.[currentAddress?.guid]);

  const modalVisible = currentIndex !== null;
  const modalTitle = canChange ? (!currentAddress?.isNew ? 'Редактирование адреса' : 'Добавление адреса') : 'Просмотр адреса';

  const onSubmit = useCallback(
    async (form) => {
      try {
        const { errors, values } = await VzForm.Utils.validateFieldsFromAntForm(form);

        if (errors) {
          Ant.message.error('Исправьте ошибки в форме');
          return;
        }

        if (values?.maxHeightFromGroundInCm && values?.maxHeightFromGroundInCm !== currentAddress?.maxHeightFromGroundInCm ) {
          values.maxHeightFromGroundInCm = values.maxHeightFromGroundInCm * 100;
        }

        onUpdatedAddress(values, currentIndex);
        onClearCurrentIndex();

      } catch (e) {
        console.error(e);
      }
    },
    [onUpdatedAddress, currentIndex, onClearCurrentIndex, currentAddress],
  );

  return (
    <Modal
      title={modalTitle}
      className={'vz-form-field-addresses__modal'}
      width={1200}
      visible={modalVisible}
      centered={false}
      onCancel={onCancel}
      destroyOnClose={true}
      footer={null}
    >
      <AddressEditForm
        address={currentAddress}
        currentIndex={currentIndex}
        addresses={otherAddress}
        canChange={canChange}
        onSubmit={onSubmit}
        onCancel={onCancel}
        useMap={useMap}
        validators={validatorAddressItem}
      >
        {children}
      </AddressEditForm>
    </Modal>
  );
}

Editor.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object),
  currentIndex: PropTypes.number,
  children: PropTypes.func,
  onCancel: PropTypes.func,
  onSubmit: PropTypes.func,
  useMap: PropTypes.bool,
  validatorAddressItem: PropTypes.objectOf(PropTypes.func).isRequired,
};

export default Editor;
