import React, { useState, useCallback } from 'react';
import { Modal, Ant, AddressDeprecated } from '@vezubr/elements';
import { SetParking } from '@vezubr/components';
import { store } from '../../../infrastructure';
import t from '@vezubr/common/localization';
const BasingAddress = (props) => {
  const { setAddress, address } = props;
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <AddressDeprecated
        className={'margin-top-0'}
        index={address?.fullAddress ? 1 : 0}
        onClick={() => setShowModal(true)}
        value={address?.fullAddress}
        fullAddress={address?.fullAddress || ''}
        onEdit={(e) => (address?.fullAddress ? setShowModal(true) : null)}
        onRemove={(e) => (address?.fullAddress ? setAddress(null) : null)}
        title={t.order('parkAddress')}
      />
      <Modal onCancel={() => setShowModal(false)} width={'780'} visible={showModal} footer={null}>
        <SetParking
          store={store}
          editAddress={address}
          onEdit={(e) => setAddress(e)}
          onSelect={(e) => {
            setAddress(e);
            setShowModal(false);
          }}
          onCancel={() => setShowModal(false)}
        />
      </Modal>
    </>
  );
};

export default BasingAddress;
