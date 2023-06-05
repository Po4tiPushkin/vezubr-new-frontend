import React, { useContext, useMemo, useCallback } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { OrderPaymentContext } from '../../../../context';
import { Ant } from '@vezubr/elements';

function OrderPaymentAddService(props) {
  const { orderServices } = props;

  const { store, workTime } = useContext(OrderPaymentContext);

  const availableArticles = store.availableArticles;

  const articleOptions = useMemo(() => {
    return availableArticles.map((article) => {
      const value = ~~article;
      const key = ~~article;
      const title = orderServices[article].name;
      return (
        <Ant.Select.Option key={key} value={value}>
          {title}
        </Ant.Select.Option>
      );
    });
  }, [availableArticles, orderServices]);

  const update = useCallback(
    (article) => {
      store.addArticle(article);
      workTime.set({[article]: 0})
    },
    [store, workTime],
  );

  return (
    <div className={'order-payment-add-service'}>
      <Ant.Select
        value={'Добавить услугу'}
        optionFilterProp={'children'}
        placeholder={'Добавить услугу'}
        size={'small'}
        showSearch={true}
        searchPlaceholder={'Название услуги'}
        onChange={update}
        style={{ width: 270 }}
        dropdownMatchSelectWidth={false}
      >
        {articleOptions}
      </Ant.Select>
    </div>
  );
}

OrderPaymentAddService.propTypes = {
  orderServices: PropTypes.object.isRequired,
};

export default observer(OrderPaymentAddService);
