import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../../context';

function getErrors(baseWorkData) {
  const errors = {};

  for (const propKey of Object.keys(baseWorkData)) {
    const propValue = baseWorkData[propKey];
    if (!propValue) {
      if (propKey === 'hoursInnings') {
        continue;
      }
      errors[propKey] = true;
    }
  }

  const hasError = Object.keys(errors).length > 0;

  return { errors, hasError };
}

function BaseWorkAddDropdownContent(props) {
  const { store } = React.useContext(TariffContext);
  const { confirm, loader = false } = props;

  const [baseWorkData, setBaseWorkData] = React.useState({
    hoursWork: null,
    hoursInnings: null,
  });

  const [baseWorkDataError, setBaseWorkDataError] = React.useState({});

  const onChange = React.useCallback(
    (prop, value) => {
      const newBaseWorkData = { ...baseWorkData, [prop]: value };
      const { errors } = getErrors(newBaseWorkData);
      setBaseWorkData(newBaseWorkData);
      setBaseWorkDataError(errors);
    },
    [baseWorkData, baseWorkDataError],
  );

  const add = React.useCallback(() => {
    const { errors, hasError } = getErrors(baseWorkData);

    if (hasError) {
      setBaseWorkDataError(errors);
      return;
    }

    const data = { ...baseWorkData };

    if (data.hoursInnings === null) {
      data.hoursInnings = 0;
    }

    const added = store.addBaseWork(data);

    if (added) {
      confirm();
      return;
    }

    setBaseWorkDataError({
      hoursWork: true,
      hoursInnings: true,
    });

    Ant.message.error('Уже есть');
  }, [confirm, baseWorkData]);

  return (
    <div className={'tariff-base-work-add'}>
      <div className={'tariff-action-items-inline'}>
        <div className={cn({ 'has-error': baseWorkDataError?.hoursWork })}>
          <Ant.InputNumber
            placeholder={'Работа'}
            size={'small'}
            min={1}
            max={24}
            value={baseWorkData.hoursWork}
            onChange={(value) => {
              onChange('hoursWork', value);
            }}
          />
        </div>

        {!loader &&
          <div className={cn({ 'has-error': baseWorkDataError?.hoursInnings })}>
            <Ant.InputNumber
              size={'small'}
              min={0}
              max={5}
              placeholder={'Подача'}
              value={baseWorkData.hoursInnings}
              onChange={(value) => {
                onChange('hoursInnings', value);
              }}
            />
          </div>}

        <Ant.Button type={'primary'} size={'small'} onClick={add}>
          Добавить
        </Ant.Button>
      </div>
    </div>
  );
}

BaseWorkAddDropdownContent.propTypes = {
  confirm: PropTypes.func.isRequired,
};

export default observer(BaseWorkAddDropdownContent);
