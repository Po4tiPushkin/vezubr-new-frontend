import React, { useMemo } from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../../context';
import { TARIFF_DISTANCE_VALUES } from '../../../constants';

function getErrors(distanceData) {
  const errors = {};

  if (!distanceData?.distance) {
    errors.distance = true;
  }

  const hasError = Object.keys(errors).length > 0;

  return { errors, hasError };
}

function DistanceAddDropdownContent(props) {
  const { store } = React.useContext(TariffContext);
  const { confirm } = props;

  const [distanceData, setDistanceData] = React.useState({
    distance: null,
  });

  const distance = store.distanceData;

  const [distanceDataError, setDistanceDataError] = React.useState({});

  const onChange = React.useCallback(
    (value) => {
      const newDistanceData = { ...distanceData, distance: value };
      const { errors } = getErrors(newDistanceData);
      setDistanceData(newDistanceData);
      setDistanceDataError(errors);
    },
    [distanceData, distanceDataError],
  );

  const options = useMemo(() => {
    return TARIFF_DISTANCE_VALUES.map(el => (
      <Ant.Select.Option disabled={(distance || []).find(item => item.distance === el)} key={el} title={el} value={el}>
        {el}
      </Ant.Select.Option>
    ))
  }, [distance]);

  const add = React.useCallback(() => {
    const { errors, hasError } = getErrors(distanceData);

    if (hasError) {
      setDistanceDataError(errors);
      return;
    }

    const data = { ...distanceData };

    if (data.distance === null) {
      data.distance = 0;
    }

    const added = store.addDistance(data);

    if (added) {
      confirm();
      setDistanceData({ distance: null })
      return;
    }

    setDistanceDataError({
      distance: true
    });

    Ant.message.error('Уже есть');
  }, [confirm, distanceData]);

  return (
    <div className={'tariff-distance-add'}>
      <div className={'tariff-action-items-inline'}>
        <div className={cn({ 'has-error': distanceDataError?.distance })}>
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
          value={distanceData.distance}
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

export default observer(DistanceAddDropdownContent);
