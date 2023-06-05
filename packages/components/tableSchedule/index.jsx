import React, { useCallback, useState } from 'react';
import { Modal } from '@vezubr/elements';
import { observer, OBSERVER_ACTIONS } from '../../controls/infrastructure';
import Table from './table';

export default function TableSchedule({ onSave, entity }) {
  const [visibleModal, setVisibleModal] = useState(false);

  const toggleModal = useCallback(() => {
    setVisibleModal(!visibleModal);
  }, [setVisibleModal]);

  const closeModal = useCallback(() => {
    setVisibleModal(false);
  }, []);

  const handleSave = useCallback((config) => {
    closeModal();

    if (onSave) {
      onSave();
    }
  }, [closeModal, onSave, visibleModal]);

  React.useEffect(() => {
    observer.on(OBSERVER_ACTIONS.ACTION_SCHEDULE, () => toggleModal());
    return () => {
      observer.off(OBSERVER_ACTIONS.ACTION_SCHEDULE, () => toggleModal());
    };
  }, [toggleModal]);

  return (
    <>
      <Modal
        title={'Просмотр расписания'}
        visible={visibleModal}
        centered={false}
        destroyOnClose={true}
        footer={null}
        width={'95vw'}
        onCancel={closeModal}
        bodyNoPadding={true}
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'auto',
        }}
      >
        <Table entity={entity}/>
      </Modal>
    </>
  );
}
