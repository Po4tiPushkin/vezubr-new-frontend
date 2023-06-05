const CONFIGS = {
  client: {
    host: 'https://api.vezubr.ru/',
    url: 'https://client.vezubr.ru/',
    apiVersion: 'v1',
    yandexMetric: 53289424,
  },
  producer: {
    host: 'https://api.vezubr.ru/',
    url: 'https://producer.vezubr.ru/',
    apiVersion: 'v1',
    yandexMetric: 53288695,
  },
  operator: {
    host: 'https://operator.vezubr.ru/',
    apiVersion: 'v1',
  },
  dispatcher: {
    host: 'https://api.vezubr.ru/',
    url: 'https://expeditor.vezubr.ru/',
    apiVersion: 'v1',
  },
  enter: {
    host: 'https://api.vezubr.ru/',
    url: 'https://enter.vezubr.ru/',
    apiVersion: 'v1',
  },
  geoCodingHost: 'https://geo.vezubr.ru/',
  centrifugoHost: 'wss://centrifugo.vezubr.ru/',
  enterHost: 'https://enter.vezubr.ru/',
  mapKeys: {
    sputnik: '<Ваш API-ключ>',
    google: 'AIzaSyCvBFqbvvf15FgJ5JkTUwPz5Qs_LVBDzTY',
  },
};

if (typeof window !== 'undefined') {
  window.API_CONFIGS = CONFIGS;
  if (window.LOCAL_APP) {
    window.APP = window.LOCAL_APP;
  }
  else {
    window.APP = window.location.hostname.split('.')[0];
    if (window.APP === 'expeditor') {
      window.APP === 'dispatcher';
    }
    if (window.APP === 'enter') {
      window.APP = 'client';
    }
  }
  if (localStorage.getItem('lastVersion') !== window.VERSION_TS) {
    window.open(window.location.href, '_self')
    localStorage.setItem('lastVersion', window.VERSION_TS)
  }
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIGS;
}
