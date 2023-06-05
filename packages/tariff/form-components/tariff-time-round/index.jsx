import React from 'react';
import { observer } from 'mobx-react';
import { TariffContext } from '../../context';
import { Ant, VzForm } from '@vezubr/elements';

const ROUND_OPTIONS = [
  {
    title: 'До 1 минуты',
    id: 1
  },
  {
    title: 'До 15 минут',
    id: 15
  },
  {
    title: 'До 30 минут',
    id: 30
  },
  {
    title: 'До 1 часа',
    id: 60
  },
]

function TariffTimeRound() {
  const { store } = React.useContext(TariffContext);

  const regionOptions = React.useMemo(() => {
    return ROUND_OPTIONS.map(({id, title}) => {
      return (
        <Ant.Select.Option key={id} value={id}>
          {title}
        </Ant.Select.Option>
      );
    });
  }, []);

  const update = React.useCallback(
    (round) => {
      store.setRound(round);
    },
    [],
  );

  return (
    <VzForm.Item label={'Округление дополнительного времени работы'} error={store.getError('round')}>
      <Ant.Select
        disabled={!store.editable}
        value={store.roundMinutes}
        allowClear={false}
        showSearch={false}
        onChange={update}
      >
        {regionOptions}
      </Ant.Select>
    </VzForm.Item>
  );
}


export default observer(TariffTimeRound);

