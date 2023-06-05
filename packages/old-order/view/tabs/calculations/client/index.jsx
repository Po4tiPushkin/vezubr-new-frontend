import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Ant, showAlert, Loader, showError, WhiteBox, VzEmpty } from '@vezubr/elements';
import _isEmpty from 'lodash/isEmpty';
import * as Order from '../../../../';
import { connect, useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
import { Documents as DocumentsService, Orders as OrderService } from '@vezubr/services';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { fileGetFileData } from '@vezubr/common/utils';
import cn from 'classnames';
import moment from 'moment';
import { ALL_TIME_ARTICLES } from '../../../../constants';

const PaymentDetails = memo(Order.PaymentDetails);
const DocumentsViewerUploader = memo(Order.DocumentsViewerUploader);

const statusesWhenCanCloseOrder = [310, 400];

const CLS = 'order-view-tab-calculation-client';

const OrderViewTabCalculationClient = (props) => {
  const { history, order = {}, calculations, reload: reloadInput } = props;
  const { orderServices, documentTypes, orderDocumentCategories } = useSelector((state) => state.dictionaries);
  const { calculationClient, strategyType, orderUiState } = order;
  const { 
    finalCalculation: tariffDynamicFinalCalculation,
    preliminaryCalculation: tariffDynamicPreCalculation,
    client: { isVatPayer: isClientVat } = {},
    tariffServiceCost
  } = calculationClient || {};
  const rejectCommentRef = useRef('');
  const [paymentState, setPaymentState] = useState(null);
  const [documentState, setDocumentState] = useState(null);
  const [acceptedMode, setAcceptedMode] = useState(APP == 'client');
  const [orderWorkTime, setOrderWorkTime] = useState({
    startedAt: tariffDynamicFinalCalculation?.startedAt || null,
    completedAt: tariffDynamicFinalCalculation?.completedAt || null,
  });
  const user = useSelector((state) => state.user);
  const reload = useCallback(async () => {
    setPending(true);

    try {
      await reloadInput();
    } catch (e) {
      showError(e);
    }

    setPending(false);
  }, [reloadInput]);

  const { id: orderId } = order || {};

  const systemState = order.systemState;
  const isAccepted =
    calculationClient?.isCalcDocumentsAcceptedByProducer && !calculationClient?.isCalcDocumentsAcceptedByClient;

  const isCanFinalize = useMemo(() => {
    const conditionStatus = statusesWhenCanCloseOrder.some((status) => order?.orderUiState?.state === status);
    return !calculationClient?.isCalcDocumentsAcceptedByClient && conditionStatus;
  }, [order, calculationClient]);

  const canEditableDetails = useMemo(() => {
    return !acceptedMode && isCanFinalize;
  }, [acceptedMode, isCanFinalize]);

  const isCanVisibleButtonMode = useMemo(() => {
    return (
      APP !== 'client' &&
      order?.clientDelegateManagement &&
      (!calculationClient?.isCalcDocumentsAcceptedByClient || !calculationClient?.isCalcDocumentsAcceptedByProducer)
    );
  }, [calculationClient]);

  const paymentDetailsRef = useRef(tariffDynamicFinalCalculation?.details || null);
  const filesRef = useRef(null);

  const [pending, setPending] = useState(false);
  const [calculationEmpty, setCalculationEmpty] = useState(false);
  const calculationClassName = calculationEmpty ? `${CLS}__calculations--empty` : '';

  const handlePaymentClick = useCallback((e) => setPaymentState(e.target.value), []);
  const handleDocumentClick = useCallback((e) => setDocumentState(e.target.value), []);
  const handleCommentClick = useCallback((e) => (rejectCommentRef.current = e.target.value), []);

  const documentCategories = useMemo(
    () => [...documentTypes, ...orderDocumentCategories],
    [documentTypes, orderDocumentCategories],
  );

  const onChangePaymentDetails = useCallback((details, workTime) => {
    paymentDetailsRef.current = details;
    setOrderWorkTime(workTime);
  }, []);

  const onChangeFiles = useCallback((info, files) => {
    filesRef.current = files;
  }, []);

  const onInitFiles = useCallback((files) => {
    filesRef.current = files;
  }, []);

  const changeAcceptedMode = () => {
    setAcceptedMode(!acceptedMode);
  };

  const cancelableAcceptedMode = () => {
    changeAcceptedMode();
    reload();
  };

  const releaseOrder = useCallback(
    async (dates) => {
      let requestUpdated = {
        orderId,
      };

      requestUpdated.documents = filesRef.current;

      const { startedAt, completedAt } = orderWorkTime;

      if (orderWorkTime && tariffDynamicFinalCalculation.tariffType !== 4 && paymentDetailsRef?.current?.find((item) => ALL_TIME_ARTICLES.includes(parseInt(item.article)))) {
        requestUpdated = {
          ...requestUpdated,
          ...orderWorkTime,
          startedAt: moment(startedAt, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
          completedAt: moment(completedAt, 'DD.MM.YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss'),
        };
      }

      if (paymentDetailsRef.current) {
        requestUpdated.replacementServiceItems = paymentDetailsRef.current.map((el) => ({
          ...el,
          article: Number(el.article),
          costPerItem: Math.ceil(el.costPerItem),
        }));
        requestUpdated.replacementServiceItems = requestUpdated.replacementServiceItems.filter(
          (item) => !ALL_TIME_ARTICLES.includes(item.article),
        );
      }

      setPending(true);

      try {
        setCalculationEmpty(false);
        await OrderService.finalize(requestUpdated);
        showAlert({
          content: t.common(orderUiState.state < 400 ? 'Рейс завершен' : 'Расчёт успешно отправлен'),
          title: 'ОК',
          onOk: () => {
            window.location.reload();
          },
          onCancel: () => {
            window.location.reload();
          },
        });
      } catch (e) {
        showError(e);
      }

      setPending(false);
    },
    [reload, orderId, paymentDetailsRef, orderWorkTime],
  );

  const accept = useCallback(async () => {
    setPending(true);

    try {
      await OrderService.acceptOrderCalculation({
        orderId,
        calculationId: tariffDynamicFinalCalculation?.id || calculations?.effective?.id,
        clientId: calculationClient.client.id,
      });
      showAlert({
        content: t.common('Расчет утвержден'),
        title: 'ОК',
        onOk: () => {
          cancelableAcceptedMode();
        },
      });
    } catch (e) {
      showError(e);
    }

    setPending(false);
  }, [orderId, reload, calculationClient, tariffDynamicFinalCalculation?.id, calculations?.effective?.id]);

  const reject = useCallback(async () => {
    setPending(true);

    try {
      await OrderService.rejectOrderCalculation(
        orderId,
        tariffDynamicFinalCalculation?.id || calculations?.effective?.id,
        rejectCommentRef.current,
        calculationClient.client.id,
      );
      showAlert({
        content: t.common('Расчет отклонен'),
        title: 'ОК',
        onOk: () => {
          cancelableAcceptedMode();
        },
      });
    } catch (e) {
      showError(e);
    }
    setPending(false);
  }, [orderId, reload, tariffDynamicFinalCalculation?.id, calculations?.effective?.id]);

  const fetchData = useCallback(async () => {
    const response = await DocumentsService.orderDetails({
      orderId,
      type: 'producer',
    });
    return (response || []).map((doc) => ({ ...doc, files: (doc?.files || []).map(fileGetFileData) }));
  }, [orderId]);

  const [documents, loadingDocuments] = useCancelableLoadData(fetchData, !orderId);
  const resultRejected = documentState === 'reject' || paymentState === 'reject';

  const documentsGroups = useMemo(
    () => [
      {
        title: 'Дополнительные документы',
        predicate: (d) => !d.required,
      },
    ],
    [order.points],
  );

  const decorateDocuments = (documents) => {
    return (
      documents &&
      documents.map((doc) => {
        return {
          ...doc,
          ...{
            min: 0,
            max: 10,
          },
        };
      })
    );
  };

  const renderDocumentsSection = ({ editable, title, useDocuments }) => (
    <>
      <WhiteBox.Header type={'h2'} hr={false} icon={<Ant.Icon type={'snippets'} />} iconStyles={{ color: '#F57B23' }}>
        {title}
      </WhiteBox.Header>
      {!loadingDocuments ? (
        <>
          <div className={`${CLS}__no-padding`}>
            <DocumentsViewerUploader
              documentCategories={documentCategories}
              documents={useDocuments}
              editable={editable}
              groups={documentsGroups}
              onChange={onChangeFiles}
              onInit={onInitFiles}
              showComments={false}
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

  const finalActions = useMemo(() => {
    if (acceptedMode) {
      return (
        <div className={`${CLS}__actions-wrp`}>
          {isCanVisibleButtonMode && (
            <Ant.Button
              className={`${CLS}__button-mode`}
              htmlType="submit"
              type={'primary'}
              onClick={cancelableAcceptedMode}
            >
              Вернуться обратно
            </Ant.Button>
          )}
          {isAccepted && (
            <>
              <div
                className={cn(`${CLS}__actions`, `${CLS}__actions__result`, {
                  [`${CLS}__actions__result--error`]: resultRejected,
                })}
              >
                {resultRejected ? (
                  <>
                    <div className={`${CLS}__comment`}>
                      <Ant.Input.TextArea
                        allowClear={true}
                        defaultValue={handleCommentClick.current}
                        placeholder={'Укажите причину отклонения'}
                        rows={2}
                        autoSize={{
                          minRows: 2,
                          maxRows: 2,
                        }}
                        onChange={handleCommentClick}
                      />
                    </div>
                    <Ant.Button htmlType="submit" disabled={isAccepted === false} type={'danger'} onClick={reject}>
                      Отклонить
                    </Ant.Button>
                  </>
                ) : (
                  <Ant.Button htmlType="submit" type={'primary'} onClick={accept}>
                    Утвердить расчет и документы
                  </Ant.Button>
                )}
              </div>
            </>
          )}
        </div>
      );
    }

    return (
      <div className={`${CLS}__actions-wrp`}>
        {isCanVisibleButtonMode && (
          <Ant.Button className={`${CLS}__button-mode`} htmlType="submit" type={'primary'} onClick={changeAcceptedMode}>
            Подтверждение от имени клиента
          </Ant.Button>
        )}
        {isCanFinalize && (
          <Ant.Button htmlType="submit" type={'primary'} onClick={releaseOrder} disabled={pending}>
            Отправить расчет и документы
          </Ant.Button>
        )}
      </div>
    );
  }, [releaseOrder, pending, acceptedMode, isAccepted, accept, handleCommentClick, resultRejected]);

  if (_isEmpty(order)) {
    return (
      <WhiteBox className={`${CLS} order-view__tab`}>
        <div className={`${CLS}__skeleton`}>
          <Ant.Skeleton active paragraph={{ rows: 15 }} />
        </div>
      </WhiteBox>
    );
  }

  if (systemState === 11) {
    const documentsAvailable = (documents || []).filter((doc) => doc.files.length > 0);
    const documentsAvailableDecorate = decorateDocuments(documentsAvailable);

    return (
      <WhiteBox className={`${CLS} order-view__tab`}>
        {APP !== 'client' && order?.orderUiState?.state > 201 && order?.orderUiState?.state < 800 && (
          <Order.WorkTime reload={reload} order={order} />
        )}
        {!loadingDocuments && documentsAvailableDecorate.length === 0 ? (
          <VzEmpty className={'margin-top-100'} vzImageName={'emptyDocuments'} title={'Документы и расчет'} />
        ) : (
          <>
            {renderDocumentsSection({
              editable: false,
              title: 'Загруженные документы',
              useDocuments: documentsAvailableDecorate,
            })}
          </>
        )}
      </WhiteBox>
    );
  }

  return (
    <WhiteBox className={`${CLS} order-view__tab`}>
      <section
        className={`${CLS}__calculations clearfix ${calculationClassName}`}
        style={{
          paddingBottom: `${acceptedMode ? '76px' : '0px'}`,
        }}
      >
        <WhiteBox.Header
          style={{ marginTop: 0 }}
          type={'h2'}
          hr={false}
          icon={<Ant.Icon type={'form'} />}
          iconStyles={{ color: '#F57B23' }}
        >
          {strategyType == 'tariff' && (tariffDynamicFinalCalculation?.tariffId || tariffDynamicPreCalculation?.tariffId) ? (
            <>
              Расчет по тарифу:
              <span
                style={{ cursor: 'pointer', color: '#0f94d6' }}
                onClick={() => history.push(`/tariffs/${tariffDynamicFinalCalculation?.tariffId || tariffDynamicPreCalculation?.tariffId}`)}
              >
                {` ${tariffDynamicFinalCalculation?.tariffId || tariffDynamicPreCalculation?.tariffId}`}
              </span>
            </>
          ) : (
            <>{t.order('calculation')}</>
          )}
        </WhiteBox.Header>
        <div className={`${CLS}__no-padding`}>
          <PaymentDetails
            orderType={order?.type}
            orderServices={orderServices}
            editable={canEditableDetails}
            details={tariffDynamicFinalCalculation?.details || []}
            tariffType={tariffDynamicFinalCalculation?.tariffType || []}
            onChange={onChangePaymentDetails}
            withVatRate={isClientVat}
            calculation={tariffDynamicFinalCalculation || {}}
            tariffServiceCost={tariffServiceCost}
          />
        </div>

        {acceptedMode && isAccepted && (
          <div className={`${CLS}__actions`}>
            <Ant.Radio.Group
              className={`${CLS}__radio`}
              value={paymentState}
              onChange={handlePaymentClick}
              buttonStyle="solid"
            >
              <Ant.Radio.Button className={`${CLS}__radio__button ${CLS}__radio__button--reject`} value="reject">
                Отклонить расчет
              </Ant.Radio.Button>
              <Ant.Radio.Button className={`${CLS}__radio__button`} value="accept">
                Принять
              </Ant.Radio.Button>
            </Ant.Radio.Group>
          </div>
        )}
      </section>

      <section
        className={`${CLS}__docs clearfix`}
        style={{
          paddingBottom: `${resultRejected ? '192px' : '102px'}`,
        }}
      >
        {renderDocumentsSection({
          editable: canEditableDetails,
          title: 'Документы к расчету',
          useDocuments: decorateDocuments(documents) || [],
        })}

        {acceptedMode && isAccepted && (
          <>
            <div className={`${CLS}__actions`}>
              <Ant.Radio.Group
                className={`${CLS}__radio`}
                value={documentState}
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
        {finalActions}
      </section>
      {APP !== 'client' && order?.orderUiState?.state > 201 && (
        <div className="gray-line-top">
          <Order.WorkTime reload={reload} order={order} />
        </div>
      )}

      {pending && <Loader />}
    </WhiteBox>
  );
};

OrderViewTabCalculationClient.propTypes = {
  orderServices: PropTypes.object.isRequired,
  orderDocumentCategories: PropTypes.object.isRequired,
  documentTypes: PropTypes.object.isRequired,
  acceptingAvailable: PropTypes.bool,
  tariffDynamicFinalCalculation: PropTypes.object,
  calculationClient: PropTypes.object,
};

export default OrderViewTabCalculationClient;
