import React, { useCallback, useEffect, useState } from 'react';
import { Modal } from '@vezubr/elements';
import OrderAccountingDocuments from '@vezubr/order/form/components/order-accounting-documents';
import { observer, OBSERVER_ACTIONS } from '../../../../../../infrastructure';

const OrderAccountingDocumentsAction = (props) => {
  const [modalVisible, setModalVisible] = useState(false);

  const {editable, docs, uploadDoc} = props;

  const modalToggle = useCallback(() => {
    setModalVisible(!modalVisible);
  }, [modalVisible, setModalVisible]);

  const modalClose = useCallback(() => {
    setModalVisible(false);
  }, [setModalVisible]);

  useEffect(() => {
    observer.on(OBSERVER_ACTIONS.ACTION_ORDER_ACCOUNTING_DOCUMENTS, modalToggle);
    return () => {
      observer.off(OBSERVER_ACTIONS.ACTION_ORDER_ACCOUNTING_DOCUMENTS, modalToggle);
    };
  }, [modalToggle]);

  const docsDownload = React.useMemo(() => {
    const newDocs = { ...docs };
    if (!newDocs) {
      return null;
    }
    Object.keys(newDocs).forEach((el) => {
      if (typeof newDocs[el] === 'object' && newDocs[el]?.downloadUrl) {
        newDocs[el].downloadUrl = `${window.API_CONFIGS[APP].host.replace(/\/$/, '')}${newDocs[el].downloadUrl}`;
      }
    });
    return newDocs;
  }, [docs]);

  return (
    <Modal
      title={'Документы для скачивания'}
      className={'order-accounting-documents__modal'}
      visible={modalVisible}
      width={1200}
      bodyNoPadding={true}
      centered={false}
      destroyOnClose={true}
      onCancel={modalClose}
      footer={null}
    >
      <OrderAccountingDocuments
        editable={editable}
        docs={docsDownload}
        uploadDoc={uploadDoc}
      />
    </Modal>
  );
}

export default OrderAccountingDocumentsAction;