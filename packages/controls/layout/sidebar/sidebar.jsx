import React, { Fragment } from 'react';
import autobind from 'autobind-decorator';
import t from '@vezubr/common/localization';
import { IconDeprecated } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as actions from '../../infrastructure/actions';
import PropTypes from 'prop-types';
import { Menu } from '@vezubr/elements/antd';

class Sidebar extends React.Component {
  state = {
    tabUrlActive: null,
  };

  getButtons() {
    const { routes, sidebarNav, location, user } = this.props;
    const canAccess = sidebarNav.filter((val) =>
      routes[val] && APP === 'producer'
        ? routes[val].access && routes[val].access.includes(user['function'])
        : routes[val],
    );

    return canAccess.map((val) => {
      const data = {};
      data.route = { ...routes[val] };
      const s1 = data.route.url.split('/');
      const s2 = location.pathname.split('/');

      if (val === 'contragents') {
        data.route.active =
          s2[1] === 'producers' ||
          s2[1] === 'clients' ||
          (s2[1] === 'profile' && (s2[2] === 'client' || s2[2] === 'producer'));
      } else if (val === 'directories') {
        data.route.active =
          s2[1] === 'drivers' ||
          s2[1] === 'contours' ||
          s2[1] === 'tariffs' ||
          s2[1] === 'trailers' ||
          s2[1] === 'tractors' ||
          s2[1] === 'agents' ||
          (s2[1] === 'profile' && ['driver', 'trailer', 'tractor', 'loader', 'agent', 'contour'].includes(s2[2]));
      } else if (val === 'producerProfile') {
        data.route.active = s1[1].includes(s2[1]) && s2[2] === 'account';
      } else {
        data.route.active = data.route.active = s1[1].includes(s2[1]);
      }

      data.subRoutes = data.route.sub;
      return data;
    });
  }

  navigateTo(route) {
    const { history } = this.context;
    if (!route.redirect) {
      this.props.actions.setActiveTab(route);
      window.scrollTo(0, 0);
      history.push(route.url);
    } else {
      window.open(route.url, '_blank').focus();
    }
  }

  async triggerMenu(route) {
    const { tabUrlActive: tabUrlActiveInput } = this.state;

    const tabUrlActive = route.url !== tabUrlActiveInput ? route.url : null;

    this.setState({
      tabUrlActive,
    });
  }

  @autobind
  async logout() {
    Utils.logout();
    await Utils.setDelay(200);
    location.href = window.API_CONFIGS.enter.url;
  }

  renderSupportSection() {
    return (
      <div className={'support-content'}>
        <span className={'support-text'}>{t.buttons('supportTel')}</span>
        <span className={'support-tel'}>+7 495 419 07 55</span>
      </div>
    );
  }

  renderSubmenu(val, key) {
    const itemsSubMenu = val.subRoutes.map((item, i) => {
      return (
        <Menu.Item
          className={'sidebar__dropdown-item'}
          key={`dropdownItem-${i}`}
          onClick={() => {
            this.triggerMenu(item);
            this.navigateTo(item);
          }}
        >
          {this.renderContentMenuItem(item, i)}
        </Menu.Item>
      );
    });

    return (
      <Menu.SubMenu
        key={key}
        title={
          <>
            {this.renderContentMenuItem(val.route)}
            <div className={'flexbox size-1 align-right justify-right'}>
              <IconDeprecated name={'chevronRightWhite'} className={'sidebar__icon no-events icon-xs'} />
            </div>
          </>
        }
      >
        {itemsSubMenu}
      </Menu.SubMenu>
    );
  }

  renderContentMenuItem(val, i) {
    return (
      <Fragment key={i}>
        <IconDeprecated name={val.icon} className={'sidebar__icon no-events icon-xs'} />
        <span className={'route-name no-events'}>{val.name || val.title}</span>
      </Fragment>
    );
  }

  render() {
    const { sidebarState: open } = this.props;
    const { tabUrlActive } = this.state;

    const classnameOpenMenu = open ? 'sidebar--open' : '';

    const buttons = this.getButtons().map((val, key) => {
      return val.subRoutes && val.subRoutes.length > 0 ? (
        this.renderSubmenu(val, key)
      ) : (
        <Menu.Item
          onClick={() => {
            this.triggerMenu(val.route);
            if (!val.subRoutes) {
              this.navigateTo(val.route);
            }
          }}
          className={`sidebar__list-item  ${val.route.active ? 'active' : ''}`}
          id={val}
          key={key}
        >
          {this.renderContentMenuItem(val.route)}
          <div className={'flexbox size-1 align-right justify-right'}>
            <IconDeprecated name={'chevronRightWhite'} className={'sidebar__icon no-events icon-xs'} />
          </div>
        </Menu.Item>
      );
    });
    return (
      <div className={`sidebar flexbox ${classnameOpenMenu}`}>
        <Menu className={'sidebar__list'}>{buttons}</Menu>
        <a onClick={this.logout} className={'sidebar__list-item sidebar__list-item--logout'}>
          <IconDeprecated name={'logoutOrange'} className={'sidebar__icon no-events icon-xs'} />
          <span className={'route-name'}>{t.common('logout')}</span>
        </a>
        {this.renderSupportSection()}
      </div>
    );
  }
}

Sidebar.contextTypes = {
  history: PropTypes.object,
};

const mapStateToProps = (state) => {
  const {
    dictionaries,
    routes,
    sidebarNav,
    sidebarState,
    user,
    router: { location },
  } = state;
  return { dictionaries, routes, sidebarNav, sidebarState, user, location };
};
const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({ ...actions.tabNotifications }, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Sidebar);
