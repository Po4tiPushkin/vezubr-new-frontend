import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { TariffContext } from '../../context';
import { Ant, VzForm } from '@vezubr/elements';

function TariffRegion(props) {
  const { territories, shortInfo } = props;
  const { store } = React.useContext(TariffContext);

  const regionOptions = React.useMemo(() => {
    return Object.keys(territories).map((regionIdString) => {
      const regionId = parseInt(regionIdString, 10);
      const value = regionId;
      const key = regionId;
      const title = territories[regionIdString]?.title;
      return (
        <Ant.Select.Option key={key} value={value}>
          {title}
        </Ant.Select.Option>
      );
    });
  }, [territories]);

  const update = React.useCallback(
    (regionId) => {
      store.setTerritoryId(regionId);
    },
    [territories],
  );

  return (
    <VzForm.Item label={'Регион действия'} error={store.getError('territoryId')} shortInfo={shortInfo}>
      <Ant.Select
        disabled={!store.editable}
        value={store.territoryId}
        allowClear={true}
        showSearch={true}
        optionFilterProp={'children'}
        searchPlaceholder={'Выберите регион'}
        onChange={update}
      >
        {regionOptions}
      </Ant.Select>
    </VzForm.Item>
  );
}

TariffRegion.propTypes = {
  territories: PropTypes.object.isRequired,
  shortInfo: VzForm.Item.propTypes.shortInfo,
};

export default observer(TariffRegion);
