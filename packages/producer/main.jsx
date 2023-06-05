import React, { useEffect, useMemo, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Redirect, Route, Switch } from 'react-router';
import { DashboardLayout } from '@vezubr/controls/layout';
import * as Pages from './pages';
import Cookies from '@vezubr/common/common/cookies';
import { history, observer, ROUTES, store } from '@vezubr/controls/infrastructure';
import { User as UserService } from '@vezubr/services';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';
import { showAlert, showError } from "@vezubr/elements";
import Bootstrap from './bootstrap';
import { Utils } from '@vezubr/common/common';
import { setLocalStorageItem } from '@vezubr/common/common/utils';
import initYandexMetriс from '@vezubr/services/metrics/initYandexMetric';
import { RegisterView, LoginView, ForgotPassword } from '@vezubr/components';
import throttle from 'lodash/throttle'
const enterHost = window.API_CONFIGS.enterHost;
const App = () => {
  const [loaded, setLoaded] = useState(false);

  const joinContour = useCallback(async (contourCode) => {
    try {
      await UserService.joinContour(contourCode);
      showAlert({ content: 'Вы были успешно добавлены в контур' });
      Cookies.delete('contourCode');
    } catch (e) {
      console.error(e);
      showError(e);
      Cookies.delete('contourCode');
    }
  }, []);

  const startApp = useCallback(async () => {
    const userToken = Cookies.get('producerToken');
    try {
      if (userToken) {
        Utils.setLocalStorageFromBackend()
        window.addEventListener('local-storage', async (e) => {
          throttle(async () => await Utils.sendLocalStorageToBackend(), 500)()
        })
        await Bootstrap.run(userToken);
        if (history.location.pathname === '/login' || history.location.pathname === '/') {
          history.push('requests/active');
          if (Cookies.get('contourCode')) {
            await joinContour(Cookies.get('contourCode'));
          }
        }
      } else if (
        history.location.pathname !== '/login' &&
        history.location.pathname !== '/register' &&
        !history.location.pathname.includes('forgot-password')
      ) {
        localStorage.setItem('redirectUrl', history.location.pathname)
        history.push('/login');
      }
    } catch (e) {
      console.error(e);
      Utils.logout();
      localStorage.setItem('redirectUrl', history.location.pathname)
      history.push(`/login`);
    }
    document.getElementById('loader').style.display = 'none';
    setLoaded(true);
    window.addEventListener('beforeunload', () => {
      if (Cookies.get("delegatedApp") == APP) Utils.endDelegation();
    })
  }, [history]);

  useEffect(() => {
    startApp();
    document.addEventListener('input', (e) => {
      Utils.handleDateTimeInput(e)
    })
    return () => {
      document.removeEventListener('input', (e) => {
        Utils.handleDateTimeInput(e)
      })
      window.removeEventListener('beforeunload', () => {
        if (Cookies.get("delegatedApp") == APP) Utils.endDelegation();
      })
    }
  }, []);

  return (
    <ConfigProvider locale={ruRU}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" component={LoginView} />

            <Route path="/login" store={store} component={LoginView} />
            <Route path="/registration" store={store} component={RegisterView} />
            <Route path="/user/forgot-password/:token" store={store} component={ForgotPassword} />
            <Route
              path="/email-verification/:token"
              render={(location) => {
                const token = location.match.params.token;
                if (token) {
                  setLocalStorageItem('verificationToken', token);
                }
                return <Redirect to="/login" />;
              }}
            />
            <Route path="/forgot-password/email" exact component={ForgotPassword} />
            <Route path="/forgot-password/:token" exact component={ForgotPassword} />
            <Route path="/edm/:id" component={Pages.EdmOrder} />
            {loaded && (
              <DashboardLayout store={store} history={history}>
                <Switch>
                  <Route path="/tariffs/add" exact component={Pages.TariffAdd} />
                  <Route path="/tariffs/:id(\d+)" exact component={Pages.TariffInfoEdit} />
                  <Route path="/tariffs" exact component={Pages.TariffList} />
                  <Route path="/tariffs/copy/:id" exact component={Pages.TariffCopy} />
                  <Route path="/addresses" exact component={Pages.AddressList} />
                  <Route path="/cargoPlaces" exact component={Pages.CargoPlaceList} />

                  <Route {...ROUTES.ORDERS} component={Pages.Orders} />
                  <Route {...ROUTES.ORDER} component={Pages.Order} />
                  <Route {...ROUTES.MONITOR} component={Pages.Monitor} />
                  <Route path='/settings' component={Pages.Settings} />

                  <Route path="/profile" component={Pages.Profile} />

                  <Route path="/transports/create" component={Pages.TransportCreate} />
                  <Route path="/transports/:id/edit" component={Pages.TransportEdit} />
                  <Route path="/transports/:id" component={Pages.TransportView} />
                  <Route path="/transports" component={Pages.Transports} />

                  <Route path="/drivers/create" exact component={Pages.DriverCreate} />
                  <Route path="/drivers/:id/edit" component={Pages.DriverEdit} />
                  <Route {...ROUTES.DRIVER} component={Pages.DriverView} />
                  <Route path="/drivers" component={Pages.DriversList} />

                  <Route path="/loaders/create" exact component={Pages.LoaderCreate} />
                  <Route path="/loaders/:id/edit" component={Pages.LoaderEdit} />
                  <Route {...ROUTES.LOADER} component={Pages.LoaderProfile} />
                  <Route path="/loaders" component={Pages.LoadersList} />

                  <Route path="/auctions" component={Pages.Auctions} />

                  <Route path="/tractors/create" component={Pages.TractorCreate} />
                  <Route path="/tractors/:id/edit" component={Pages.TractorEdit} />
                  <Route path="/tractors/:id" component={Pages.TractorDetail} />
                  <Route path="/tractors" component={Pages.Tractors} />

                  <Route path="/registries" exact component={Pages.Registries} />
                  <Route path="/registries/create" component={Pages.RegistryCreate} />
                  <Route path="/registries/:id" component={Pages.RegistryDetail} />
                  <Route path="/documents" exact component={Pages.Documents} />

                  <Route path="/trailers/create" component={Pages.TrailerCreate} />
                  <Route path="/trailers/:id/edit" component={Pages.TrailerEdit} />
                  <Route path="/trailers/:id" component={Pages.Trailer} />
                  <Route path="/trailers" exact component={Pages.Trailers} />

                  <Route path="/clients" component={Pages.Clients} />
                  <Route path="/loaders" exact component={Pages.Loaders} />
                  <Route exact path={'/counterparty/create-child'} component={Pages.CounterpartyCreateChild} />
                  <Route exact path="/counterparty/:id/contract/add" component={Pages.ContractAdd} />
                  <Route path="/counterparty/:id" component={Pages.Counterparty} />
                  <Route path="/contracts" component={Pages.Contracts} />
                  <Route path="/contract/:id/edit" component={Pages.ContractEdit} />
                  <Route path={'/contract/:id/agreement/add'} component={Pages.AddAgreement} />
                  <Route path="/agreement/:id" component={Pages.AgreementCard} />
                  <Route path="/contract/:id" component={Pages.Contract} />
                  <Route path="/rotator" component={Pages.Rotator} />

                  <Route path="/insurers/:id/contracts/add" component={Pages.InsurerContractAdd} />
                  <Route path="/insurers/contracts/:id" component={Pages.InsurerContractInfo} />
                  <Route {...ROUTES.INSURER} component={Pages.InsurerCard} />
                  <Route path="/insurers" component={Pages.Insurers} />

                  <Route path="/documents-flow" component={Pages.DocumentsFlow} />

                  <Route path="/requests/all" component={Pages.Requests} />
                  <Route path="/requests/auction" component={Pages.RequestsAuction} />
                  <Route path="/requests/active" component={Pages.RequestsActive} />

                  <Route path="/404" exact component={Pages.NotFound} />
                  <Route component={Pages.NotFound} />
                </Switch>
              </DashboardLayout>
            )}
          </Switch>
        </ConnectedRouter>
      </Provider>
    </ConfigProvider>
  )
}

if (window.API_CONFIGS[APP].yandexMetric) {
  initYandexMetriс(window.API_CONFIGS[APP].yandexMetric);
}

ReactDOM.render(<App />, document.getElementById('main'));
