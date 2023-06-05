import React, { useCallback, useState } from 'react';
import { Modal } from '@vezubr/elements';
import Editor from './editor';
import { observer, OBSERVER_ACTIONS } from '../../controls/infrastructure';
import { Ant } from '@vezubr/elements';

export default function TableConfig({ tableKey, onSave, onExport }) {
  const hasConfig = localStorage.getItem(`config-table-${tableKey}`);
  const [visibleModal, setVisibleModal] = useState({exporting: false, visible: false});

  const toggleModal = useCallback((exportin) => {
    setVisibleModal({exporting: exportin, visible: !visibleModal.visible});
  }, [setVisibleModal]);

  const openModal = useCallback(() => {
    setVisibleModal({exporting: false, visible: true});
  }, []);

  const closeModal = useCallback(() => {
    setVisibleModal({exporting: false, visible: false});
  }, []);

  const handleSave = useCallback((config) => {
    closeModal();

    if (!visibleModal.exporting && onSave) {
      onSave();
    } else if (visibleModal.exporting && onExport) {
      onExport(config);
    }
  }, [closeModal, onSave, visibleModal]);

  React.useEffect(() => {
    observer.on(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE, () => toggleModal(false));
    observer.on(OBSERVER_ACTIONS.ACTION_EXPORTING_CONFIG_TABLE, () => toggleModal(true));
    return () => {
      observer.off(OBSERVER_ACTIONS.ACTION_CONFIG_TABLE, () => toggleModal(false));
      observer.off(OBSERVER_ACTIONS.ACTION_EXPORTING_CONFIG_TABLE, () => toggleModal(false));
    };
  }, [toggleModal]);

  if (!hasConfig) {
    return null;
  }

  return (
    <>
      {/* <Ant.Button
        type={'primary'}
        className={'rounded box-shadow primary'}
        style={{ minHeight: '38px', marginBottom: '4px' }}
        onClick={openModal}
      >
        Изменить отображение колонок
      </Ant.Button> */}
      <Modal
        title={'Настройте отображение полей'}
        visible={visibleModal.visible}
        centered={false}
        destroyOnClose={true}
        footer={null}
        width={visibleModal.exporting ? 570 : 720}
        onCancel={closeModal}
        bodyNoPadding={true}
        bodyStyle={{
          maxHeight: '80vh',
          overflowY: 'scroll',
        }}
      >
        <Editor tableKey={tableKey} onSave={handleSave} exporting={visibleModal.exporting} />
      </Modal>
    </>
  );
}
