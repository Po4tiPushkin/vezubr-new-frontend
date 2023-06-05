import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerMiddleware, connectRouter } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension';
import allReducers from './reducers';
import thunk from 'redux-thunk';
import observer from './observer/observer';
import * as OBSERVER_ACTIONS from './observer/actions';
import { ROUTES, getSafePath, navigateSafe, matchExistingRoute, createRouteWithParams } from './routing';
import * as ROUTE_PARAMS from './routing/route-params';
import { history } from './history';

const store = createStore(
  combineReducers({
    ...allReducers,
    router: connectRouter(history),
  }),
  // eslint-disable-next-line no-undef
  IS_DEV
    ? composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk))
    : applyMiddleware(routerMiddleware(history), thunk),
);

export {
  observer,
  OBSERVER_ACTIONS,
  store,
  history,
  ROUTE_PARAMS,
  ROUTES,
  getSafePath,
  navigateSafe,
  matchExistingRoute,
  createRouteWithParams,
};
