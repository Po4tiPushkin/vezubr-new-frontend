import { Page, WhiteBox } from '@vezubr/elements';
import React from 'react';
import { Route, Switch } from 'react-router';
import { createRouteWithParams, history, ROUTES, ROUTE_PARAMS } from './../../infrastructure';
import Tabs from './../../tabs';

import SettingsNotification from './tabs/settings-notification';
import SettingsContour from './tabs/settings-contour';
import SettingsPersonal from './tabs/settings-personal';
import SettingsCompany from './tabs/settings-company';
import { CustomPropsAdd, CustomPropsList, CustomPropsEdit } from './tabs/settings-custom-properties';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import PropTypes from 'prop-types';

const ROUTE_SETTINGS_NOTIFICATION = createRouteWithParams(ROUTES.SETTINGS, {
  [ROUTE_PARAMS.paramOptions]: 'notification',
});
const ROUTE_SETTINGS_COMPANY = createRouteWithParams(ROUTES.SETTINGS, {
  [ROUTE_PARAMS.paramOptions]: 'company',
});
const ROUTE_SETTINGS_PERSONAL = createRouteWithParams(ROUTES.SETTINGS, {
  [ROUTE_PARAMS.paramOptions]: 'personal',
});
const ROUTE_SETTINGS_CONTOUR = createRouteWithParams(ROUTES.SETTINGS, {
  [ROUTE_PARAMS.paramOptions]: 'contour',
});
const ROUTE_SETTINGS_CUSTOM_PROPS = createRouteWithParams(ROUTES.SETTINGS, { [ROUTE_PARAMS.paramOptions]: 'custom-props' });
const ROUTE_SETTINGS_CUSTOM_PROPS_ADD = createRouteWithParams(ROUTES.SETTINGS, { [ROUTE_PARAMS.paramOptions]: 'custom-props/add' });
const ROUTE_SETTINGS_CUSTOM_PROPS_EDIT = createRouteWithParams(ROUTES.SETTINGS, { [ROUTE_PARAMS.paramOptions]: 'custom-props/edit/:id' });

const tabs = {
  attrs: {
    className: 'settings-tabs',
  },
  items: [
    {
      title: 'Персональные настройки',
      route: ROUTE_SETTINGS_PERSONAL,
      additionalRoutesMatch: [{ route: ROUTES.SETTINGS }],
    },
    {
      title: 'Настройки компании',
      route: ROUTE_SETTINGS_COMPANY,
    },
    {
      title: 'Настройки контура',
      route: ROUTE_SETTINGS_CONTOUR,
    },
    {
      title: 'Пользовательские поля',
      route: ROUTE_SETTINGS_CUSTOM_PROPS,
    },
    {
      title: 'Настройки уведомлений',
      route: ROUTE_SETTINGS_NOTIFICATION,
    },
  ],
};

function Settings(props) {
  const { location } = props;

  const goBack = useGoBack({ location, history, defaultUrl: '/monitor' });

  return (
    <div className={'settings-page'}>
      <Page.Title onBack={goBack}>Настройки</Page.Title>
      <div className={'settings-page__tabs'}>
        <Tabs {...tabs} adaptForMobile={650} />
      </div>
      <WhiteBox className={'settings-page__body clearfix'}>
        <Switch>
          <Route {...ROUTE_SETTINGS_NOTIFICATION} component={SettingsNotification} />
          <Route {...ROUTE_SETTINGS_PERSONAL} component={SettingsPersonal} />
          <Route {...ROUTE_SETTINGS_COMPANY} component={SettingsCompany} />
          <Route {...ROUTE_SETTINGS_CUSTOM_PROPS_EDIT} component={CustomPropsEdit} />
          <Route {...ROUTE_SETTINGS_CUSTOM_PROPS_ADD} component={CustomPropsAdd} />
          <Route {...ROUTE_SETTINGS_CUSTOM_PROPS} component={CustomPropsList} />
          <Route {...ROUTE_SETTINGS_CONTOUR} component={SettingsContour} />
        </Switch>
      </WhiteBox>
    </div>
  );
}

Settings.propTypes = {
  location: PropTypes.object,
};


export default Settings;
