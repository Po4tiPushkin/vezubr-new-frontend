const CONFIGS = {
  client: {
    host: 'https://client.cls24.ru/',
    apiVersion: 'v1',
  },
  producer: {
    host: 'https://contractor.cls24.ru/',
    apiVersion: 'v1',
  },
  geoCodingHost: 'https://geo.cls24.ru/',
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
