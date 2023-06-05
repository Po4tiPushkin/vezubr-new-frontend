import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from '@vezubr/elements';
import { Import } from '@vezubr/components';
import { observer, OBSERVER_ACTIONS } from '../../../../infrastructure';

const ImportDriversAction = (props) => {
  const { onOk: onOkInput } = props;

  const [modalVisible, setModalVisible] = useState(false);

  const modalToggle = useCallback(() => {
    setModalVisible(!modalVisible);
  }, [modalVisible, setModalVisible]);

  const modalClose = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  useEffect(() => {
    observer.on(OBSERVER_ACTIONS.ACTION_IMPORT_DRIVERS, modalToggle);
    return () => {
      observer.off(OBSERVER_ACTIONS.ACTION_IMPORT_DRIVERS, modalToggle);
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
      title={'Импорт водителей'}
      className={'import-drivers-action__modal'}
      visible={modalVisible}
      width={600}
      bodyNoPadding={true}
      centered={false}
      destroyOnClose={true}
      onCancel={modalClose}
      footer={null}
    >
      <Import.Drivers action={'/api/driver/import/file'} onOk={onOk} />
    </Modal>
  );
};

ImportDriversAction.propTypes = {
  onOk: PropTypes.func,
};

export default ImportDriversAction;
