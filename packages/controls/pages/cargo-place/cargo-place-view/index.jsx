import t from '@vezubr/common/localization';
import { observer } from 'mobx-react';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { createRouteWithParams, history, ROUTE_PARAMS, ROUTES } from '../../../infrastructure';

import { Ant, Page, showAlert, showConfirm, showError, WhiteBox } from '@vezubr/elements';
import Tabs from '../../../tabs';

import compose from '@vezubr/common/hoc/compose';
import useCancelableLoadData from '@vezubr/common/hooks/useCancelableLoadData';
import { Address as AddressService, CargoPlace as CargoPlaceService } from '@vezubr/services';
import { Route, Switch } from 'react-router';

import CargoPlaceStore from './store/CargoPlaceStore.js';

import { CargoContextView } from './context';

import CargoViewInfo from './components/cargo-view-info';
import CargoViewTitle from './components/cargo-view-title';

import { Characteristic, Departure, History, Nested } from './tabs';

import Utils from '@vezubr/common/common/utils';

const ROUTE_CARGO_PLACE_CHARACTERISTIC = createRouteWithParams(ROUTES.CARGO_PLACE, {
  [ROUTE_PARAMS.paramOptions]: 'characteristic',
});
const ROUTE_CARGO_PLACE_DEPARTURE = createRouteWithParams(ROUTES.CARGO_PLACE, {
  [ROUTE_PARAMS.paramOptions]: 'departure',
});
const ROUTE_CARGO_PLACE_NESTED = createRouteWithParams(ROUTES.CARGO_PLACE, { [ROUTE_PARAMS.paramOptions]: 'nested' });
const ROUTE_CARGO_PLACE_HISTORY = createRouteWithParams(ROUTES.CARGO_PLACE, { [ROUTE_PARAMS.paramOptions]: 'history' });
const UI_STATES = Utils.uiStatesClassNames;

const getTabs = (id, search) => {
  const props = {
    params: { [ROUTE_PARAMS.paramId]: id },
    linkParams: {
      search,
    },
  };

  return {
    attrs: {
      className: 'cargo-tabs',
    },
    items: [
      {
        title: 'Характеристики',
        route: ROUTE_CARGO_PLACE_CHARACTERISTIC,
        ...props,
        additionalRoutesMatch: [
          {
            route: ROUTES.CARGO_PLACE,
            ...props,
          },
        ],
      },
      {
        title: 'Отправления',
        route: ROUTE_CARGO_PLACE_DEPARTURE,
        ...props,
      },
      {
        title: 'Вложенные ГМ',
        route: ROUTE_CARGO_PLACE_NESTED,
        ...props,
      },
      {
        title: 'История',
        route: ROUTE_CARGO_PLACE_HISTORY,
        ...props,
      },
    ],
  };
};

const backUrlDefault = '/cargoPlaces';

const CLS = 'cargo-page-view';

const CargoPlaceView = (props) => {
  const { match } = props;
  const { location } = history;
  const addressesFormRef = React.useRef(null);
  const [addressesForm, setAddressesForm] = React.useState(null);

  const id = ~~match.params[ROUTE_PARAMS.paramId];
  const backUrl = useMemo(
    () => (history.location.state ? history.location?.state?.back?.pathname : backUrlDefault),
    [id],
  );
  const [cargoAddresses, setCargoAddresses] = useState([]);
  const dictionaries = useSelector((state) => state.dictionaries);
  const [mode, setMode] = useState('view');

  const deleteCargoPlace = useCallback(async () => {
    try {
      await CargoPlaceService.deleteCargoCard(id);
      showAlert({
        title: `Грузоместо удалено`,
        onOk: async () => {
          history.replace(backUrlDefault);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [id]);

  const onDelete = useCallback(async () => {
    showConfirm({
      title: `Вы точно хотите удалить ГМ № ${id}?`,
      onOk: async () => {
        deleteCargoPlace();
      },
    });
  }, [deleteCargoPlace]);

  const [store] = useState(() => new CargoPlaceStore());

  const context = useMemo(
    () => ({ store, cargoAddresses, id, onDelete, mode, setMode, addressesFormRef, addressesForm, setAddressesForm }),
    [cargoAddresses, store, id, onDelete, mode, setMode, addressesFormRef, addressesForm, setAddressesForm],
  );

  const fetchData = useCallback(async () => {
    store.setLoader(true);
    try {
      const response = await CargoPlaceService.info(id);
      const addresses = await AddressService.list({ itemsPerPage: 10000 });
      setCargoAddresses(addresses?.points);
      store.setDirtyData(response);
    } catch (e) {
      showError(e);
    } finally {
      store.setLoader(false);
      store.setLoaded(true);
    }

    return null;
  }, [id]);
  const [, loading] = useCancelableLoadData(fetchData);

  const uiStateName = React.useMemo(() => {
    const { cargoPlaceStatuses } = dictionaries;
    return t.order(`cargoPlaceStatuses.${cargoPlaceStatuses.find((item) => item.id == store?.data?.status)?.id}`) || '';
  }, [store?.data?.status]);

  const status = React.useMemo(
    () => ({
      type: UI_STATES[store.data.status || 0],
      name: uiStateName || '',
      address: store?.data?.statusAddress?.addressString,
    }),
    [store.data.status, store?.data?.statusAddress, uiStateName],
  );

  return (
    <CargoContextView.Provider value={context}>
      <div className={CLS}>
        <Page.Title
          onBack={() => history.replace(backUrl)}
          subtitle={
            store?.data?.id ? (
              <div className={'flexbox center'}>
                <span className={`circle status ${status.type || 'default'}`} />
                <span className={'status-title margin-left-6'}>
                  {status.name} / {status.address}
                </span>
              </div>
            ) : null
          }
        >
          <CargoViewTitle id={id} />
        </Page.Title>

        <Ant.Row type={'flex'} className={`${CLS}__layout`} gutter={16}>
          <Ant.Col span={8} className={`${CLS}__layout__first`}>
            {store.isLoaded ? (
              <CargoViewInfo />
            ) : (
              <WhiteBox>
                <Ant.Skeleton active={true} paragraph={{ rows: 10 }} />
              </WhiteBox>
            )}
          </Ant.Col>
          <Ant.Col span={16} className={`${CLS}__layout__second`}>
            <div className={`${CLS}__tabs`}>
              <Tabs {...getTabs(id, location.search)} />
            </div>

            <WhiteBox className={`${CLS}__body clearfix`}>
              {store.isLoaded ? (
                <Switch>
                  <Route {...ROUTE_CARGO_PLACE_CHARACTERISTIC} component={Characteristic}></Route>
                  <Route {...ROUTE_CARGO_PLACE_DEPARTURE} component={Departure}></Route>
                  <Route {...ROUTE_CARGO_PLACE_NESTED} component={Nested}></Route>
                  <Route {...ROUTE_CARGO_PLACE_HISTORY} component={History}></Route>
                  <Route {...ROUTES.CARGO_PLACE} component={Characteristic}>
                    {/* <AddressMain /> */}
                  </Route>
                </Switch>
              ) : (
                <Ant.Skeleton active={true} paragraph={{ rows: 10 }} />
              )}
            </WhiteBox>
          </Ant.Col>
        </Ant.Row>
      </div>
    </CargoContextView.Provider>
  );
};

export default compose([observer])(CargoPlaceView);
