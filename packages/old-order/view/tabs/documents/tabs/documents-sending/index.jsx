import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Ant, showAlert, Loader, showError, WhiteBox, VzEmpty } from '@vezubr/elements';
import _isEmpty from 'lodash/isEmpty';
import * as Order from '../../../../..';
import { connect } from 'react-redux';
import t from '@vezubr/common/localization';
import { Documents as DocumentsService, Orders as OrderService } from '@vezubr/services';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { fileGetFileData } from '@vezubr/common/utils';
import _compact from 'lodash/compact';

const statusesWhenCanCloseOrder = [310, 400];

const CLS = 'order-view-tab-documents';

const DocumentsSending = (props) => {
  const { documentTypes, orderDocumentCategories, order, reload: reloadOrder } = props;
  // const { order, reload: reloadOrder } = useContext(OrderContextView);

  const { id: orderId } = order || {};

  const [loading, setLoading] = useState(false);
  const [documents, setDocuments] = useState(null);
  const systemState = order.systemState;

  const isEditablePaymentDetails = useMemo(() => {
    return !order?.isDocumentsAcceptedByClient;
  }, [order]);

  const filesRef = useRef(null);

  const [pending, setPending] = useState(false);

  const documentCategories = useMemo(() => ([...documentTypes, ...orderDocumentCategories]), [
    documentTypes,
    orderDocumentCategories,
  ]);

  const onChangeFiles = useCallback(async (info, files) => {
    if (info.action == "remove-file") {
      const id = info?.fileData[0]?.orderDocumentId
      if (id) {
        await OrderService.deleteOrderDocument(info.fileData[0]?.orderDocumentId);
      }
    }
    filesRef.current = files;
  }, []);

  const onInitFiles = useCallback((files) => {
    filesRef.current = files;
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      const response = await DocumentsService.orderDetailsInType({
        orderId,
        type: 'order',
      });
      const docs = (response || []).map((doc) => ({ ...doc, files: (doc?.files || []).map(fileGetFileData) }));
      setDocuments(docs);
    } catch (e) {
      console.error(e);
    }
    finally {
      setLoading(false)
    }

  }, [orderId]);

  const releaseOrder = useCallback(async () => {
    const requestUpdated = {
      orderId,
    };

    requestUpdated.documents = filesRef.current;

    setPending(true);

    try {
      await OrderService.finalizeWithoutCalculation(requestUpdated);
      showAlert({
        content: t.common('Документы отправлены'),
        title: 'ОК',
        onOk: () => {
          fetchData();
        },
      });
    } catch (e) {
      showError(e);
    }

    setPending(false);
  }, [reloadOrder, orderId]);

  useEffect(() => {
    if (orderId) {
      fetchData();
    }
  }, [orderId])

  const documentsGroups = useMemo(
    () => [
      ...order.points.map((point, index) => ({
        title: 'Адрес: ' + `${_compact([point.id, point.externalId, point.addressString]).join(' / ')}`,
        predicate: (d) => d.required && d.point === index + 1,
      })),
      {
        title: 'Документы к рейсу',
        predicate: (d) => d.required && !d.point,
      },
      {
        title: 'Дополнительные документы',
        predicate: (d) => !d.required,
      },
    ],
    [order.points],
  );

  const isCanCloseOrder = useMemo(() => {
    return !order?.isDocumentsAcceptedByClient && statusesWhenCanCloseOrder.some((status) => order?.orderUiState.state === status)
  }, [order]);

  const renderDocumentsSection = ({ editable, title, useDocuments }) => (
    <section className={`${CLS}__docs clearfix`}>
      <WhiteBox.Header
        type={'h2'}
        hr={false}
        icon={<Ant.Icon type={'snippets'} />}
        iconStyles={{ color: '#F57B23' }}
      >
        {title}
      </WhiteBox.Header>
      {!loading ? (
        <>
          <div className={`${CLS}__no-padding`}>
            <Order.DocumentsViewerUploader
              documentCategories={documentCategories}
              documents={useDocuments}
              editable={editable}
              groups={documentsGroups}
              onChange={onChangeFiles}
              onInit={onInitFiles}
              showComments={false}
              key={orderId}
            />
          </div>
        </>
      ) : (
        <div className={`${CLS}__skeleton`}>
          <Ant.Skeleton active paragraph={{ rows: 5 }} />
        </div>
      )}
    </section>
  );

  if (_isEmpty(order)) {
    return (
      <>
        <div className={`${CLS}__skeleton`}>
          <Ant.Skeleton active paragraph={{ rows: 15 }} />
        </div>
      </>
    );
  }

  if (systemState === 11) {
    const documentsAvailable = (documents || []).filter(doc => doc.files.length > 0);

    return (
      <>
        {!loading && documentsAvailable.length === 0 ? (
          <VzEmpty
            className={'margin-top-100'}
            vzImageName={'emptyDocuments'}
            title={'Документы рейса'}
          />
        ) : (
          <>
            {renderDocumentsSection({
              editable: false,
              title: 'Загруженные документы',
              useDocuments: documentsAvailable,
            })}
          </>
        )}
      </>
    );
  }

  return (
    <>
      {renderDocumentsSection({
        editable: isEditablePaymentDetails,
        title: 'Документы рейса',
        useDocuments: documents || [],
      })}

      {isCanCloseOrder && (
        <div className={`${CLS}__actions ${CLS}__actions--producer`} style={{
          boxShadow: '0 0 3px #faa526',
          padding: 10,
          borderRadius: 30,
          background: '#fff'
        }}>
          <Ant.Button htmlType="submit" type={'primary'} onClick={releaseOrder} disabled={pending}>
            Отправить документы
          </Ant.Button>
        </div>
      )}

      {pending && <Loader />}
    </>
  );
}

const mapStateToProps = (state) => {
  const {
    dictionaries: { documentTypes, orderDocumentCategories },
  } = state;
  return {
    documentTypes,
    orderDocumentCategories,
  };
};

export default connect(mapStateToProps)(DocumentsSending);
