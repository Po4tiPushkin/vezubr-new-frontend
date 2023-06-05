import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@vezubr/elements';
import { Import } from '@vezubr/components';
import { observer, OBSERVER_ACTIONS } from '../../../../infrastructure';

const ImportTransportsAction = (props) => {
  const { onOk: onOkInput } = props;

  const [modalVisible, setModalVisible] = useState(false);

  const modalToggle = useCallback(() => {
    setModalVisible(!modalVisible);
  }, [modalVisible, setModalVisible]);

  const modalClose = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  useEffect(() => {
    observer.on(OBSERVER_ACTIONS.ACTION_IMPORT_TRACTORS, modalToggle);
    return () => {
      observer.off(OBSERVER_ACTIONS.ACTION_IMPORT_TRACTORS, modalToggle);
    };
  }, [modalToggle]);

  const onOk = useCallback(() => {
    modalClose();
    if (onOkInput) {
      onOkInput();
    }
  }, [modalClose, onOkInput]);

  return (
    <Modal
      title={'Импорт Тягачей'}
      className={'import-transports-action__modal'}
      visible={modalVisible}
      width={600}
      bodyNoPadding={true}
      centered={false}
      destroyOnClose={true}
      onCancel={modalClose}
      footer={null}
    >
      <Import.Transports action={'/import/vehicle/file'} onOk={onOk} />
    </Modal>
  );
};

ImportTransportsAction.propTypes = {
  onOk: PropTypes.func,
};

export default ImportTransportsAction;
