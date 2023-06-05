import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Route, Switch, useParams } from 'react-router';
import { Page, WhiteBox, IconDeprecated, FilterButton } from '@vezubr/elements';
import Tabs from '@vezubr/controls/tabs';
import { createRouteWithParams, ROUTE_PARAMS, ROUTES } from '@vezubr/controls/infrastructure';
import { useSelector } from 'react-redux';
import { Contour as ContourService, Contragents, User as UserService } from '@vezubr/services/index.operator';
import { useHistory } from 'react-router-dom';
import Info from './forms/main-form';
import Service from './tabs/service';
import Users from './tabs/users';
import t from '@vezubr/common/localization';
import Cookies from '@vezubr/common/common/cookies';

import Utils from '@vezubr/common/common/utils';
const ROUTE_COUNTERPARTY_INFO = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'info' });
const ROUTE_COUNTERPARTY_SERVICE = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'service' });
const ROUTE_COUNTERPARTY_USERS = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'users' });

const getTabs = (id, type) => {
  const props = {
    params: { [ROUTE_PARAMS.paramId]: id },
  };

  return {
    attrs: {
      className: 'settings-tabs',
    },
    items: [
      {
        title: 'Общая информация',
        route: {...ROUTE_COUNTERPARTY_INFO, path: `/${type}${ROUTE_COUNTERPARTY_INFO.path}`},
        additionalRoutesMatch: [
          {
            route: {...ROUTES.COUNTERPARTY, path: `/${type}${ROUTES.COUNTERPARTY.path}`},
            ...props
          },
        ],
        ...props
      },
      {
        title: 'Служебное',
        route: {...ROUTE_COUNTERPARTY_SERVICE, path: `/${type}${ROUTE_COUNTERPARTY_SERVICE.path}`},
        ...props
      },
      {
        title: 'Пользователи',
        route: {...ROUTE_COUNTERPARTY_USERS, path: `/${type}${ROUTE_COUNTERPARTY_USERS.path}`},
        ...props
      },
    ],
  };
};

const Counterparty = (props) => {
  const { match } = props;
  const history = useHistory();
  const { location: historyLocation } = history;
  const type = useMemo(() => historyLocation.pathname.split('/')[1], []);
  const dictionaries = useSelector((state) => state.dictionaries);
  const { id } = useParams();
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);

  const [info, setInfo] = useState(null);

  const backUrl = useMemo(() =>
    history.location.state ?
      history.location?.state?.back?.pathname
      : `/${type}s}`
    ,
    [type])

  const goBack = () => {
    history.push(backUrl);
  };

  const tabsConfig = useMemo(() => getTabs(id, type), [id, type]);

  const fetchData = useCallback(async () => {
    try {
      if (type) {
        const response = (await Contragents[`${type}MainInfo`]({ [`${type}Id`]: id })).data?.[`${type}`];
        setInfo(response);
      }
    } catch (e) {
      console.error(e);
    }
  }, [id])

  const blockUnblockAllOrders = useCallback(async () => {
    const restriction = info?.restrictions === 3 ? 0 : 3;
    try {
      await Contragents[`block${Utils.toFirstLetterUpperCase(type)}Orders`]({
        [`${type}Id`]: id,
        restrictions: restriction,
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }

  }, [info])

  const loginCounterparty = useCallback(async () => {
    try {
      const { role } = info;
      const loginData = {
        password: localStorage.getItem('password'),
        contractorId: info.id,
      };
      const token = (await UserService.loginCounterparty(loginData)).data?.token;
      if (type === 'producer') {
        Cookies.set(role === 1 ? 'producerToken' : 'dispatcherToken', token);
        Cookies.set('contrAgent', role);
        window.open(location.href.replace(location.pathname, '/').replace(/(\/\/)\w+./, `$1${role === 1 ? 'producer' : 'expeditor'}.`), '_blank');
      }
      else if (type === 'client') {
        Cookies.set('clientToken', token);
        Cookies.set('contrAgent', 1);
        window.open(location.href.replace(location.pathname, '/').replace(/(\/\/)\w+./, '$1client.'), '_blank');
      }

    } catch (e) {
      console.error(e)
    }
  }, [info])

  useEffect(() => {
    fetchData();
  }, [type]);

  if (!info) {
    return null;
  };

  return (
    <div className={'сounterparty-page'}>
      <div className={"flexbox counterparty-page__title"}>
        <Page.Title onBack={() => goBack()}>
          ID: {id} / {info?.fullName}
        </Page.Title>
        <div>
          <FilterButton
            icon={'dotsBlue'}
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className={'circle box-shadow margin-left-12'}
            withMenu={true}
            menuOptions={{
              show: showFilterDropdown,
              arrowPosition: 'right',
              list: [
                {
                  title: !info?.restrictions ? t.buttons('Блокировать все рейсы') : t.buttons('Разблокировать все рейсы'),
                  icon: <IconDeprecated name={'xOrange'} />,
                  onAction: () => {
                    blockUnblockAllOrders();
                  },
                },
                {
                  title: t.buttons('Выполнить вход в ЛК контрагента'),
                  icon: <IconDeprecated name={'arbeitenOrange'} />,
                  onAction: () => {
                    loginCounterparty();
                  },
                },
              ],
            }}
          />
        </div>
      </div>
      <div className={'settings-page__tabs'}>
        <Tabs {...tabsConfig} />
      </div>
      <WhiteBox className={'counterparty-page__body clearfix'}>
        <Switch>
          <Route {...ROUTE_COUNTERPARTY_INFO} path={`/${type}${ROUTE_COUNTERPARTY_INFO.path}`}>
            <Info {...props} id={id} values={info} dictionaries={dictionaries} />
          </Route>
          <Route {...ROUTE_COUNTERPARTY_SERVICE} path={`/${type}${ROUTE_COUNTERPARTY_SERVICE.path}`}>
            <Service id={id} type={type} fetchData={fetchData} info={info} dictionaries={dictionaries} />
          </Route>
          <Route {...ROUTE_COUNTERPARTY_USERS} path={`/${type}${ROUTE_COUNTERPARTY_USERS.path}`}>
            <Users id={id} info={info} dictionaries={dictionaries} />
          </Route>
        </Switch>

      </WhiteBox>
    </div>
  );
}

export default Counterparty;
