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
    const userToken = Cookies.get('clientToken');
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
      // Utils.logout();
      // localStorage.setItem('redirectUrl', history.location.pathname)
      // history.push(`${enterHost}/login`);
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
      window.removeEventListener('beforeunload', () => {
        if (Cookies.get("delegatedApp") == APP) Utils.endDelegation();
      })
      document.removeEventListener('input', (e) => {
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
            <Route path="/registration" store={store} component={RegisterView} />
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
                  <Route path="/addresses" exact component={Pages.Addresses} />
                  <Route path="/cargoPlaces" exact component={Pages.CargoPlaceList} />

                  <Route path="/new-order/from/:id/intercity" exact component={Pages.OrderAddFromIntercity} />
                  <Route path="/new-order/from/:id/city" exact component={Pages.OrderAddFromCity} />
                  <Route path="/new-order/from/:id/loader" exact component={Pages.OrderAddFromLoader} />

                  <Route path="/new-order/loader" exact component={Pages.OrderAddLoader} />
                  <Route path="/new-order/intercity" exact component={Pages.OrderAddIntercity} />
                  <Route path="/new-order/city" exact component={Pages.OrderAddCity} />

                  <Route path="/edit-order/:id/intercity" component={Pages.OrderEditIntercity} />
                  <Route path="/edit-order/:id/city" component={Pages.OrderEditCity} />
                  <Route path="/edit-order/:id/loader" component={Pages.OrderEditLoader} />

                  <Route path="/new-order/create-bind/:id/loader" component={Pages.OrderAddBindLoader} />
                  <Route path="/documents" exact component={Pages.Documents} />

                  <Route path="/deferred" component={Pages.DeferredOrders} />

                  <Route {...ROUTES.MONITOR} component={Pages.Monitor} />
                  <Route {...ROUTES.ORDER} component={Pages.OrderView} />
                  <Route {...ROUTES.ORDERS} component={Pages.Orders} />

                  <Route path="/registries" exact component={Pages.Registries} />
                  <Route path="/registries/:id" component={Pages.RegistryDetail} />
                  <Route path="/profile/:tab" component={Pages.Profile} />
                  <Route path="/contract/:id/edit" component={Pages.ContractEdit} />
                  <Route path={'/contract/:id/agreement/add'} component={Pages.AddAgreement} />
                  <Route path="/contract/:id" component={Pages.Contract} />
                  <Route path="/auctions" component={Pages.Auctions} />
                  <Route path='/settings' component={Pages.Settings} />

                  <Route path="/producers" component={Pages.Producers} />

                  <Route exact path={'/counterparty/:id/contract/add'} component={Pages.ContractAdd} />
                  <Route exact path={'/counterparty/create-child'} component={Pages.CounterpartyCreateChild} />
                  <Route {...ROUTES.COUNTERPARTY} component={Pages.Counterparty} />
                  <Route {...ROUTES.ADDRESS_ADD} component={Pages.AddressesAdd} />
                  <Route {...ROUTES.ADDRESS} component={Pages.AddressCard} />
                  <Route {...ROUTES.CARGO_PLACE_ADD} component={Pages.CargoPlaceAdd} />
                  <Route {...ROUTES.CARGO_PLACE} component={Pages.CargoPlaceView} />

                  <Route exact path="/regular-order/new" component={Pages.RegularOrderCreate} />
                  <Route path="/regular-order/:id" component={Pages.RegularOrderEdit} />
                  <Route path="/regular-orders" component={Pages.RegularOrderList} />
                  {/* <Route path="/cargoPlaces/add" exact component={Pages.CargoPlaceAdd} /> */}
                  <Route path="/rotator" component={Pages.Rotator} />
                  <Route path="/template-preview" component={Pages.TemplatePreview} />
                  <Route path="/agreement/:id" component={Pages.AgreementCard} />
                  <Route path="/insurers/:id/contracts/add" component={Pages.InsurerContractAdd} />
                  <Route path="/insurers/contracts/:id" component={Pages.InsurerContractInfo} />
                  <Route {...ROUTES.INSURER} component={Pages.InsurerCard} />
                  <Route path="/insurers" component={Pages.Insurers} />

                  <Route path="/requests/all" component={Pages.Requests} />
                  <Route path="/requests/auction" component={Pages.RequestsAuction} />
                  <Route path="/requests/active" component={Pages.RequestsActive} />

                  <Route path="/documents-flow" component={Pages.DocumentsFlow} />

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
