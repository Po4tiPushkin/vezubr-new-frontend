import React, { useCallback, useContext, useMemo, useEffect } from 'react';
import { observer } from 'mobx-react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import cn from 'classnames';
import { isNumber } from '@vezubr/common/utils';
import Utils from '@vezubr/common/common/utils';
import { OrderPaymentContext } from '../../../../context';

function OrderPaymentSummary(props) {
  const { article, vat = false } = props;

  const { store } = useContext(OrderPaymentContext);
  const summary = store.getSummary(article);
  const costPerItem = store.getCostPerItem(article);
  const quantity = store.getQuantity(article);

  let total = summary ? summary : costPerItem * (quantity || 1);

  return <div className={'order-payment-summary'}>{Utils.moneyFormat(total, 100, false)}</div>;
}

OrderPaymentSummary.propTypes = {
  article: PropTypes.number.isRequired,
};

export default compose([observer])(OrderPaymentSummary);
