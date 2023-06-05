import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { TariffContext } from '../../context';
import { Ant, VzForm } from '@vezubr/elements';

function TariffTitle(props) {
  const { store } = React.useContext(TariffContext);
  const { title } = props;
  const update = React.useCallback((e) => {
    store.setTitle(e.target.value);
  }, []);

  return (
    <VzForm.Item label={'Название тарифа'} error={store.getError('title')}>
      <Ant.Input
        disabled={!store.editable}
        placeholder={title ? title : 'Название тарифа'}
        value={store.title}
        allowClear={true}
        onChange={update}
      />
    </VzForm.Item>
  );
}

export default observer(TariffTitle);
