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
    const userToken = Cookies.get('operatorToken');
    try {
      if (userToken) {
        Utils.setLocalStorageFromBackend()
        window.addEventListener('local-storage', async (e) => {
          throttle(async () => await Utils.sendLocalStorageToBackend(), 500)()
        })
        await Bootstrap.run(userToken);
        if (history.location.pathname === '/login' || history.location.pathname === '/') {
          history.push('clients');
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
      localStorage.setItem('redirectUrl', history.location.pathname)
      // Utils.logout();
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
    return () => {
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
                  <Route path="/contours/add" component={Pages.ContourAdd} />
                  <Route path="/contours/:id" component={Pages.ContourInfo} />
                  <Route path="/contours" component={Pages.Contours} />
                  <Route path="/transports/:id" component={Pages.TransportInfo} />
                  <Route path="/transports" component={Pages.Transports} />
                  <Route {...ROUTES.COUNTERPARTY} path={`/client${ROUTES.COUNTERPARTY.path}`} component={Pages.Counterparty} />
                  <Route {...ROUTES.COUNTERPARTY} path={`/producer${ROUTES.COUNTERPARTY.path}`} component={Pages.Counterparty} />
                  <Route path="/clients" exact component={Pages.Clients} />
                  <Route path="/producers" component={Pages.Producers} />
                  <Route {...ROUTES.DRIVER} component={Pages.DriverInfo} />
                  <Route path="/drivers" component={Pages.Drivers} />
                  <Route {...ROUTES.DRIVER} component={Pages.DriverInfo} />

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
