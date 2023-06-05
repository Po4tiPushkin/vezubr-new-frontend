import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { Ant, Modal } from '@vezubr/elements';
import ChooseAddressForm from "../choose-address-form";

const CLS = 'order-select-address-group';

function SelectAddressGroup(props) {
  const { addresses, title, onClear, onChoose } = props;

  const [edit, seEdit] = useState(false);

  const onClose = useCallback(() => {
    seEdit(false);
  }, [])

  const onChange = useCallback(
    (position) => {
      onChoose(position);
      onClose();
    },
    [onChoose, onClose],
  );

  const handleClickClear = useCallback((e) => {
    onClear()
    e.stopPropagation();
  }, [onClear])

  const handleClickAdd = useCallback(() => {
    seEdit(true);
  }, [])

  return (
    <>
      <div className={CLS}>
        <div className={`${CLS}__text`}>{title}</div>

        <div className={`${CLS}__add`} onClick={handleClickAdd}>
          <Ant.Icon  type={'plus-circle'}/>
        </div>

        <div  className={`${CLS}__clear`} onClick={handleClickClear}>
          <Ant.Icon type="close-circle" />
        </div>

      </div>

      <Modal
        title={'Выберите адрес'}
        className={`${CLS}__modal`}
        visible={edit}
        width={600}
        centered={true}
        destroyOnClose={true}
        onCancel={onClose}
        footer={null}
      >
        <ChooseAddressForm
          addresses={addresses}
          onChange={onChange}
        />
      </Modal>
    </>
  )
}

SelectAddressGroup.propTypes = {
  addresses: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  onChoose: PropTypes.func,
  onClear: PropTypes.func,
};

export default SelectAddressGroup;
