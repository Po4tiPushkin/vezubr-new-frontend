import pathToRegexp from 'path-to-regexp';
import { matchPath } from 'react-router';
import { paramPage } from './route-params';
import * as ROUTES from './routes';
export * as ROUTE_PARAMS from './route-params';
export { ROUTES };

export function getSafePath(route, params, routerState) {
  const pathTo = pathToRegexp.compile(route.path);
  const tokens = pathToRegexp.parse(route.path);

  if (tokens.find((token) => token?.name === paramPage)) {
    if (typeof params[paramPage] === 'undefined') {
      if (routerState && routerState.match && routerState.match.params[paramPage]) {
        params = {
          ...params,
          [paramPage]: routerState.match.params[paramPage],
        };
      } else {
        return null;
      }
    }
  }

  return pathTo(params);
}

export function createRouteWithParams(route, params, routerState) {
  let path = route.path;

  for (const paramName of Object.keys(params)) {
    const paramValue = params[paramName];
    path = path.replace(new RegExp(`:${paramName}[^\/]*`, 'ig'), paramValue);
  }

  return {
    ...route,
    path,
  };
}

export function matchExistingRoute(path) {
  const parts = path.split('?');
  for (const key of Object.keys(ROUTES)) {
    const route = ROUTES[key];
    const match = matchPath(parts[0], route);
    if (match) return route;
  }
  return null;
}
