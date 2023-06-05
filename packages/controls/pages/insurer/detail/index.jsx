import React, { useState, useEffect, useMemo, useCallback } from 'react';
import t from '@vezubr/common/localization';
import { IconDeprecated, showError } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import { Route, Switch } from "react-router";
import Tabs from '../../../tabs';
import { Main, Contracts, Orders } from './tabs';
import { createRouteWithParams, ROUTES, ROUTE_PARAMS } from "../../../infrastructure";
import { useHistory } from 'react-router-dom';
import { Insurers as InsurersService } from '@vezubr/services';
const ROUTE_INSURER_MAIN = createRouteWithParams(ROUTES.INSURER, { [ROUTE_PARAMS.paramOptions]: 'main' });
const ROUTE_INSURER_CONTRACTS = createRouteWithParams(ROUTES.INSURER, { [ROUTE_PARAMS.paramOptions]: 'contracts' });
const ROUTE_INSURER_ORDERS = createRouteWithParams(ROUTES.INSURER, { [ROUTE_PARAMS.paramOptions]: 'orders' })

function InsurerInfo(props) {
  const { match } = props;
  const history = useHistory();
  const id = match.params.id;
  const { location } = history;
  const backUrl = useMemo(() => location.state ? location?.state?.back?.pathname : '/insurers', [])
  const goBack = () => {
    history.push(backUrl);
  };
  const [company, setCompany] = useState(null);

  const fetchCompany = useCallback(async () => {
    try {
      const response = await InsurersService.info(id);
      setCompany(response);
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, []);

  useEffect(() => {
    fetchCompany();
  }, [])

  const tabs = useMemo(() => {
    const props = {
      params: { [ROUTE_PARAMS.paramId]: id },
    };
    return {
      attrs: {
        className: 'insurer-tabs',
      },
      items: [
        {
          title: t.profile('generalInfo'),
          route: ROUTE_INSURER_MAIN,
          ...props,
          additionalRoutesMatch: [
            {
              route: ROUTES.INSURER,
              ...props,
            },
          ],
        },
        {
          title: 'Договоры',
          route: ROUTE_INSURER_CONTRACTS,
          ...props
        },
        {
          title: 'Застрахованные рейсы',
          route: ROUTE_INSURER_ORDERS,
          ...props
        },
      ],
    };
  }, []);

  const routes = useMemo(() => {
    return (
      <Switch>
        <Route
          {...ROUTE_INSURER_CONTRACTS}
          render={(props) =>
            <Contracts
              {...props}
              company={company}
              id={id}
            />
          }
        />
        <Route
          {...ROUTE_INSURER_ORDERS}
          render={(props) =>
            <Orders
              {...props}
              company={company}
              id={id}
            />
          }
        />
        <Route
          {...ROUTES.INSURER}
          render={(props) =>
            <Main
              {...props}
              company={company}
            />
          }
        />
      </Switch>
    )
  }, [company]);

  return (
    <div className={'insurer-view'}>
      <div className={'insurer-title-block flexbox align-center'}>
        <IconDeprecated className={'back-action'} name={'backArrowOrange'} onClick={() => goBack()} />
        <h2 className={'bold'}>{company?.title}</h2>
      </div>
      <div className={'flexbox center column'}>
        <div className={'insurer-view__tabs-wrp'}>
          <Tabs {...tabs} adaptForMobile={370} />
        </div>
        <div className={'white-container flexbox margin-top-12 margin-bottom-20'}>
          {routes}
        </div>
      </div>
    </div>
  )
}

export default InsurerInfo;