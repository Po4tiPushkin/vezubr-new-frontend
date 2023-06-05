import React, { useCallback, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { Ant, Modal } from '@vezubr/elements';
import { CLS_ROOT } from './constant';
import { OrderContext } from '../../context';

import OrderCargoPlacesMain from './main';
import OrderCargoPlacesAdd from './add';

const CLS = CLS_ROOT;

function OrderCargoPlaces(props) {
  const { fieldNameValue, dictionaries, disabled } = props;
  const [showModal, setShowModal] = useState(false);

  const onCancel = useCallback(() => {
    setShowModal(false);
  }, []);

  const handleClickButton = useCallback(() => {
    setShowModal(true);
  }, []);

  const { store } = useContext(OrderContext);

  return (
    <div className={CLS}>
      <OrderCargoPlacesAdd fieldNameValue={fieldNameValue} onClick={handleClickButton} disabled={disabled}>
        Прикрепить грузоместа
      </OrderCargoPlacesAdd>

      <Modal
        title={'Список грузомест'}
        destroyOnClose={true}
        centered={false}
        visible={showModal}
        width={1300}
        onCancel={onCancel}
        footer={null}
      >
        <OrderCargoPlacesMain {...props}/>
      </Modal>
    </div>
  );
}

OrderCargoPlaces.propTypes = {
  cargoPlaceStatuses: PropTypes.array.isRequired,
  fieldNameStore: PropTypes.string.isRequired,
  fieldNameValue: PropTypes.string.isRequired,
  fieldNameAll: PropTypes.string.isRequired,
  fieldNameAddresses: PropTypes.string.isRequired,
  fieldNameAddressOut: PropTypes.string.isRequired,
  fieldNameAddressIn: PropTypes.string.isRequired,
  disabled: PropTypes.bool
};

export default OrderCargoPlaces;
