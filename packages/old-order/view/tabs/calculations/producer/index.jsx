import React, { memo, useCallback, useContext, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Ant, showAlert, showError, VzEmpty, WhiteBox, Loader } from '@vezubr/elements';
import { Documents as DocumentsService, Orders as OrderService } from '@vezubr/services';
import _isEmpty from 'lodash/isEmpty';
import cn from 'classnames';
import * as Order from '../../../../';
import { connect, useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { fileGetFileData } from '@vezubr/common/utils';
import _compact from 'lodash/compact';
import moment from 'moment';
import { ALL_TIME_ARTICLES } from '../../../../constants';
const PaymentDetails = memo(Order.PaymentDetails);
const DocumentsViewerUploader = memo(Order.DocumentsViewerUploader);

const statusesWhenCanCloseOrder = [310, 400];

const CLS = 'order-view-tab-calculation-producer';

const OrderViewTabCalculationProducer = (props) => {
  const { history, order = {}, calculations, reload: reloadInput, isAcceptingAvailable } = props;
  const { orderServices, documentTypes, orderDocumentCategories } = useSelector((state) => state.dictionaries);

  const { calculationProducer, strategyType, republishStrategyType, orderUiState } = order;
  const {
    finalCalculation: tariffDynamicFinalCalculation,
    preliminaryCalculation: tariffDynamicPreCalculation,
    producer: { isVatPayer: isProducerVat } = {},
    tariffServiceCost
  } = calculationProducer || {};
  const user = useSelector((state) => state.user);
  const [editableMode, setEditableMode] = useState(APP == 'producer');
  const [orderWorkTime, setOrderWorkTime] = useState({
    startedAt: tariffDynamicFinalCalculation?.startedAt || null,
    completedAt: tariffDynamicFinalCalculation?.completedAt || null,
  });

  const paymentDetailsRef = useRef(tariffDynamicFinalCalculation?.details || null);
  const filesRef = useRef(null);

  const [calculationEmpty, setCalculationEmpty] = useState(false);
  const calculationClassName = calculationEmpty ? `${CLS}__calculations--empty` : '';
  const [pending, setPending] = useState(false);
  const [paymentState, setPaymentState] = useState(null);
  const [documentState, setDocumentState] = useState(null);
  const rejectCommentRef = useRef('');

  const { id: orderId } = order || {};

  const isAccepted =
    calculationProducer?.isCalcDocumentsAcceptedByProducer && !calculationProducer?.isCalcDocumentsAcceptedByClient;

  const documentCategories = useMemo(
    () => [...documentTypes, ...orderDocumentCategories],
    [documentTypes, orderDocumentCategories],
  );

  const isCanFinalize = useMemo(() => {
    const conditionStatus = statusesWhenCanCloseOrder.some((status) => order?.orderUiState?.state === status);
    return !calculationProducer?.isCalcDocumentsAcceptedByClient && conditionStatus;
  }, [order, calculationProducer]);

  const canEditableDetails = useMemo(() => {
    return editableMode && isCanFinalize;
  }, [editableMode, isCanFinalize]);

  const isCanVisibleButtonMode = useMemo(() => {
    return (
      APP !== 'producer' && order?.producerDelegateManagement && !calculationProducer?.isCalcDocumentsAcceptedByClient
    );
  }, [order, calculationProducer]);

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

  const handlePaymentClick = useCallback((e) => setPaymentState(e.target.value), []);
  const handleDocumentClick = useCallback((e) => setDocumentState(e.target.value), []);
  const handleCommentClick = useCallback((e) => (rejectCommentRef.current = e.target.value), []);

  const reload = useCallback(async () => {
    setPending(true);

    try {
      await reloadInput();
    } catch (e) {
      showError(e);
    }

    setPending(false);
  }, [reloadInput]);

  const changeEditableMode = () => {
    setEditableMode(!editableMode);
  };

  const cancelableEditableMode = () => {
    changeEditableMode();
    reload();
  };

  const finalizeOrder = useCallback(
    async (dates) => {
      let requestUpdated = {
        orderId,
        producerId: calculationProducer.producer?.id,
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

      if (user?.costWithVat && !isProducerVat) {
        requestUpdated.replacementServiceItems = (requestUpdated.replacementServiceItems || []).map((el) => {
          if (el.costPerItem) {
            el.costPerItem = +(el.costPerItem * ((100 + +user?.vatRate) / 100)).toFixed(0);
          }
          return el;
        });
      }
      setPending(true);

      try {
        setCalculationEmpty(false);
        await OrderService.finalize(requestUpdated);
        showAlert({
          content: t.common(orderUiState.state < 400 ? 'Рейс завершен' : 'Расчёт успешно отправлен'),
          title: 'ОК',
          onOk: () => {
            cancelableEditableMode();
            window.location.reload();
          },
          onCancel: () => {
            cancelableEditableMode();
            window.location.reload();
          },
        });
      } catch (e) {
        showError(e);
      }

      setPending(false);
    },
    [reload, orderId, calculationProducer, user, orderWorkTime],
  );

  const accept = useCallback(async () => {
    setPending(true);

    try {
      await OrderService.acceptOrderCalculation({
        orderId,
        calculationId: tariffDynamicFinalCalculation?.id || calculations?.effective?.id,
      });
      showAlert({
        content: t.common('Расчет утвержден'),
        title: 'ОК',
        onOk: () => {
          reload();
        },
      });
    } catch (e) {
      showError(e);
    }

    setPending(false);
  }, [orderId, reload, tariffDynamicFinalCalculation?.id, calculations?.effective?.id]);

  const reject = useCallback(async () => {
    setPending(true);

    try {
      await OrderService.rejectOrderCalculation(
        orderId,
        tariffDynamicFinalCalculation?.id || calculations?.effective?.id,
        rejectCommentRef.current,
      );
      showAlert({
        content: t.common('Расчет отклонен'),
        title: 'ОК',
        onOk: () => {
          reload();
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

  const documentsGroups = useMemo(
    () => [
      {
        title: 'Документы к рейсу',
        predicate: (d) => d.required && !d.point,
      },
      ...Object.values(order.points).map((point, index) => ({
        title: 'Адрес: ' + `${_compact([point.id, point.externalId, point.addressString]).join(' / ')}`,
        predicate: (d) => d.required && d.point === index + 1,
      })),
      {
        title: 'Дополнительные документы',
        predicate: (d) => !d.required,
      },
    ],
    [order.points],
  );

  const renderDocuments = ({ title, useDocuments, editable }) => {
    return (
      <>
        <WhiteBox.Header type={'h2'} hr={false} icon={<Ant.Icon type={'snippets'} />} iconStyles={{ color: '#F57B23' }}>
          {title}
        </WhiteBox.Header>
        {!loadingDocuments ? (
          <div className={`${CLS}__no-padding`}>
            <DocumentsViewerUploader
              documentCategories={documentCategories}
              documents={useDocuments || []}
              editable={editable}
              groups={documentsGroups}
              onChange={onChangeFiles}
              onInit={onInitFiles}
              showComments={false}
            />
          </div>
        ) : (
          <div className={`${CLS}__skeleton`}>
            <Ant.Skeleton active paragraph={{ rows: 5 }} />
          </div>
        )}
      </>
    );
  };

  const finalActions = () => {
    if (editableMode) {
      return (
        <div className={`${CLS}__actions-wrp`}>
          {isCanVisibleButtonMode && (
            <Ant.Button
              className={`${CLS}__button-mode`}
              htmlType="submit"
              type={'primary'}
              onClick={cancelableEditableMode}
            >
              Отмена
            </Ant.Button>
          )}
          {isCanFinalize && (
            <Ant.Button htmlType="submit" type={'primary'} onClick={finalizeOrder} disabled={pending}>
              Отправить расчет и документы
            </Ant.Button>
          )}
        </div>
      );
    }
    return (
      <>
        {isCanVisibleButtonMode && (
          <Ant.Button className={`${CLS}__button-mode margin-left-10`} htmlType="submit" type={'primary'} onClick={changeEditableMode}>
            Редактирование от имени подрядчика
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
      </>
    );
  };

  if (_isEmpty(order)) {
    return (
      <WhiteBox className={`${CLS} order-view__tab`}>
        <div className={`${CLS}__skeleton`}>
          <Ant.Skeleton active paragraph={{ rows: 15 }} />
        </div>
      </WhiteBox>
    );
  }

  if (isAcceptingAvailable == false) {
    const documentsAvailable = (documents || []).filter((doc) => doc.files.length > 0);

    return (
      <WhiteBox className={`${CLS} order-view__tab`}>
        {APP !== 'client' && order?.orderUiState?.state > 201 && order?.orderUiState?.state < 800 && (
          <Order.WorkTime reload={reload} order={order} />
        )}
        {documentsAvailable.length === 0 ? (
          <VzEmpty
            className={'margin-top-100'}
            vzImageName={'emptyDocuments'}
            title={'Документы и расчет'}
            description={
              order?.orderUiState?.state > 201 && order?.orderUiState?.state < 800
                ? 'Данные будут отображены после завершения рейса'
                : ''
            }
          />
        ) : (
          <>
            {renderDocuments({
              title: 'Загруженные документы',
              useDocuments: decorateDocuments(documentsAvailable),
              editable: false,
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
          paddingBottom: `${!editableMode && isAccepted ? '76px' : 0}`,
        }}
      >
        <WhiteBox.Header
          style={{ marginTop: 0 }}
          type={'h2'}
          hr={false}
          icon={<Ant.Icon type={'form'} />}
          iconStyles={{ color: '#F57B23' }}
        >
          {(republishStrategyType ? republishStrategyType == 'tariff' : strategyType == 'tariff') && (tariffDynamicFinalCalculation?.tariffId || tariffDynamicPreCalculation?.tariffId) ? (
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
            withVatRate={isProducerVat}
            calculation={tariffDynamicFinalCalculation || {}}
            tariffServiceCost={tariffServiceCost}
          />
        </div>

        {!editableMode && isAccepted && (
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
          paddingBottom: `${resultRejected ? '146px' : '76px'}`,
        }}
      >
        {renderDocuments({
          title: 'Документы к расчету',
          useDocuments: decorateDocuments(documents),
          editable: canEditableDetails,
        })}

        {!editableMode && isAccepted && (
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
        {finalActions()}
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

OrderViewTabCalculationProducer.propTypes = {
  orderServices: PropTypes.object.isRequired,
  orderDocumentCategories: PropTypes.object.isRequired,
  documentTypes: PropTypes.object.isRequired,
  acceptingAvailable: PropTypes.bool,
  tariffDynamicFinalCalculation: PropTypes.object,
  calculationProducer: PropTypes.object,
};

export default OrderViewTabCalculationProducer;
