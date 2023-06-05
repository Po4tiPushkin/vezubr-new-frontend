const CONFIGS = {
  client: {
    host: 'https://api.vezubr.dev/',
    url: 'https://client.vezubr.dev/',
    apiVersion: 'v1',
  },
  producer: {
    host: 'https://api.vezubr.dev/',
    url: 'https://producer.vezubr.dev/',
    apiVersion: 'v1',
  },
  operator: {
    host: 'https://operator.vezubr.dev/',
    apiVersion: 'v1',
  },
  dispatcher: {
    host: 'https://api.vezubr.dev/',
    url: 'https://expeditor.vezubr.dev/',
    apiVersion: 'v1',
  },
  enter: {
    host: 'https://api.vezubr.dev/',
    url: 'https://enter.vezubr.dev/',
    apiVersion: 'v1',
  },
  geoCodingHost: 'https://geo.vezubr.dev/',
  centrifugoHost: 'wss://centrifugo.vezubr.dev/',
  enterHost: 'https://enter.vezubr.dev/',
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
