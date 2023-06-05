import React from 'react';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { Logo, ButtonIconDeprecated, ButtonDeprecated, IconDeprecated, MenuDropDown } from '@vezubr/elements';
import { Profile, DelegateAction } from '@vezubr/components';
import Cookies from '@vezubr/common/common/cookies';
import { Orders as OrderService } from '@vezubr/services';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as actions from '../../infrastructure/actions';
import t from '@vezubr/common/localization';

class TopNav extends React.Component {
  state = {
    open: false,
    active: null,
    menuAlert: localStorage.menuAlert,
  };

  componentWillMount() {
    this.props.history.listen((route) => {
      const routeName = route.pathname.split('/')[1];
      if (this.state.active !== this.props.routes[routeName]) {
        this.props.actions.setActiveTab(this.props.routes[routeName]);
      }
    });
    this.setState({ open: (APP === 'producer' || APP === 'client') && localStorage.menuAlert ? true : false });
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.open !== nextProps.sidebarState) {
      this.setState({ open: nextProps.sidebarState, active: nextProps.activeTab });
    }
  }

  @autobind
  sidebarStatus(open) {
    this.setState({ open: open });
  }

  @autobind
  triggerNav() {
    const { open } = this.state;
    const { store } = this.props;
    this.setState({ open: !open });
    store.dispatch({ type: 'SET_NAV_STATE', sidebarState: !open });
  }

  navigateTo(e, route) {
    e.preventDefault();
    e.stopPropagation();
    this.props.actions.setActiveTab(route);
    const { history } = this.props;
    window.scrollTo(0, 0);
    history.push(route.url);
  }

  @autobind
  onDropDownClose(type, data) {
    // if(this.state[type] === data.show) return;
    this.setState({
      [type]: data.show,
    });
  }

  @autobind
  async goToOrder() {
    const { observer } = this.context;
    const { history } = this.props;
    try {
      await OrderService.takeInAWork();
      history.push('/monitor/my-problems');
    } catch (e) {
      console.error(e);
      observer.emit('alert', {
        title: e.error_no === 410 ? t.common('Готово') : t.error('error'),
        message: e.error_no === 410 ? t.error('Проблемных рейсов больше нет') : t.error('Не смог взять в обработку'),
        cb: () => void 1,
      });
    }
  }

  @autobind
  menuAlert() {
    delete localStorage.menuAlert;
    const { store } = this.props;
    this.setState({ open: false, menuAlert: false });
    store.dispatch({ type: 'SET_NAV_STATE', sidebarState: false });
  }

  render() {
    const { open, menuAlert } = this.state;
    const { history, user, routes, topNav: oldNav = [] } = this.props;
    let topNav = [...oldNav];
    let topNavProducer;
    if (APP === 'producer') {
      topNavProducer = topNav.filter((key, val) => key && routes[key].access.includes(user['function'])) || [];
      if (user['function'] === 1) {
        topNavProducer[topNavProducer.indexOf('acts')] = 'drivers';
      }
    } else {
      if (topNav[0] !== 'newOrder') {
        topNav = ['newOrder', ...topNav].filter((el) => el);
      }
    }
    const buttons = (APP === 'producer' ? topNavProducer : topNav).map((val, key) => {
      const route = routes[val];
      const s1 = route.url.split('/');
      const s2 = history.location.pathname.split('/');
      route.active = s1[1].includes(s2[1]);
      if (route.url === '/monitor/selection' && APP === 'operator') {
        route.url = '/monitor/my-problems';
      }
      return (
        <a
          href={route.url || ''}
          onClick={(e) => {
            if (route.sub) {
              e.preventDefault();
              return this.setState({ [route.url]: !this.state[route.url] });
            }
            this.navigateTo(e, route);
          }}
          className={`navs narrow light-bold ${route.active || route === this.state.active ? 'active' : ''}`}
          id={val}
          key={key}
        >
          <IconDeprecated name={route.icon} className={'no-events'} />
          <span className={'nav-title no-events'}>{route.name.toUpperCase()}</span>
          {/*{route.hasNotify ? <NotifyBadge className={'nav-notify'} type={'danger'}>
						<span>14</span>
					</NotifyBadge> : null}*/}
          {route.sub ? (
            <MenuDropDown
              options={{
                list: route.sub.filter((el) => el.access !== false),
                show: this.state[route.url],
                arrowPosition: 'center',
              }}
              onClose={this.onDropDownClose.bind(this, route.url)}
            />
          ) : null}
        </a>
      );
    });
    const buttonClasses = 'flexbox' + (APP === 'operator' ? ' size-1 justify-center' : '');
    return (
      <header className={'top-nav flexbox'}>
        <div className={'flexbox padding-top-8 padding-bottom-8 left'}>
          <ButtonIconDeprecated
            default={true}
            onClick={this.triggerNav}
            className={'border narrow light-bold notBlocked'}
            svgIcon={open ? 'xOrange' : 'menuHamburgerOrange'}
          />
          <Logo className={'general'} user={user} />
          {(APP === 'producer' || APP === 'client') && Cookies.get('contrAgent') && (
            <div
              class="bold padding-top-11 flicker"
              style={{
                flex: 1,
                textAlign: 'center',
                color: 'red',
              }}
            >
              ЛК КОНТРАГЕНТА
            </div>
          )}
          {(APP === 'producer' || APP === 'client') && menuAlert && (
            <div className="menu-alert">
              <div className={'title'}>Боковое меню</div>
              <div className={'descr'}>
                В этом меню находится полный список разделов
                <br />
                личного кабинета.
                <br />
                Закрыть меню можете, нажав на иконку "Крестик",
                <br />
                Открыть, на иконку "Бургер".
              </div>
              <ButtonDeprecated style={{ margin: 'auto' }} theme={'primary mid'} onClick={this.menuAlert}>
                {t.order('OK')}
              </ButtonDeprecated>
            </div>
          )}
        </div>
        <div className={'flexbox size-1 justify-right'}>
          <div className={buttonClasses}>
            <div className={'nav-group'}>{buttons}</div>
          </div>
          {APP === 'operator' ? (
            <div className={'flexbox center'}>
              <ButtonDeprecated theme={'primary'} onClick={this.goToOrder}>
                {t.order('nextOrder')}
              </ButtonDeprecated>
            </div>
          ) : (
            <Profile />
          )}
        </div>
      </header>
    );
  }
}

TopNav.contextTypes = {
  observer: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { dictionaries, routes, topNav, sidebarState, activeTab, user, contractor } = state;
  return { dictionaries, routes, topNav, sidebarState, activeTab, user, contractor };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...actions.tabNotifications }, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(TopNav);
