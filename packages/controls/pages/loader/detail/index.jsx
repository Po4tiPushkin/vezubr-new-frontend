import React from 'react';
import _get from 'lodash/get';
import { Route, Switch } from "react-router";
import t from '@vezubr/common/localization';
import { Loaders as LoaderService } from '@vezubr/services/index';
import * as Extensions from './element';
import { ButtonDeprecated, showError, LoaderFullScreen } from '@vezubr/elements';
import { StatusNotification, } from '@vezubr/components';
import { useSelector } from 'react-redux';
import Utils from '@vezubr/common/common/utils';
import Tabs from '../../../tabs';
import { createRouteWithParams, ROUTES } from "../../../infrastructure/routing";
import { ROUTE_PARAMS } from "../../../infrastructure";
import { LoaderPersonalInfo, LoaderPassport } from './tabs'
import { useHistory } from 'react-router-dom';

const COMMON_UI_STATE_PARAMS = Utils.uiStateParams;

const ROUTE_PROFILE_PERSONAL = createRouteWithParams(ROUTES.LOADER, { [ROUTE_PARAMS.paramOptions]: 'personal' });
const ROUTE_PROFILE_PASSPORT = createRouteWithParams(ROUTES.LOADER, { [ROUTE_PARAMS.paramOptions]: 'passport' });
const ROUTE_PROFILE_HISTORY = createRouteWithParams(ROUTES.LOADER, { [ROUTE_PARAMS.paramOptions]: 'history' });
//todo move to configs (utils)
const nonEditableStates = [7];

function LoaderProfile(props) {
  const { match } = props;
  const user = useSelector(state => state.user);
  const history = useHistory();
  const loaderId = match.params.id;
  const goBack = () => {
    history.push('/loaders')
  }
  const [loading, setLoading] = React.useState(true)
  const [loader, setLoaderInfo] = React.useState({})

  const UI_STATE_PARAMS = {
    ...COMMON_UI_STATE_PARAMS,
    loader: {
      ...COMMON_UI_STATE_PARAMS.loader,
      4: {
        disableEdit: true,
        disableMenu: true,
      },
      5: {
        ...COMMON_UI_STATE_PARAMS.loader[5],
        action: maintainanceAction
      },
      3: {
        disableEdit: true,
        disableMenu: true,
      },
      7: {
        disableMenu: true,
      }
    },
  };

  const tabs = React.useMemo(() => {
    const props = {
      params: { [ROUTE_PARAMS.paramId]: match.params.id },
    };

    return {
      attrs: {
        className: 'loader-tabs'
      },
      items: [
        {
          title: t.driver('personalInfo'),
          route: ROUTE_PROFILE_PERSONAL,
          ...props,
          additionalRoutesMatch: [
            {
              route: ROUTES.LOADER,
              ...props,
            },
          ],
        },
        {
          title: t.driver('passport'),
          route: ROUTE_PROFILE_PASSPORT,
          ...props
        },
        {
          title: t.trailer('history'),
          route: ROUTE_PROFILE_HISTORY,
          disabled: true,
          ...props
        },
      ]
    }
  }, [match.params.id])

  const routes = React.useMemo(() => {
    return (
      <>
        <Route
          {...ROUTE_PROFILE_PASSPORT}
          render={() =>
            <LoaderPassport loader={loader} />
          }
        />
        <Route
          {...ROUTE_PROFILE_HISTORY}
          render={() => { }}
        />
        <Route
          {...ROUTES.LOADER}
          render={() =>
            <LoaderPersonalInfo loader={loader} />
          }
        />
      </>
    )
  }, [loader]);

  const reloadLoader = React.useCallback(async () => {
    await getLoaderInfo();
  }, [])

  React.useEffect(() => {
    (async () => {
      if (parseInt(loaderId) > 0) {
        await reloadLoader();
      } else {
        setLoading(false)
      }
    })()

  }, [loaderId])

  const getLoaderInfo = React.useCallback(async () => {
    setLoading(true)
    try {
      const response = await LoaderService.info(loaderId);
      setLoaderInfo(response)
    } catch (e) {
      showError(e)
    }
    setLoading(false)
  }, [])

  const showNotification = React.useCallback(() => {
    const Notify = UI_STATE_PARAMS.loader[loader?.uiState];
    const actions = Notify?.actions
      ? Notify.actions
      : [];
    if (loader.uiState === 6) {
      Notify.description = loader.checkComment;
      //actions[0].title = t.buttons('Проверить');
      //actions[0].method = () => this.goToCheck();
    }
    return (
      Notify &&
      (Notify?.title || Notify?.description) && (
        <StatusNotification
          className={'margin-top-12'}
          style={{
            width: '960px',
            margin: '0 auto',
          }}
          type={'default'}
          action={actions.length === 1 ? actions[0] : false}
          actions={actions.length >= 2 ? actions : []}
          title={Notify.title}
          color={Notify.color}
          description={Notify.description}
        />
      )
    );
  }, [loader?.uiState])


  const maintainanceAction = React.useCallback(async () => {
    await LoaderService.setSickState(loaderId, { sickState: !loader.onSickLeave });
    await reloadLoader();
  }, [loaderId, loader?.onSickLeave]);


  return (
    <div className={'other-profiles-view'}>
      {loading ? <LoaderFullScreen text={'Загрузка...'} /> : <></>}
      {loader ? (
        <>
          <Extensions.LoaderHeader goBack={goBack} loader={loader} reloadLoader={reloadLoader} maintainanceAction={maintainanceAction} />
          {showNotification()}
          <div className={'flexbox justify-center margin-top-16'} style={{ minHeight: '500px' }}>
            <Extensions.LoaderLeftSide loader={loader} reloadLoader={reloadLoader} setLoaderInfo={setLoaderInfo} />
            <div className={'margin-left-8'} style={{ width: '592px' }}>
              <Tabs {...tabs} />
              <div className={'profile-box margin-top-12 right'} style={{ minHeight: '552px' }}>
                <Switch>
                  <Route
                    {...ROUTE_PROFILE_PASSPORT}
                    render={() =>
                      <LoaderPassport loader={loader} />
                    }
                  />
                  <Route
                    {...ROUTE_PROFILE_HISTORY}
                    render={() => { }}
                  />
                  <Route
                    {...ROUTES.LOADER}
                    render={() =>
                      <LoaderPersonalInfo loader={loader} />
                    }
                  />
                </Switch>
                <div className={'flexbox justify-right  padding-16'}>
                  {(loader?.producer?.id === user?.id && nonEditableStates.indexOf(loader?.uiState) < 0) ? (
                    <ButtonDeprecated
                      className={'semi-wide'}
                      theme={'secondary'}
                      onClick={() => {
                        history.push(`/loaders/${loaderId}/edit`);
                      }}
                    >
                      {t.driver('editProfile')}
                    </ButtonDeprecated>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        null
      )}

    </div>
  )
}

export default LoaderProfile;

