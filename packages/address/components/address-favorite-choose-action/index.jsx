import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import AddressFavorite from '../../elements/address-favorite';
import { Modal } from '@vezubr/elements';
import AddressFavoriteChooseForm from '../../forms/address-favorite-choose-form';
import { AddressContext } from '../form-field-addresses/context';

function AddressFavoriteChooseAction(props) {
  const { selectedAddress, excludeAddresses, onChoose, client, id } = props;

  const { toggleFavoritesModal, favoritesModalVisible } = React.useContext(AddressContext);

  const handleChoose = React.useCallback(
    (chosen) => {
      if (onChoose) {
        onChoose(chosen, favoritesModalVisible);
      }
      toggleFavoritesModal();
    },
    [onChoose, toggleFavoritesModal, favoritesModalVisible],
  );
  
  const onAction = React.useCallback(() => {
    const pos = parseInt(id.split('-')[2])
    toggleFavoritesModal(typeof pos == 'number' ? pos : undefined)
  }, [id])

  const hasAddress = !!selectedAddress;
  const usedFavorite = !!selectedAddress?.id;

  return (
    <>
      <AddressFavorite id={id} used={usedFavorite} has={hasAddress} onAction={onAction} />
      <Modal
        title={'Сохраненные адреса'}
        className={'address-favorite-choose-action__modal'}
        visible={favoritesModalVisible !== false}
        width={600}
        bodyNoPadding={true}
        centered={false}
        destroyOnClose={true}
        onCancel={(e) => toggleFavoritesModal()}
        footer={null}
      >
        <AddressFavoriteChooseForm
          excludeAddresses={excludeAddresses}
          selectedAddress={selectedAddress}
          onCancel={(e) => toggleFavoritesModal()}
          onChoose={handleChoose}
          client={client}
        />
      </Modal>
    </>
  );
}

AddressFavoriteChooseAction.propTypes = {
  excludeAddresses: PropTypes.arrayOf(PropTypes.object),
  selectedAddress: PropTypes.object,
  onChoose: PropTypes.func,
  buttonProps: PropTypes.object,
};

export default AddressFavoriteChooseAction;
