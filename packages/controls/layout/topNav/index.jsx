import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Logo, ButtonIconDeprecated, ButtonDeprecated, IconDeprecated, MenuDropDown } from '@vezubr/elements';
import { Profile, DelegateAction } from '@vezubr/components';
import Cookies from '@vezubr/common/common/cookies';
import { Orders as OrderService } from '@vezubr/services';
import * as actions from '../../infrastructure/actions';
import t from '@vezubr/common/localization';
import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
const TopNav = (props) => {
  const history = useHistory();
  const dispatch = useDispatch();
  const topNav = useSelector((state) => state.topNav);
  const routes = useSelector((state) => state.routes);
  const user = useSelector((state) => state.user);
  const sidebarState = useSelector((state) => state.sidebarState);
  const activeTab = useSelector((state) => state.activeTab);

  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  const [menuAlert, setMenuAlert] = useState(localStorage.getItem('menuAlert'));
  const [showTabs, setShowTabs] = useState({});

  useEffect(() => {
    history.listen((route) => {
      const routeName = route.pathname.split('/')[1];
      if (active !== routes[routeName]) {
        dispatch({ type: 'SET_ACTIVE_TAB', payload: routes[routeName] })
      }
    });
    setOpen((APP === 'producer' || APP === 'client') && localStorage.getItem('menuAlert') ? true : false)
  }, [])

  useEffect(() => {
    if (open !== sidebarState) {
      setOpen(sidebarState)
      setActive(activeTab)
    }
  }, [sidebarState, activeTab]);

  useEffect(() => {
    setActive(activeTab)
  }, [activeTab])

  const triggerNav = useCallback(() => {
    setOpen(!open);
    dispatch({ type: 'SET_NAV_STATE', sidebarState: !open });
  }, [open]);

  const navigateTo = useCallback((e, route) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch({ type: 'SET_ACTIVE_TAB', payload: route })
    window.scrollTo(0, 0);
    history.push(route.url);
  }, []);

  const onDropDownChange = useCallback((type, show) => {
    setShowTabs(prev => { return { ...prev, [type]: show } })
  }, []);

  const onMenuAlert = useCallback(() => {
    setOpen(false);
    setMenuAlert(false);
    localStorage.removeItem('menuAlert');
    dispatch({ type: 'SET_NAV_STATE', sidebarState: false })
  }, []);

  const goToOrder = useCallback(() => {

  }, [])

  const buttonClasses = useMemo(() => 'flexbox' + (APP === 'operator' ? ' size-1 justify-center' : ''), [])

  const renderTopNav = useMemo(() => {
    let topNavNew = [...topNav];
    if (topNavNew[0] !== 'newOrder' && APP !== 'producer' && APP !== 'operator') {
      topNavNew = ['newOrder', ...topNavNew].filter((el) => el);
    }
    return topNavNew.map((el, index) => {
      const route = routes[el];
      if (!route) {
        return null;
      }
      const s1 = route.url.split('/');
      const s2 = history.location.pathname.split('/');
      route.active = s1[1].includes(s2[1]) || route?.sub?.find(item => item.url == history.location.pathname) !== undefined;
      if (route.url === '/monitor/selection' && APP === 'operator') {
        route.url = '/monitor/my-problems';
      }
      return (
        <a
          href={route.url || ''}
          onClick={(e) => {
            if (route.sub) {
              e.preventDefault();
              onDropDownChange(route.url, !showTabs[route.url])
              return
            }
            navigateTo(e, route);
          }}
          className={`navs narrow light-bold ${route.active || route === active || (route?.sub?.find(item => item.url === activeTab.url) !== undefined) ? 'active' : ''}`}
          id={el}
          key={index}
        >
          <IconDeprecated name={route.icon} className={'no-events'} />
          <span className={'nav-title no-events'}>{route.name.toUpperCase()}</span>
          {/*{route.hasNotify ? <NotifyBadge className={'nav-notify'} type={'danger'}>
						<span>14</span>
					</NotifyBadge> : null}*/}
          {route.sub ? (
            <MenuDropDown
              options={{
                list: route.sub.filter((el) => el.access !== false).map(el => ({ ...el, id: `${el.id}-top` })),
                show: showTabs[route.url],
                arrowPosition: 'center',
              }}
              onClose={() => onDropDownChange(route.url, false)}
            />
          ) : null}
        </a>
      );
    }).filter(el => el);

  }, [topNav, routes, showTabs, active, activeTab])

  return (
    <header className={'top-nav flexbox'}>
      <div className={'flexbox top-nav__left padding-top-8 padding-bottom-8 left'}>
        <ButtonIconDeprecated
          default={true}
          onClick={triggerNav}
          className={'border narrow light-bold notBlocked top-nav__sidebar'}
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
            <ButtonDeprecated style={{ margin: 'auto' }} theme={'primary mid'} onClick={onMenuAlert}>
              {t.order('OK')}
            </ButtonDeprecated>
          </div>
        )}
      </div>
      <div className={'flexbox size-1 top-nav__center justify-right'}>
        <div className={`${buttonClasses} top-nav__center-wrapper`}>
          <div className={'nav-group'}>{renderTopNav}</div>
        </div>
      </div>
      <div className='flexbox top-nav__right'>
        {APP !== 'operator' && <Profile />}
      </div>
    </header>
  )
}

export default TopNav;