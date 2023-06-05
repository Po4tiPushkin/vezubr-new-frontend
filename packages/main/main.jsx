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
    const userToken = Cookies.get(`${window.APP}Token`);
    try {
      if (userToken) {
        Utils.setLocalStorageFromBackend()
        window.addEventListener('local-storage', async (e) => {
          throttle(async () => await Utils.sendLocalStorageToBackend(), 500)()
        })
        await Bootstrap.run(userToken);
        if (history.location.pathname === '/login' || history.location.pathname === '/') {
          history.push('monitor');
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
      history.push('/login');
    }
    document.getElementById('loader').style.display = 'none';
    setLoaded(true);
  }, [history]);

  useEffect(() => {
    startApp();
    document.addEventListener('input',(e) => {
      Utils.handleDateTimeInput(e)
    })
    return () => {
      document.removeEventListener('input',(e) => {
        Utils.handleDateTimeInput(e)
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
            {/*<Route path="/registerChoice" store={store} component={Pages.RegisterChoice} />*/}
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
            {loaded && (
              <DashboardLayout store={store} history={history}>
                <Switch>
                  <Route path="/orders" exact component={Pages.Orders} />
                  <Route {...ROUTES.ORDER} component={Pages.OrderView} />
                  <Route path="/changelog" component={Pages.Changelog} />
                  <Route path="/cargoPlaces" exact component={Pages.CargoPlaceList} />
                  <Route path="/addresses" exact component={Pages.Addresses} />
                  <Route {...ROUTES.ADDRESS_ADD} component={Pages.AddressesAdd} />
                  <Route {...ROUTES.ADDRESS} component={Pages.AddressCard} />

                  <Route path="/profile/:tab" component={Pages.Profile} />
                  <Route path="/new-order/from/:id/intercity" exact component={Pages.OrderAddFromIntercity} />
                  <Route path="/new-order/from/:id/city" exact component={Pages.OrderAddFromCity} />
                  <Route path="/new-order/from/:id/loader" exact component={Pages.OrderAddFromLoader} />

                  <Route path="/new-order/loader" exact component={Pages.OrderAddLoader} />
                  <Route path="/new-order/intercity" exact component={Pages.OrderAddIntercity} />
                  <Route path="/new-order/city" exact component={Pages.OrderAddCity} />

                  <Route path="/edit-order/:id/intercity" component={Pages.OrderEditIntercity} />
                  <Route path="/edit-order/:id/city" component={Pages.OrderEditCity} />
                  <Route path="/edit-order/:id/loader" component={Pages.OrderEditLoader} />

                  <Route path="/republish-order/:id" exact component={Pages.OrderRepublish} />

                  <Route path="/profile/agent/add" component={Pages.AddAgent} />

                  <Route path="/profile/contour/add" component={Pages.AddContour} />

                  <Route path="/profile" component={Pages.Profile} />
                  <Route path="/auctions" component={Pages.Auctions} />

                  <Route path="/check" component={Pages.Check} />
                  <Route {...ROUTES.CARGO_PLACE_ADD} component={Pages.CargoPlaceAdd} />
                  <Route {...ROUTES.CARGO_PLACE} component={Pages.CargoPlaceView} />

                  <Route {...ROUTES.MONITOR} component={Pages.Monitor} />

                  <Route path="/tariffs/add" exact component={Pages.TariffAdd} />
                  <Route path="/tariffs/:id(\d+)/clone" component={Pages.TariffClone} />
                  <Route path="/tariffs/:id(\d+)" exact component={Pages.TariffInfoEdit} />
                  <Route path="/tariffs" exact component={Pages.TariffList} />
                  <Route path="/tariffs/copy/:id" exact component={Pages.TariffCopy} />

                  <Route path="/deferred" component={Pages.DeferredOrders} />

                  <Route path="/new-order" component={Pages.NewOrder} />
                  <Route path="/edit-order" component={Pages.EditOrder} />

                  <Route path="/transports/create" component={Pages.TransportCreate} />
                  <Route path="/transports/:id/edit" component={Pages.TransportEdit} />
                  <Route path="/transports/:id" component={Pages.TransportView} />
                  <Route path="/transports" component={Pages.Transports} />

                  <Route path="/clients" component={Pages.Clients} />
                  <Route path="/producers" component={Pages.Producers} />

                  <Route path="/drivers/create" exact component={Pages.DriverCreate} />
                  <Route path="/drivers/:id/edit" component={Pages.DriverEdit} />
                  <Route {...ROUTES.DRIVER} component={Pages.DriverView} />
                  <Route path="/drivers" component={Pages.DriversList} />

                  <Route path="/tractors/create" component={Pages.TractorCreate} />
                  <Route path="/tractors/:id/edit" component={Pages.TractorEdit} />
                  <Route {...ROUTES.TRACTOR} component={Pages.TractorDetail} />
                  <Route path="/tractors" component={Pages.Tractors} />

                  <Route path="/contracts" component={Pages.Contracts} />
                  <Route path="/counterparties" component={Pages.CounterParties} />

                  <Route path="/registries/create" exact component={Pages.RegistriesCreate} />
                  <Route path="/registries/client/:id" component={Pages.RegistryClient} />
                  <Route path="/registries/client" exact component={Pages.RegistriesClient} />
                  <Route path="/registries/producer/:id" component={Pages.RegistryProducer} />
                  <Route path="/registries/producer" exact component={Pages.RegistriesProducer} />
                  <Route path="/registries" exact component={Pages.Registries} />
                  <Route path="/registries/create" component={Pages.RegistryCreate} />
                  <Route path="/registries/:id" component={Pages.RegistryDetail} />

                  <Route path="/documents" exact component={Pages.Documents} />

                  <Route path="/trailers/create" component={Pages.TrailerCreate} />
                  <Route path="/trailers/:id/edit" component={Pages.TrailerEdit} />
                  <Route path="/trailers/:id" component={Pages.Trailer} />
                  <Route path="/trailers" component={Pages.Trailers} />
                  <Route path="/loaders/create" exact component={Pages.LoaderCreate} />
                  <Route path="/loaders/:id/edit" component={Pages.LoaderEdit} />
                  <Route {...ROUTES.LOADER} component={Pages.LoaderProfile} />
                  <Route path="/loaders" component={Pages.LoadersList} />
                  <Route path="/404" exact component={Pages.NotFound} />
                  <Route path="/settings" component={Pages.Settings} />

                  <Route path="/agents" component={Pages.Agents} />
                  <Route path="/contours" component={Pages.Contours} />
                  <Route path="/agreement/:id" component={Pages.AgreementCard} />
                  <Route path="/contracts" component={Pages.Contracts} />
                  <Route path={'/contract/:id/edit'} component={Pages.ContractEdit} />
                  <Route exact path="/contract/:id/agreement/add" component={Pages.AddAgreement} />
                  <Route path="/contract/:id" component={Pages.Contract} />


                  <Route exact path={'/counterparty/:id/contract/add'} component={Pages.ContractAdd} />
                  <Route {...ROUTES.COUNTERPARTY} component={Pages.Counterparty} />

                  <Route exact path="/regular-order/new" component={Pages.RegularOrderCreate} />
                  <Route path="/regular-order/:id" component={Pages.RegularOrderEdit} />
                  <Route path="/regular-orders" component={Pages.RegularOrderList} />
                  <Route path="/rotator" component={Pages.Rotator} />
                  <Route path="/template-preview" component={Pages.TemplatePreview} />

                  <Route path="/insurers/:id/contracts/add" component={Pages.InsurerContractAdd} />
                  <Route path="/insurers/contracts/:id" component={Pages.InsurerContractInfo} />
                  <Route {...ROUTES.INSURER} component={Pages.InsurerCard} />
                  <Route path="/insurers" component={Pages.Insurers} />
                  
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

if (window.API_CONFIGS[window.APP].yandexMetric) {
  initYandexMetriс(window.API_CONFIGS[window.APP].yandexMetric);
}

ReactDOM.render(<App />, document.getElementById('main'));
