import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Ant, showAlert, showError, VzEmpty, VzForm, WhiteBox, Loader } from '@vezubr/elements';
import { Documents as DocumentsService, Orders as OrderService } from '@vezubr/services';
import _isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import * as Order from '../../../../..';
import { connect } from 'react-redux';
import t from '@vezubr/common/localization';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { fileGetFileData } from '@vezubr/common/utils';
import _compact from 'lodash/compact';

const DocumentsViewerUploader = Order.DocumentsViewerUploader;

const CLS = 'order-view-tab-documents';

const DocumentsAccepting = (props) => {
  const { documentCategories, isAcceptingAvailable, order, reload: reloadInput } = props;

  const orderId = order?.id
  const [pending, setPending] = useState(false);

  const [documentsState, setDocumentsState] = useState(null);
  const [rejectComment, setRejectComment] = useState('')

  const handleDocumentClick = useCallback((e) => setDocumentsState(e.target.value), []);
  const handleCommentClick = useCallback((e) => setRejectComment(e.target.value), []);

  const fetchData = useCallback(async () => {
    const response = await DocumentsService.orderDetails({
      orderId,
      type: 'order',
    });
    return (response || []).map((doc) => ({ ...doc, files: (doc?.files || []).map(fileGetFileData) }));
  }, [orderId]);
  const [documents, loadingDocuments] = useCancelableLoadData(fetchData, !orderId);


  const reload = useCallback(async () => {
    setPending(true);

    try {
      await reloadInput();
    } catch (e) {
      showError(e);
    }

    setPending(false);
  }, [reloadInput]);

  const accept = useCallback(async () => {
    setPending(true);

    try {
      await OrderService.acceptOrderDocument(orderId);
      showAlert({
        content: t.common('Документы утверждены'),
        title: 'ОК',
        onOk: () => {
          reload();
        },
      });
    } catch (e) {
      showError(e);
    }

    setPending(false);
  }, [orderId, reload]);

  const reject = useCallback(async () => {
    setPending(true);

    try {
      await OrderService.rejectOrderDocument({
        orderId,
        startupMessage: rejectComment,
        clientId: order?.client?.id,
      });
      showAlert({
        content: t.common('Документы отклонены'),
        title: 'ОК',
        onOk: () => {
          reload();
        },
      });
    } catch (e) {
      showError(e);
    }
    setPending(false);
  }, [orderId, reload, rejectComment]);

  const documentsGroups = useMemo(
    () => [
      ...Object.values(order.points).map((point, index) => ({
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

  const renderDocuments = ({ title, useDocuments = [] }) => {
    const documentsToRender = isAcceptingAvailable ? useDocuments : (useDocuments || []).filter((doc) => doc.files.length > 0);
    return (
      <>
        <WhiteBox.Header type={'h2'} hr={false} icon={<Ant.Icon type={'snippets'} />} iconStyles={{ color: '#F57B23' }}>
          {title}
        </WhiteBox.Header>
        {!loadingDocuments ? (
          <>
            <div className={`${CLS}__no-padding`}>
              <DocumentsViewerUploader
                documentCategories={documentCategories}
                documents={documentsToRender || []}
                editable={false}
                groups={documentsGroups}
              />
            </div>
          </>
        ) : (
          <div className={`${CLS}__skeleton`}>
            <Ant.Skeleton active paragraph={{ rows: 5 }} />
          </div>
        )}
      </>
    );
  };

  if (!orderId) {
    return (
      <>
        <div className={`${CLS}__skeleton`}>
          <Ant.Skeleton active paragraph={{ rows: 15 }} />
        </div>
      </>
    );
  }

  const needToAccept = order?.isDocumentsAcceptedByProducer && !order?.isDocumentsAcceptedByClient;
  const disabled = !order?.isDocumentsAcceptedByProducer

  const isRejectMode = useMemo(() => {
    return documentsState === 'reject'
  }, [documentsState])

  if (!isAcceptingAvailable) {
    const documentsAvailable = (documents || []).filter((doc) => doc.files.length > 0);

    return (
      <div className={`${CLS} order-view__tab`}>
        {!loadingDocuments && documentsAvailable.length === 0 ? (
          <VzEmpty className={'margin-top-100'} vzImageName={'emptyDocuments'} title={'Документы рейса'} />
        ) : (
          <>
            {renderDocuments({
              title: 'Загруженные документы',
              useDocuments: documentsAvailable,
            })}
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <section className={`${CLS}__docs`}>
        {renderDocuments({
          title: 'Документы рейса',
          useDocuments: documents,
        })}
      </section>

      {needToAccept && (
        <>
          {documentsState && (
            <div
              className={cn(`${CLS}__actions`, `${CLS}__actions__result`, {
                [`${CLS}__actions__result--error`]: isRejectMode,
              })}
            >
              {isRejectMode ? (
                <>
                  <div className={`${CLS}__comment`}>
                    <Ant.Input.TextArea
                      allowClear={true}
                      defaultValue={rejectComment}
                      placeholder={'Укажите причину отклонения'}
                      rows={2}
                      autoSize={{
                        minRows: 2,
                        maxRows: 2,
                      }}
                      onChange={handleCommentClick}
                    />
                  </div>
                  <Ant.Button htmlType="submit" disabled={disabled} type={'danger'} onClick={reject}>
                    Отклонить
                  </Ant.Button>
                </>
              ) : (documentsState == 'accept' || APP === 'client') ? (
                <Ant.Button disabled={disabled} htmlType="submit" type={'primary'} onClick={accept}>
                  Утвердить документы
                </Ant.Button>
              ) : null}
            </div>
          )}
          <div className={`${CLS}__actions ${disabled}`}>
            <Ant.Radio.Group
              className={`${CLS}__radio`}
              value={documentsState}
              onChange={handleDocumentClick}
              buttonStyle="solid"
            >
              <Ant.Radio.Button className={`${CLS}__radio__button ${CLS}__radio__button--reject`} value="reject">
                Есть недостающие документы
              </Ant.Radio.Button>
              <Ant.Radio.Button className={`${CLS}__radio__button`} value="accept">
                Документы в порядке
              </Ant.Radio.Button>
            </Ant.Radio.Group>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => {
  const {
    dictionaries: { documentTypes, orderDocumentCategories },
  } = state;
  return {
    documentCategories: [...documentTypes, ...orderDocumentCategories],
  };
};

export default connect(mapStateToProps)(DocumentsAccepting)
