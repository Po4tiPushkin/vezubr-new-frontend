import React, { useMemo } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../../context';

function getErrors(serviceData) {
  const errors = {};

  if (!serviceData?.article) {
    errors.article = true;
  }

  const hasError = Object.keys(errors).length > 0;

  return { errors, hasError };
}

function ServiceAddDropdownContent(props) {
  const { store } = React.useContext(TariffContext);
  const { confirm } = props;

  const [serviceData, setServiceData] = React.useState({
    article: null,
  });

  const service = store.serviceData;
  const additionalServices = store.additionalServices;
  const orderServices = store.orderServices;
  const [serviceDataError, setServiceDataError] = React.useState({});

  const onChange = React.useCallback(
    (value) => {
      const newDistanceData = { ...serviceData, article: value };
      const { errors } = getErrors(newDistanceData);
      setServiceData(newDistanceData);
      setServiceDataError(errors);
    },
    [serviceData, serviceDataError],
  );

  const options = useMemo(() => {
    return additionalServices.filter(item => orderServices[item]).map(el => {
      const { article, name } = orderServices[el];
      return (
        <Ant.Select.Option disabled={(service || []).find(item => item.article === +article)} key={+article} title={name} value={+article}>
          {name}
        </Ant.Select.Option>
      )
    })
  }, [service, additionalServices, orderServices]);

  const add = React.useCallback(() => {
    const { errors, hasError } = getErrors(serviceData);

    if (hasError) {
      setServiceDataError(errors);
      return;
    }

    const data = { ...serviceData };

    if (data.article === null) {
      return;
    }

    const added = store.addService(data);

    if (added) {
      confirm();
      setServiceData({ article: null })
      return;
    }

    setServiceDataError({
      article: true
    });

    Ant.message.error('Уже есть');
  }, [confirm, serviceData]);

  return (
    <div className={'tariff-service-add'}>
      <div className={'tariff-action-items-inline'}>
        <div className={cn({ 'has-error': serviceDataError?.article })}>
          {/* <Ant.InputNumber
            placeholder={'Расстояние'}
            size={'small'}
            min={1}
            value={distanceData.distance}
            onChange={(value) => {
              onChange(value);
            }}
          /> */}
          <Ant.Select
            value={serviceData.article}
            onChange={(value) => {
              onChange(value)
            }}
          >
            {options}
          </Ant.Select>
        </div>

        <Ant.Button type={'primary'} size={'small'} onClick={add}>
          Добавить
        </Ant.Button>
      </div>
    </div>
  );
}

export default observer(ServiceAddDropdownContent);
