import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import { Route, Switch, Redirect } from 'react-router';
import Cookies from '@vezubr/common/common/cookies';
import {store, history, observer, ROUTES} from '@vezubr/controls/infrastructure';
import { LoginView, RegisterView, ForgotPassword, ContourJoin } from '@vezubr/components';
import NotFound from '@vezubr/controls/pages/notFound';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale/ru_RU';

import Bootstrap from './bootstrap';
import { Utils } from '@vezubr/common/common';
import { setLocalStorageItem } from '@vezubr/common/common/utils';
import initYandexMetriс from '@vezubr/services/metrics/initYandexMetric';

class App extends React.Component {
  state = {
    loaded: false,
  };

  getChildContext() {
    return {
      store: store,
      history,
      routes: store.getState().routes,
      observer,
    };
  }

  //todo: refactor state loaders
  async componentWillMount() {
    const userToken = Cookies.get('enterToken');
    if (!userToken) {
      history.push('/login');
      document.getElementById('loader').style.display = 'none';
      this.setState({ loaded: true });
    }
    try {
      // if (userToken) {
      //   await Bootstrap.run(userToken);
      //   this.setState({ loaded: true });
      //   if (history.location.pathname === '/login' || history.location.pathname === '/') {
      //     history.push('/monitor');
      //   }
      // } else {
      //   document.getElementById('loader').style.display = 'none';
      //   this.setState({ loaded: true });
      //   // toLoginPage();
      // }
    } catch (e) {
      console.error(e);
      Utils.logout();
      history.push('/login');
    }
  }

  render() {
    const { loaded } = this.state;
    return (
      <ConfigProvider locale={ruRU}>
        <Provider store={store}>
          <ConnectedRouter history={history}>
            <Switch>
              <Route exact path="/" component={LoginView} />

              <Route path="/login" store={store} component={LoginView} />
              <Route path="/contour-join" store={store} component={Pages.ContourJoin} />
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
            </Switch>
          </ConnectedRouter>
        </Provider>
      </ConfigProvider>
    );
  }

  componentDidMount() {}
}

App.childContextTypes = {
  history: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired,
  routes: PropTypes.object.isRequired,
  observer: PropTypes.object.isRequired,
};

if (window.API_CONFIGS[APP].yandexMetric) {
  initYandexMetriс(window.API_CONFIGS[APP].yandexMetric);
}

ReactDOM.render(<App />, document.getElementById('main'));
