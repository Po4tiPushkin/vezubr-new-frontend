import { paramId, paramOptions } from './route-params';

export const MONITOR = {
  exact: true,
  path: `/monitor/:${paramOptions}?`,
};

export const ORDERS = {
  exact: true,
  path: `/orders`,
};

export const ORDER = {
  exact: true,
  path: `/orders/:${paramId}/:${paramOptions}?`,
};

export const ORDERNEW = {
  exact: true,
  path: `/orders-new/:${paramId}/:${paramOptions}?`,
};

export const SETTINGS = {
  exact: true,
  path: `/settings/:${paramOptions}?`,
};

export const COUNTERPARTY = {
  exact: true,
  path: `/counterparty/:${paramId}/:${paramOptions}?`,
};

export const ADDRESS = {
  exact: true,
  path: `/addresses/:${paramId}/:${paramOptions}?`,
};

export const ADDRESS_ADD = {
  exact: true,
  path: `/addresses/add`,
};

export const CARGO_PLACE = {
  exact: true,
  path: `/cargoPlaces/:${paramId}/:${paramOptions}?`,
};

export const CARGO_PLACE_ADD = {
  exact: true,
  path: `/cargoPlaces/add/:${paramOptions}?`,
};

export const PROFILE = {
  exact: true,
  path: `/profile/:${paramOptions}`,
};

export const DRIVER = {
  exact: true,
  path: `/drivers/:${paramId}/:${paramOptions}?`,
};

export const LOADER = {
  exact: true,
  path: `/loaders/:${paramId}/:${paramOptions}?`,
};

export const TRANSPORTS = {
  exact: true,
  path: `/transports/:${paramId}/:${paramOptions}?`,
};

export const TRANSPORTSNEW = {
  exact: true,
  path: `/transports-new/:${paramId}/:${paramOptions}?`,
};

export const TRACTOR = {
  exact: true,
  path: `/tractors/:${paramId}/:${paramOptions}?`,
};

export const TRAILER = {
  exact: true,
  path: `/trailers/:${paramId}/:${paramOptions}?`,
};

export const TRAILERNEW = {
  exact: true,
  path: `/trailers-new/:${paramId}/:${paramOptions}?`,
};

export const INSURER = {
  exact: true,
  path: `/insurers/:${paramId}/:${paramOptions}?`
}
