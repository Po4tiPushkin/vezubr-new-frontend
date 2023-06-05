import React, { useCallback, useContext } from 'react';
import { observer } from 'mobx-react';

import { Ant, showError, VzTable, WhiteBox } from '@vezubr/elements';
import { CargoPlace as CargoPlaceService } from '@vezubr/services';
import { CargoContextView } from '../../context';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import useColumns from './useColumns';

function Departure(props) {
  const { match } = props;
  const id = match.params.id;
  const { store } = useContext(CargoContextView);

  const [columns, width] = useColumns();

  const fetchData = useCallback(async () => {
    store.setLoaderDispatch(true);
    try {
      const response = await CargoPlaceService.cargoDispatch(id);
      store.setDirtyDataDispatch(response);
    } catch (e) {
      showError(e);
    } finally {
      store.setLoaderDispatch(false);
      store.setLoadedDispatch(true);
    }

    return null;
  }, [id]);
  const [, loading] = useCancelableLoadData(fetchData);

  return (
    <div className={'cargo-view-tab-departure'}>
      {store.isLoaded ? (
        <VzTable.Table
          dataSource={store.dataDispatch}
          columns={columns}
          rowKey="orderId"
          scroll={{ x: width, y: 500 }}
        />
      ) : (
        <WhiteBox>
          <Ant.Skeleton active={true} paragraph={{ rows: 10 }} />
        </WhiteBox>
      )}
    </div>
  );
}

export default observer(Departure);
