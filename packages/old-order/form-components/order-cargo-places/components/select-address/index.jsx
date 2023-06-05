import { useMemo } from "react";
import React, { useCallback, useContext, useState } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Ant, Modal } from '@vezubr/elements';
import { OrderContext } from '../../../../context';
import ChooseAddressForm from "../choose-address-form";

const CLS = 'order-select-address';

function SelectAddress(props) {
  const { id, addresses, fieldNameStore, fieldParamName } = props;

  const [edit, seEdit] = useState(false);

  const { store } = useContext(OrderContext);

  const item = store.getDataItem(fieldNameStore);
  const position = item.get(id)?.[fieldParamName];

  const value = useMemo(() => addresses.find((item) => item.position === position)?.addressString, [position, addresses]);

  const isNew = !position;

  const setValue = useCallback(
    (position) => {
      item.set(id, {
        ...item.get(id),
        [fieldParamName]: position,
      });
    },
    [item, fieldParamName],
  );

  const onClose = useCallback(() => {
    seEdit(false);
  }, [])

  const onChange = useCallback(
    (position) => {
      setValue(position);
      onClose();
    },
    [setValue, onClose],
  );

  const handleClickClear = useCallback((e) => {
    setValue(undefined);
    e.stopPropagation();
  }, [])

  const handleClickEdit = useCallback(() => {
    seEdit(true);
  }, [])

  return (
    <>
      <div className={cn(CLS, { [`${CLS}--add`]: isNew })} onClick={handleClickEdit}>
        <div className={`${CLS}__text`}>{value || 'Добавить адрес'}</div>
        <div className={`${CLS}__icon`}>
          <Ant.Icon  type={isNew ? 'plus-circle' : "edit"}/>
        </div>
        {!isNew && (
          <div  className={`${CLS}__clear`} onClick={handleClickClear}>
            <Ant.Icon type="close-circle" />
          </div>
        )}

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
          position={position}
          onChange={onChange}
        />
      </Modal>
    </>
  )
}

SelectAddress.propTypes = {
  id: PropTypes.number.isRequired,
  addresses: PropTypes.arrayOf(PropTypes.object),
  fieldNameStore: PropTypes.string.isRequired,
  fieldParamName: PropTypes.string.isRequired,
};

export default observer(SelectAddress);
