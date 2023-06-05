import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { deepObserve } from 'mobx-utils';
import { useObserver } from 'mobx-react';
import PropTypes from 'prop-types';
import { useDebouncedCallback } from 'use-debounce';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import OrderPaymentTotal from './form-components/order-payment-total';
import useColumns from './hooks/useColumns';
import { VzTable } from '@vezubr/elements';
import OrderPaymentDetailsStore from '../../store/OrderPaymentDetails';
import _differenceBy from 'lodash/differenceBy';
import _difference from 'lodash/difference';
import { OrderPaymentContext } from '../../context';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { ADDITIONAL_TIME_ARTICLES, LOADERS_ARTICLES_TO_KEYS, MINIMAL_TIME_ARTICLES, SENDABLE_TIME_ARTICLES } from '../../constants';

const getCompletedAt = (start, workTime) => {
  let completed = moment(start, 'DD.MM.YYYY HH:mm');
  Object.entries(workTime).forEach(([article, value]) => {
    if (value) {
      completed = completed.add(value, 'minutes');
    }
  });

  return completed.format('DD.MM.YYYY HH:mm');
};

function OrderPaymentDetails(props) {
  const {
    orderServices,
    details,
    editable,
    onChange,
    orderType,
    withVatRate = true,
    calculation: { startedAt, completedAt, requiredLoaderSpecialities } = {},
    tariffType,
    tariffServiceCost,
    workTime,
    setWorkTime
  } = props;
  const user = useSelector((state) => state.user);
  const dictionaries = useSelector((state) => state.dictionaries);

  const detailsPrev = usePrevious(details);

  const [store] = useState(
    new OrderPaymentDetailsStore({
      details,
      params: {
        orderServices,
        orderType,
        tariffType,
      },
      editable,
      withVatRate: withVatRate && (user.costWithVat ? details[0]?.vatRate || parseInt(user?.vatRate) : 0),
      startedAt: startedAt || null,
      completedAt: completedAt || null,
      loaders: requiredLoaderSpecialities,
      tariffServiceCost,
      dictionaries,
    }),
  );

  const contextValue = useMemo(
    () => ({
      store,
      workTime: {
        value: workTime,
        get: () => workTime,
        set: (newWorkTime, updateTime = false) => {
          const updatedWorkTime = {
            ...workTime,
            ...newWorkTime,
          };
          if (updateTime) {
            store.setCompletedAt(getCompletedAt(store.startedAt, updatedWorkTime));
          }
          setWorkTime(updatedWorkTime);
          onChangeDebounced();
        },
      },
    }),
    [store, workTime],
  );

  const dataSource = useObserver(() => {
    const dataSource = store.articles.map((article, index) => ({ article, index }));
    if (store.editable && store.hasAvailableArticles) {
      dataSource.push({
        article: -1,
      });
    }
    return dataSource;
  });

  const [columns, width] = useColumns({ orderServices, store, user, withVatRate, orderType });
  const footer = useCallback(() => <OrderPaymentTotal />, []);

  const [onChangeDebounced] = useDebouncedCallback(() => {
    onChange(store.getDetails(), {
      startedAt: store.startedAt,
      completedAt: store.articles.find((item) => ADDITIONAL_TIME_ARTICLES.includes(item))
        ? getCompletedAt(store.startedAt, workTime)
        : store.completedAt,
      loadersCount:
        Object.values(store.getAllLoaders()).reduce((acc, item) => {
          acc = acc + item;
          return acc;
        }, 0) || null,
      requiredLoaderSpecialities: Object.entries(store.getAllLoaders()).reduce((acc, [key, value]) => {
        if (!acc[LOADERS_ARTICLES_TO_KEYS[key]]) {
          acc[LOADERS_ARTICLES_TO_KEYS[key]] = value;
        }
        return acc;
      }, {}),
      workTime,
    });
  }, 50);

  useEffect(() => {
    store.setEditable(editable);
    if (detailsPrev && _differenceBy(detailsPrev, details, 'article').length > 0) {
      store.setInitial(details);
    }
  }, [editable, details, detailsPrev]);

  const disposerDeepObserve = deepObserve(store, (change, path, root) => {
    if (change.name !== '_articles_init') {
      onChangeDebounced();
    }
  });

  useEffect(() => {
    return () => {
      disposerDeepObserve();
    };
  }, []);

  return (
    <OrderPaymentContext.Provider value={contextValue}>
      <VzTable.Table
        className={'order-payment-details'}
        bordered={true}
        columns={columns}
        dataSource={dataSource}
        rowKey={(record) => record.article?.toString() + record.index?.toString()}
        pagination={false}
        footer={footer}
        scroll={{
          x: width,
          y: null,
        }}
      />
    </OrderPaymentContext.Provider>
  );
}

OrderPaymentDetails.defaultProps = {
  editable: false,
};

OrderPaymentDetails.propTypes = {
  details: PropTypes.arrayOf(PropTypes.object),
  editable: PropTypes.bool,
  orderServices: PropTypes.object.isRequired,
  onChange: PropTypes.func,
};

export default OrderPaymentDetails;
