import React, { useMemo } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../../context';

function getErrors(costData) {
  const errors = {};

  if (!costData?.cost) {
    errors.cost = true;
  }

  const hasError = Object.keys(errors).length > 0;

  return { errors, hasError };
}

function MileageBaseWorkAddDropdownContent(props) {
  const { store } = React.useContext(TariffContext);
  const { confirm } = props;

  const [costData, setCostData] = React.useState({
    cost: null,
  });

  const baseWork = store.baseWork;

  const [costDataError, setCostDataError] = React.useState({});

  const onChange = React.useCallback(
    (value) => {
      const newCostData = { ...costData, cost: value };
      const { errors } = getErrors(newCostData);
      setCostData(newCostData);
      setCostDataError(errors);
    },
    [costData, costDataError],
  );

  const add = React.useCallback(() => {
    const { errors, hasError } = getErrors(costData);

    if (hasError) {
      setCostDataError(errors);
      return;
    }

    const data = { ...costData };

    if (data.cost === null) {
      data.cost = 0;
    }

    const added = store.addBaseWork(data);

    if (added) {
      confirm();
      setCostData({ cost: null })
      return;
    }

    setCostDataError({
      cost: true
    });

    Ant.message.error('Уже есть');
  }, [confirm, costData]);

  return (
    <div className={'tariff-mileage-base-work-add'}>
      <div className={'tariff-action-items-inline'}>
        <div className={cn({ 'has-error': costDataError?.cost })}>
          <Ant.InputNumber
            placeholder={'Стоимость'}
            size={'small'}
            min={1}
            value={costData.cost}
            onChange={(value) => {
              onChange(value);
            }}
          />
        </div>

        <Ant.Button type={'primary'} size={'small'} onClick={add}>
          Добавить
        </Ant.Button>
      </div>
    </div>
  );
}

export default observer(MileageBaseWorkAddDropdownContent);
