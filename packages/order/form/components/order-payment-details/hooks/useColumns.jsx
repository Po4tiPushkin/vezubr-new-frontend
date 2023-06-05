import React, { useMemo } from 'react';
import { useObserver } from 'mobx-react';
import { Ant, VzTable } from '@vezubr/elements';
import { isNumber } from '@vezubr/common/utils';
import { MINIMAL_TIME_ARTICLES, ORDER_SERVICES_CONFIG } from '../../../constants';
import OrderPaymentAddService from '../form-components/order-payment-add-service';
import OrderPaymentDeleteService from '../form-components/order-payment-delete-service';
import OrderPaymentNumberEditor from '../form-components/order-payment-number-editor';
import OrderPaymentSummary from '../form-components/order-payment-summary';
import _difference from 'lodash/difference';

const costFieldOperation = (value = 0, operation) => {
  if (isNumber(value)) {
    return operation(value);
  }
  return value;
};

const costFieldFormat = (value) => costFieldOperation(value, (value) => (value / 100).toFixed(2));
const costFieldParse = (value) => costFieldOperation(value, (value) => value * 100);

function useColumns({ orderServices, store, user, withVatRate, orderType }) {
  const editable = useObserver(() => store.editable);

  const columns = useMemo(
    () => [
      ...(editable
        ? [
            {
              title: <Ant.Icon type={'setting'} />,
              width: 40,
              dataIndex: 'article',
              key: 'actions',
              render: (article) => {
                if (article !== -1) {
                  return <OrderPaymentDeleteService article={article} />;
                }
              },
            },
          ]
        : []),
      {
        title: 'Услуга',
        width: 300,
        dataIndex: 'article',
        key: 'id',
        render: (article) => {
          if (article === -1) {
            return <OrderPaymentAddService orderServices={orderServices} />;
          }
          return `${orderServices?.[article]?.name || 'Неизвестная услуга'} ${orderServices?.[article]?.unit || ''}`;
        },
      },
      {
        title: 'Кол-во',
        width: 120,
        dataIndex: 'article',
        key: 'quantity',
        className: 'col-text-right col-text-bold',
        render: (article) =>
          article !== -1 && (
            <OrderPaymentNumberEditor
              getCurrentProp={'getQuantity'}
              getPrevProp={'getQuantityPrev'}
              setCurrentProp={'setQuantity'}
              min={1}
              step={1}
              article={article}
            />
          ),
      },
      ...(orderType == 2 && _difference(store.articles, MINIMAL_TIME_ARTICLES)
        ? [
            {
              title: 'Кол-во специалистов',
              width: 120,
              dataIndex: 'article',
              className: 'col-text-right col-text-bold',
              key: 'loaders',
              render: (article) =>
                MINIMAL_TIME_ARTICLES.includes(article) && (
                  <OrderPaymentNumberEditor
                    getCurrentProp={'getLoaders'}
                    getPrevProp={'getLoadersPrev'}
                    setCurrentProp={'setLoaders'}
                    min={1}
                    step={1}
                    article={article}
                  />
                ),
            },
          ]
        : []),
      {
        title: `Стоимость,\u00A0руб (${withVatRate ? 'С' : 'Без'}\u00A0НДС)`,
        width: 150,
        dataIndex: 'article',
        key: 'costPerItem',
        className: 'col-text-right col-text-bold',
        render: (article) =>
          article !== -1 && (
            <OrderPaymentNumberEditor
              getCurrentProp={'getCostPerItem'}
              getPrevProp={'getCostPerItemPrev'}
              setCurrentProp={'setCostPerItem'}
              canEditProp={'canEditCostPerItem'}
              formatValue={costFieldFormat}
              parseValue={costFieldParse}
              min={
                ORDER_SERVICES_CONFIG?.[article]?.hasNegative || ORDER_SERVICES_CONFIG?.[article]?.onlyNegative
                  ? undefined
                  : 0
              }
              step={100}
              article={article}
            />
          ),
      },
      ...(withVatRate
        ? [
            {
              title: 'Процент НДС',
              width: 80,
              dataIndex: 'article',
              className: 'col-text-right col-text-bold',
              key: 'vatPercent',
              render: (article) =>
                article !== -1 && `${orderServices[article]?.vatPercent ? orderServices[article]?.vatPercent : 0} %`,
            },
          ]
        : []),
      {
        title: `Cумма,\u00A0руб (${withVatRate ? 'С' : 'Без'}\u00A0НДС)`,
        dataIndex: 'article',
        width: 150,
        key: 'summary',
        className: 'col-text-right col-text-bold',
        render: (article) => article !== -1 && <OrderPaymentSummary article={article} />,
      },
    ],
    [orderServices, editable, user, withVatRate, orderType],
  );
  return VzTable.useColumnsCalcWidth(columns);
}

export default useColumns;
