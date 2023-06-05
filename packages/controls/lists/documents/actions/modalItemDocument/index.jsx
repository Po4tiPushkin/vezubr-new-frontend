import React, { useCallback, useState } from 'react';
import { Modal, VzTable } from '@vezubr/elements';
import DocumentPage from '../../../../pages/document';

const ModalItemDocument = (props) => {
  const { text, item, dictionaries, id } = props;
  const [modalVisible, setModalVisible] = useState(false);

  const modalClose = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  const modalOn = useCallback(() => {
    setModalVisible(true);
  }, [setModalVisible]);

  return (
    <>
      <Modal visible={modalVisible} onCancel={modalClose} width={1100} footer={null}>
        <DocumentPage selected={item} onClose={modalClose} dictionaries={dictionaries}/>
      </Modal>
      <VzTable.Cell.TextOverflow>
        <a id={id} onClick={modalOn}>{text}</a>
      </VzTable.Cell.TextOverflow>
    </>
  );
};

export default ModalItemDocument;
