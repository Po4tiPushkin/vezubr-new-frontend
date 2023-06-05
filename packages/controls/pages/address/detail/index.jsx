import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createRouteWithParams, ROUTE_PARAMS, ROUTES } from '../../../infrastructure';
import { Page, showAlert, showConfirm, showError, WhiteBox } from '@vezubr/elements';
import { Route, Switch, useHistory, useParams as useRouterParams } from 'react-router';
import { Address as AddressService } from '@vezubr/services';
import AddressContext from './context.jsx';
import { addressCounterContactErrors, addressCounterMainErrors, decorateAddress } from './utils';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import { Loader } from '@vezubr/elements';
import { AddressContacts, AddressSchedule, AddressMain, AddressHistory } from './tabs';
import { AddressTabBadge } from './elements';
import Tabs from '../../../tabs'
const backUrlDefault = '/addresses';

const ROUTE_ADDRESS_MAIN = createRouteWithParams(ROUTES.ADDRESS, { [ROUTE_PARAMS.paramOptions]: 'main' });
const ROUTE_ADDRESS_CONTACTS = createRouteWithParams(ROUTES.ADDRESS, { [ROUTE_PARAMS.paramOptions]: 'contacts' });
const ROUTE_ADDRESS_SCHEDULE = createRouteWithParams(ROUTES.ADDRESS, { [ROUTE_PARAMS.paramOptions]: 'schedule' });
const ROUTE_ADDRESS_HISTORY = createRouteWithParams(ROUTES.ADDRESS, { [ROUTE_PARAMS.paramOptions]: 'history' });

function getTabs(id) {
  const props = {
    params: { [ROUTE_PARAMS.paramId]: id },
  };

  return {
    attrs: {
      className: 'settings-tabs',
    },
    items: [
      {
        title: (
          <AddressTabBadge conditionBadge={addressCounterMainErrors} className={'red'}>
            Общая информация
          </AddressTabBadge>
        ),
        route: ROUTE_ADDRESS_MAIN,
        ...props,
        additionalRoutesMatch: [
          {
            route: ROUTES.ADDRESS,
            ...props,
          },
        ],
      },
      {
        title: (
          <AddressTabBadge conditionBadge={addressCounterContactErrors} className={'red'}>
            Контакты
          </AddressTabBadge>
        ),
        route: ROUTE_ADDRESS_CONTACTS,
        ...props,
      },
      {
        title: 'График приема/работы',
        route: ROUTE_ADDRESS_SCHEDULE,
        ...props,
      },
      {
        title: 'История',
        route: ROUTE_ADDRESS_HISTORY,
        ...props,
      },
    ],
  };
}

const AddressCard = () => {
  const { id } = useRouterParams();
  const [addressInfo, setAddressInfo] = useState({});
  const [addressLoading, setAddressLoading] = useState(true);
  const [mode, setMode] = useState('view');

  const history = useHistory();

  const commonCountError =
    addressCounterContactErrors({ addressContacts: addressInfo.contacts }) + addressCounterMainErrors({ addressInfo });

  const goBack = useGoBack({
    defaultUrl: backUrlDefault,
    location,
    history,
  });

  const load = useCallback(async () => {
    setAddressLoading(true);

    try {
      const response = await AddressService.info(id);
      const dataSource = decorateAddress(response);
      setAddressInfo(dataSource);
    } catch (e) {
      console.error(e);
      showError(e);
    }

    setAddressLoading(false);
  }, [id]);

  const reload = useCallback(() => {
    load();
  }, [id]);

  const deleteAddress = useCallback(async () => {
    try {
      await AddressService.delete(id);
      showAlert({
        title: `Адрес удален`,
        onOk: async () => {
          history.replace(backUrlDefault);
        },
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [id]);

  const handleDelete = useCallback(async () => {
    showConfirm({
      title: `Вы точно хотите удалить адрес?`,
      onOk: async () => {
        deleteAddress();
      },
    });
  }, [deleteAddress]);

  const context = useMemo(
    () => ({
      id,
      addressInfo,
      handleDelete,
      addressLoading,
      setAddressInfo,
      commonCountError,
      mode,
      reload,
      setMode,
    }),
    [id, handleDelete, addressInfo, addressLoading, setAddressInfo, commonCountError, mode, reload, setMode],
  );

  const tabsConfig = useMemo(() => getTabs(id), [id, context]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="address-page">
      <AddressContext.Provider value={context}>
        <Page.Title onBack={() => history.replace(backUrlDefault)}>ID: {id}</Page.Title>
        <div className={'address-page__tabs'}>
          <Tabs {...tabsConfig} />
        </div>
        <WhiteBox className={'address-page__body clearfix'}>
          <Switch>
            <Route {...ROUTE_ADDRESS_CONTACTS} component={AddressContacts} />
            <Route {...ROUTE_ADDRESS_SCHEDULE} component={AddressSchedule} />
            <Route {...ROUTE_ADDRESS_HISTORY} component={AddressHistory} />
            <Route {...ROUTES.ADDRESS} component={AddressMain} />
          </Switch>
          {addressLoading && <Loader />}
        </WhiteBox>
      </AddressContext.Provider>
    </div>
  );
};

export default AddressCard;
