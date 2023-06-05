import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { TariffContext } from '../../../context';
import { Ant } from '@vezubr/elements';

function TariffLoaderEditor(props) {
  const { loader } = props;

  const { store } = React.useContext(TariffContext);

  const { availableLoaderSpecialities } = store;


  const loaderOptions = React.useMemo(() => {
    return availableLoaderSpecialities.map(({ id, title }) => {
      return (
        <Ant.Select.Option key={id} value={id}>
          {title}
        </Ant.Select.Option>
      );
    });
  }, [availableLoaderSpecialities]);

  const update = React.useCallback(
    (speciality) => {
      loader.setSpeciality(speciality);
      loader.tariff.clearError('tariffScale');
      loader.tariff.addDefaultLoaderIfNeed();
    },
    [loader],
  );

  return (
    <div>
      {!store.isClone && <Ant.Select
        value={'Добавить специалиста'}
        optionFilterProp={'children'}
        placeholder={'Добавить специалиста'}
        size={'small'}
        onChange={update}
        style={{ width: 200 }}
      >
        {loaderOptions}
      </Ant.Select>}
    </div>
  );
}

export default observer(TariffLoaderEditor);
