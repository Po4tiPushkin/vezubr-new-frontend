import React, { useEffect, useMemo, useState } from 'react';
import { Route, Switch, useParams } from 'react-router';
import { Page, WhiteBox } from '@vezubr/elements';
import Tabs from '../../tabs';
import { createRouteWithParams, ROUTE_PARAMS, ROUTES } from '../../infrastructure';
import { useSelector } from 'react-redux';

import { Contracts as ContractsService } from '@vezubr/services';
import { useHistory } from 'react-router-dom';
import Contracts from './tabs/contracts';
import Tariffs from './tabs/tariffs';
import CounterpartyInfo from '../../forms/producer-info-form';
import Service from './tabs/service';
import Settings from './tabs/settings';
import Extra from './tabs/additionalInfo';
const ROUTE_COUNTERPARTY_INFO = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'map' });
const ROUTE_COUNTERPARTY_CONTRACTS = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'contracts' });
const ROUTE_COUNTERPARTY_TARIFFS = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'tariffs' });
const ROUTE_COUNTERPARTY_SETTINGS = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'settings' });
const ROUTE_COUNTERPARTY_SERVICE = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'service' });
const ROUTE_COUNTERPARTY_EXTRA = createRouteWithParams(ROUTES.COUNTERPARTY, { [ROUTE_PARAMS.paramOptions]: 'extra' });

const getTabs = (id, info) => {
  const props = {
    params: { [ROUTE_PARAMS.paramId]: id },
  };

  return {
    attrs: {
      className: 'counterparty-tabs',
    },
    items: [
      {
        title: 'Общая информация',
        route: ROUTE_COUNTERPARTY_INFO,
        ...props
      },
      {
        title: 'Договоры',
        route: ROUTE_COUNTERPARTY_CONTRACTS,
        additionalRoutesMatch: [
          {
            route: ROUTES.COUNTERPARTY,
            ...props
          },
        ],
        ...props
      },
      {
        title: 'Тарифы',
        route: ROUTE_COUNTERPARTY_TARIFFS,
        ...props
      },
      {
        title: 'Настройки',
        route: ROUTE_COUNTERPARTY_SETTINGS,
        show: !info?.isPrivate || APP == "dispatcher" || info?.role == 4 || info.contours?.[0]?.isManager || info?.role == 2,
        ...props
      },
      {
        title: 'Служебное',
        route: ROUTE_COUNTERPARTY_SERVICE,
        ...props
      },
      {
        title: 'Доп. Информация',
        route: ROUTE_COUNTERPARTY_EXTRA,
        ...props
      }
    ],
  };
};

function Counterparty(props) {
  const history = useHistory();
  const { location } = history;
  const dictionaries = useSelector((state) => state.dictionaries);
  const { id } = useParams();

  const [info, setInfo] = useState({});

  const backUrl = useMemo(() =>
    history.location.state ?
      history.location?.state?.back?.pathname
      : `/${info.role == 2 ? 'clients' : 'producers'}`
    ,
    [info?.role])

  const goBack = () => {
    history.push(backUrl);
  };

  const tabsConfig = useMemo(() => getTabs(id, info), [id, info]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await ContractsService.getProfile(id) || {};
        setInfo({ id, ...response });
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className={'сounterparty-page'}>
      <Page.Title onBack={() => goBack()}>
        ID: {id} / {info.fullName}
      </Page.Title>
      <div className={'counterparty-page__tabs'}>
        <Tabs {...tabsConfig} adaptForMobile={535} />
      </div>
      <WhiteBox className={'counterparty-page__body clearfix'}>
        <Switch>
          <Route {...ROUTE_COUNTERPARTY_INFO}>
            <CounterpartyInfo {...props} id={id} data={info} dictionaries={dictionaries} />
          </Route>
          <Route {...ROUTE_COUNTERPARTY_TARIFFS}>
            <Tariffs {...props} contractorId={id} location={location} contractInfo={info} />
          </Route>
          <Route {...ROUTE_COUNTERPARTY_SETTINGS}>
            <Settings {...props} id={id} info={info} />
          </Route>
          <Route {...ROUTE_COUNTERPARTY_SERVICE}>
            <Service id={id} info={info} setInfo={setInfo} dictionaries={dictionaries} />
          </Route>
          <Route {...ROUTE_COUNTERPARTY_EXTRA}>
            <Extra {...props} setInfo={setInfo} info={info} id={id} />
          </Route>
          <Route {...ROUTES.COUNTERPARTY}>
            <Contracts {...props} info={info} isManager={info.contours ? info?.contours[0]?.isManager : null} id={id} />
          </Route>
        </Switch>
      </WhiteBox>
    </div>
  );
}

export default Counterparty;
