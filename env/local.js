const CONFIGS = {
  client: {
    host: 'https://api.vezubr.com/',
    url: 'https://client.vezubr.com/',
    apiVersion: 'v1',
  },
  producer: {
    host: 'https://api.vezubr.com/',
    url: 'https://producer.vezubr.com/',
    apiVersion: 'v1',
  },
  operator: {
    host: 'https://operator.vezubr.com/',
    url: 'https://operator.vezubr.com/',
    apiVersion: 'v1',
  },
  dispatcher: {
    host: 'https://api.vezubr.com/',
    url: 'https://expeditor.vezubr.com/',
    apiVersion: 'v1',
  },
  enter: {
    host: 'https://api.vezubr.com/',
    url: 'https://enter.vezubr.com/',
    apiVersion: 'v1',
  },
  geoCodingHost: 'https://geo.vezubr.com/',
  centrifugoHost: 'wss://centrifugo.vezubr.com/',
  mapKeys: {
    sputnik: '<Ваш API-ключ>',
    google: 'AIzaSyCvBFqbvvf15FgJ5JkTUwPz5Qs_LVBDzTY',
  },
};

if (typeof window !== 'undefined') {
  window.API_CONFIGS = CONFIGS;
  if (localStorage.getItem('lastVersion') !== window.VERSION_TS) {
    window.open(window.location.href, '_self')
    localStorage.setItem('lastVersion', window.VERSION_TS)
  }
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CONFIGS;
}
