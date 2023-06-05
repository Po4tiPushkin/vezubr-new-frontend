export const PATH_ANT_DEFAULT = {
  bg: {
    type: 'polyline',
    lineCap: 'round',
    weight: 5,
    opacity: 0.5,
  },
  ant: {
    type: 'polylineAnt',
    lineCap: 'round',
    weight: 5,
    dashArray: [1, 7],
    duration: 100,
    opacity: 1,
    paused: false,
    reverse: false,
    hardwareAcceleration: false,
  },
};

export const PATH_ANT_VERY_SLOW = {
  bg: {
    ...PATH_ANT_DEFAULT.bg,
    color: '#ce8386',
  },
  ant: {
    ...PATH_ANT_DEFAULT.ant,
    duration: 400,
    color: '#de003c',
  },
};

export const PATH_ANT_SLOW = {
  bg: {
    ...PATH_ANT_DEFAULT.bg,
    color: '#977999',
  },
  ant: {
    ...PATH_ANT_DEFAULT.ant,
    duration: 200,
    color: '#8e0094',
  },
};

export const PATH_ANT_MIDDLE = {
  bg: {
    ...PATH_ANT_DEFAULT.bg,

    color: '#a398bd',
    opacity: 0.8,
  },
  ant: {
    ...PATH_ANT_DEFAULT.ant,
    duration: 100,

    color: '#410dbc',
    opacity: 0.8,
  },
};

export const PATH_ANT_QUICKLY = {
  bg: {
    ...PATH_ANT_DEFAULT.bg,
    color: '#b7b7e2',
  },
  ant: {
    ...PATH_ANT_DEFAULT.ant,
    duration: 50,
    color: '#0406e4',
  },
};

export const POSITION_MOSCOW = {
  lat: 55.56436892371119,
  lng: 37.607634049755035,
};
