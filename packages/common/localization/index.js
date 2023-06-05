import List from './list';
import _ from 'lodash';

class T {
  static get currentLang() {
    return localStorage.getItem('language') || 'ru';
  }

  static reg(val) {
    return _.get(List.registration[T.currentLang], val);
  }

  static login(val) {
    return List.login[T.currentLang][val];
  }

  static nav(val) {
    return List.nav[T.currentLang][val] || val;
  }

  static order(val) {
    return _.get(List.order[T.currentLang], val) || val;
  }

  static cargo(val) {
    return _.get(List.cargo[T.currentLang], val) || val;
  }

  static driver(val) {
    return _.get(List.driver[T.currentLang], val) || val;
  }

  static loader(val) {
    return _.get(List.loader[T.currentLang], val) || val;
  }

  static trailer(val) {
    return _.get(List.trailer[T.currentLang], val);
  }

  static bills(val) {
    return _.get(List.bills[T.currentLang], val);
  }

  static buttons(val) {
    return List.buttons[T.currentLang][val] || val;
  }

  static error(val) {
    return List.errors[T.currentLang][val] || val;
  }

  static common(val) {
    return List.common[T.currentLang][val] || val;
  }

  static profile(val) {
    return _.get(List.profile[T.currentLang], val) || val;
  }

  static settings(val) {
    return _.get(List.settings[T.currentLang], val) || val;
  }

  static transports(val) {
    return _.get(List.transports[T.currentLang], val) || val;
  }

  static tractors(val) {
    return _.get(List.tractors[T.currentLang], val) || val;
  }
  static registries(val) {
    return _.get(List.registries[T.currentLang], val) || val;
  }

  static cartulary(val) {
    return _.get(List.cartulary[T.currentLang], val) || val;
  }

  static documents(val) {
    return _.get(List.documents[T.currentLang], val) || val;
  }

  static map(val) {
    return _.get(List.map[T.currentLang], val) || val;
  }

  static clients(val) {
    return _.get(List.clients[T.currentLang], val) || val;
  }

  static uiState(val) {
    return _.get(List.uiStates[T.currentLang], val);
  }

  static problems(val) {
    return _.get(List.problems[T.currentLang], val);
  }

  static address(val) {
    return _.get(List.address[T.currentLang], val);
  }

  static tariff(val) {
    return _.get(List.tariff[T.currentLang], val);
  }

  static get currency() {
    return { style: 'currency', currency: T.currentLang === 'ru' ? 'RUB' : 'USD' };
  }

  static get localizationFormat() {
    return T.currentLang === 'ru' ? 'ru-RU' : 'en-US';
  }

  static get calendarLocale() {
    return T.currentLang === 'ru' ? 'ru' : 'en';
  }
}

export default T;
