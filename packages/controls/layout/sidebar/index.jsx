import React, { useEffect, useCallback, useState, useMemo, Fragment } from 'react';
import t from '@vezubr/common/localization';
import { IconDeprecated } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
import { useSelector, useDispatch } from 'react-redux';
import { Menu } from '@vezubr/elements/antd';
import { useHistory } from 'react-router-dom';
import useWindowSize from '@vezubr/common/hooks/useWindowSize'
const SideBar = (props) => {
  const history = useHistory();
  const { location } = history;
  const dispatch = useDispatch();
  const routes = useSelector((state) => state.routes);
  const sidebarNav = useSelector((state) => state.sidebarNav);
  const user = useSelector((state) => state.user);
  const sidebarState = useSelector((state) => state.sidebarState);
  const [tabUrlActive, setTabUrlActive] = useState(null);
  const { width } = useWindowSize();
  const navigateTo = useCallback((route) => {
    if (!route.redirect) {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: route })
      if (width <= 428) {
        dispatch({ type: 'SET_NAV_STATE', sidebarState: false });
      }
      window.scrollTo(0, 0);
      history.push(route.url);
    }
    else {
      window.open(route.url, '_blank').focus();
    }
  }, [sidebarState]);

  const logout = useCallback(async () => {
    Utils.logout();
    await Utils.setDelay();
    window.location.href = window.API_CONFIGS.enter.url;
  }, [])

  const renderSupportSection = useMemo(() => (
    <div className={'support-content'}>
      <span className={'support-text'}>{t.buttons('supportTel')}</span>
      <span className={'support-tel'}>+7 495 419 07 55</span>
    </div>
  ), []);

  const triggerMenu = useCallback((route) => {
    setTabUrlActive(prev => route.url !== prev ? route.url : null)
  }, [tabUrlActive]); 

  const renderContentMenuItem = useCallback((val, i) => (
    <Fragment key={i}>
      <IconDeprecated name={val.icon} className={'sidebar__icon no-events icon-xs'} />
      <span className={'route-name no-events'}>{val.name || val.title}</span>
    </Fragment>
  ), [])

  const renderSubmenu = useCallback((val, key) => {
    const itemsSubMenu = val.subRoutes.map((el, index) => {
      if (el.show !== false) {
        return (
          <Menu.Item
          className={'sidebar__dropdown-item'}
          key={`dropdownItem-${index}`}
          id={`${el.id}-side`}
          onClick={() => {
            triggerMenu(el);
            navigateTo(el);
          }}
          >
            {renderContentMenuItem(el, index)}
          </Menu.Item>
        );
      }
    })

    return (
      <Menu.SubMenu
        key={key}
        title={
          <>
            {renderContentMenuItem(val.route)}
            <div className={'flexbox size-1 align-right justify-right'}>
              <IconDeprecated name={'chevronRightWhite'} className={'sidebar__icon no-events icon-xs'} />
            </div>
          </>
        }
      >
        {itemsSubMenu}
      </Menu.SubMenu>
    );
  }, []);

  const buttons = useMemo(() => {
    const canAccess = sidebarNav.filter((val) => routes[val])
    return canAccess.map(val => {
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
      data.id = `${val}-side`
      data.subRoutes = data.route.sub;
      return data;
    })
  }, [routes, sidebarNav, location, user])

  const renderButtons = useMemo(() => {
    return buttons.map((val, key) => {
      return val.subRoutes && val.subRoutes.length > 0 ? (
        renderSubmenu(val, key)
      ) : (
        <Menu.Item
          onClick={() => {
            triggerMenu(val.route);
            if (!val.subRoutes) {
              navigateTo(val.route);
            }
          }}
          className={`sidebar__list-item  ${val.route.active ? 'active' : ''}`}
          id={val.id}
          key={key}
        >
          {renderContentMenuItem(val.route)}
          <div className={'sidebar__list-pointer flexbox size-1 align-right justify-right'}>
            <IconDeprecated name={'chevronRightWhite'} className={'sidebar__icon no-events icon-xs'} />
          </div>
        </Menu.Item>
      );
    })
  }, [buttons]);

  const classnameOpenMenu = useMemo(() => sidebarState ? 'sidebar--open' : '', [sidebarState])

  return (
    <div className={`sidebar flexbox ${classnameOpenMenu}`}>
      <Menu mode={width > 428 ? 'vertical' : 'inline'} className={'sidebar__list'}>{renderButtons}</Menu>
      <a onClick={logout} className={'sidebar__list-item sidebar__list-item--logout'}>
        <IconDeprecated name={'logoutOrange'} className={'sidebar__icon no-events icon-xs'} />
        <span className={'route-name'}>{t.common('logout')}</span>
      </a>
      {renderSupportSection}
    </div>
  )
}

export default SideBar;