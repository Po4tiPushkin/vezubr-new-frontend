import React, { useState, useCallback, useMemo, useEffect } from 'react';
import moment from 'moment';
import _get from 'lodash/get';
import { Route, Switch } from 'react-router';
import t from '@vezubr/common/localization';
import { Drivers as DriverService } from '@vezubr/services/index';
import * as Extensions from './element';
import {
  ButtonDeprecated,
  IconDeprecated,
  FilterButton,
  showError,
  showConfirm,
  showAlert,
  LoaderFullScreen,
} from '@vezubr/elements';
import {
  AssignTransportNew,
  ModalDeprecated,
  StatusNotificationNew,
  InputField,
  OrderSidebarInfos,
} from '@vezubr/components';
import Utils from '@vezubr/common/common/utils';
import { Tabs } from '../../../index';
import { createRouteWithParams, ROUTES } from '../../../infrastructure/routing';
import { ROUTE_PARAMS, history } from '../../../infrastructure';
import { DriverPersonalInfo, DriverPassport, DriverLicense } from './tabs';
import './index.scss';
import { useSelector } from 'react-redux';
const UI_STATES = Utils.uiStatesClassNames;
const COMMON_UI_STATE_PARAMS = Utils.uiStateParams;

const ROUTE_PROFILE_PERSONAL = createRouteWithParams(ROUTES.DRIVER, { [ROUTE_PARAMS.paramOptions]: 'personal' });
const ROUTE_PROFILE_PASSPORT = createRouteWithParams(ROUTES.DRIVER, { [ROUTE_PARAMS.paramOptions]: 'passport' });
const ROUTE_PROFILE_LICENSE = createRouteWithParams(ROUTES.DRIVER, { [ROUTE_PARAMS.paramOptions]: 'license' });
const ROUTE_PROFILE_HISTORY = createRouteWithParams(ROUTES.DRIVER, { [ROUTE_PARAMS.paramOptions]: 'history' });
//todo move to configs (utils)
const nonEditableStates = [7];

function DriverProfile(props) {
  const { match } = props;
  const user = useSelector((state) => state.user);
  const driverId = match.params.id;
  const backUrl = useMemo(() => history.location.state ? history.location?.state?.back?.pathname : '/drivers', [])
  const goBack = () => {
    history.push(backUrl);
  };

  const [loading, setLoading] = useState(true);
  const [{ driver, linkedVehicles }, setDriverInfo] = useState({});
  const { driverLicenseExpired, driverLicenseWillExpire } = useMemo(() => {
    return {
      driverLicenseExpired: moment(driver?.driverLicenseExpiresAtDate).isBefore(moment().subtract(1, 'd')),
      driverLicenseWillExpire: moment().add(1, 'w').isAfter(moment(driver?.driverLicenseExpiresAtDate)),
    };
  }, [driver]);

  const [neverDelegate, setNeverDelegate] = useState(driver?.neverDelegate);
  const [canWorkAsLoader, setCanWorkAsLoader] = useState(driver?.canWorkAsLoader);
  const [assignTransportVisible, setAssignTransportVisible] = useState(false);

  const UI_STATE_PARAMS = {
    ...COMMON_UI_STATE_PARAMS,
    driver: {
      ...COMMON_UI_STATE_PARAMS.driver,
      4: {
        disableEdit: true,
        disableMenu: true,
      },
      'work_suspended': {
        ...COMMON_UI_STATE_PARAMS.driver['work_suspended'],
        action: maintainanceAction,
      },
      3: {
        disableEdit: true,
        disableMenu: true,
      },
      7: {
        disableMenu: true,
      },
    },
  };

  const onSelectTransport = useCallback(
    async (transports) => {
      try {
        const vehicles = transports.map((t) => String(t.id));
        const linkedVehicles = transports;
        await DriverService.setLinkedVehicles({ id: driverId, vehicles });
        await closeAssignTransport();
        await reloadDriver();
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [reloadDriver],
  );

  const tabs = useMemo(() => {
    const props = {
      params: { [ROUTE_PARAMS.paramId]: match.params.id },
    };

    return {
      attrs: {
        className: 'driver-tabs',
      },
      items: [
        {
          title: t.driver('personalInfo'),
          route: ROUTE_PROFILE_PERSONAL,
          ...props,
          additionalRoutesMatch: [
            {
              route: ROUTES.DRIVER,
              ...props,
            },
          ],
        },
        {
          title: t.driver('passport'),
          route: ROUTE_PROFILE_PASSPORT,
          ...props,
        },
        {
          title: t.driver('vu'),
          route: ROUTE_PROFILE_LICENSE,
          className: driverLicenseExpired ? 'driver__tabs--red' : driverLicenseWillExpire ? 'driver__tabs--orange' : '',
          ...props,
        },
        {
          title: t.trailer('history'),
          route: ROUTE_PROFILE_HISTORY,
          disabled: true,
          ...props,
        },
      ],
    };
  }, [match.params.id, driverLicenseExpired, driverLicenseWillExpire]);

  const routes = useMemo(() => {
    return (
      <Switch>
        <Route {...ROUTE_PROFILE_PASSPORT} render={() => <DriverPassport driver={driver} />} />
        <Route {...ROUTE_PROFILE_LICENSE} render={() => <DriverLicense driver={driver} />} />
        <Route {...ROUTE_PROFILE_HISTORY} render={() => { }} />
        <Route {...ROUTES.DRIVER} render={() => <DriverPersonalInfo driver={driver} />} />
      </Switch>
    );
  }, [driver]);

  const reloadDriver = useCallback(async () => {
    await getDriverInfo();
  }, []);

  useEffect(() => {
    (async () => {
      if (parseInt(driverId) > 0) {
        await reloadDriver();
      } else {
        setLoading(false);
      }
    })();
  }, [driverId]);

  const getDriverInfo = useCallback(async () => {
    setLoading(true);
    if (APP === 'operator') {
      const response = await DriverService.info({ driverId: +driverId });
      setDriverInfo({
        driver: response.data.driver,
        linkedVehicles: response.data.linkedVehicles,
      })
      return;
    }
    const response = await DriverService.info(driverId);
    setDriverInfo({
      driver: response?.driver,
      linkedVehicles: response?.linkedVehicles,
    });
    setLoading(false);
  }, []);

  const openAssignTransport = useCallback(() => {
    setAssignTransportVisible(true);
  }, [setAssignTransportVisible]);

  const closeAssignTransport = useCallback(async () => {
    await setAssignTransportVisible(false);
  }, [setAssignTransportVisible]);

  const unsetTransport = useCallback(async (index, transports) => {
    transports.splice(index, 1);
    await onSelectTransport(transports);
  });

  const handleTogglesChange = useCallback(
    async (type, val) => {
      if (driver?.uiState === 7) {
        return;
      }
      try {
        if (type === 'canWorkAsLoader') {
          await DriverService.canWorkAsLoader({ id: driverId, canWorkAsLoader: val });
          setCanWorkAsLoader(val);
        }

        if (type === 'neverDelegate') {
          await DriverService.neverDelegate({ id: driverId, neverDelegateState: val });
          setNeverDelegate(val);
        }
        await reloadDriver();
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [driver],
  );

  const showNotification = useCallback(() => {
    const Notify = UI_STATE_PARAMS.driver[driver?.uiState];
    const actions = Notify?.actions ? Notify.actions : [];
    if (driver.uiState === 6) {
      Notify.description = driver.checkComment;
      //actions[0].title = t.buttons('Проверить');
      //actions[0].method = () => this.goToCheck();
    }
    return (
      Notify &&
      (Notify?.title || Notify?.description) && (
        <StatusNotificationNew
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
  }, [driver?.uiState]);

  const maintainanceAction = useCallback(async () => {
    try {
      await DriverService.setSickState(driverId, { sickState: !driver.onSickLeave });
      await reloadDriver();
    } catch (e) {
      showError(e);
    }

  }, [driverId, driver?.onSickLeave]);

  const logoutDriver = useCallback(async () => {
    const confirmText = driver?.activeOrderNumber
      ? `Водитель ${driver?.name + ' ' + driver?.surname + ' ' + driver?.patronymic} находится в исполнении рейса №${driver?.activeOrderNumber}/${driver?.activeRequestNumber}
        }. При завершении сессии продолжение исполнения в МП будет невозможным. Все не полученные сервером от МП данные по рейсу и дальнейший трек будут потеряны. Рейс будет возможно завершить только вручную из ЛК. Все равно завершить сессию?`
      : `Вы уверены?`;
    showConfirm({
      title: confirmText,
      okText: 'Завершить',
      cancelText: 'Отмена',
      width: 650,
      onOk: async () => {
        try {
          setLoading(true);
          await DriverService.logout(driverId);
          setLoading(false);
          showAlert({
            title: 'Сессия была успешно завершена',
          });
          await reloadDriver();
        } catch (e) {
          console.error(e);
          showError(e);
        }
      },
    });
  }, [driver]);

  return (
    <div className={'other-profiles-view'}>
      {loading ? <LoaderFullScreen text={'Загрузка...'} /> : <></>}
      {driver ? (
        <>
          <Extensions.DriverHeader
            goBack={goBack}
            driver={driver}
            reloadDriver={reloadDriver}
            maintainanceAction={maintainanceAction}
            logoutDriver={logoutDriver}
          />
          {showNotification()}
          <div className={'flexbox justify-center margin-top-16'} style={{ minHeight: '500px' }}>
            <Extensions.DriverLeftSide
              unsetTransport={unsetTransport}
              handleTogglesChange={handleTogglesChange}
              neverDelegate={neverDelegate}
              canWorkAsLoader={canWorkAsLoader}
              driver={driver}
              reloadDriver={reloadDriver}
              linkedVehicles={linkedVehicles}
              openAssignTransport={openAssignTransport}
              setDriverInfo={setDriverInfo}
            />
            <div className={'margin-left-8'} style={{ width: '592px' }}>
              <Tabs {...tabs} />
              <div className={'profile-box margin-top-12 right'} style={{ minHeight: '552px' }}>
                {routes}
                <div className={'flexbox justify-right  padding-16'}>
                  {driver?.producer?.id === user?.id && nonEditableStates.indexOf(driver?.uiState) < 0 ? (
                    <ButtonDeprecated
                      className={'semi-wide'}
                      theme={'secondary'}
                      onClick={() => {
                        history.push(`/drivers/${driverId}/edit`);
                      }}
                    >
                      {t.driver('editProfile')}
                    </ButtonDeprecated>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <AssignTransportNew
            assignedTransports={linkedVehicles}
            onSelect={(e) => onSelectTransport(e)}
            onClose={closeAssignTransport}
            assignment={true}
            showModal={assignTransportVisible}
            showActionButton={false}
            newApi={true}
            userId={user?.id}
          />
        </>
      ) : null}
    </div>
  );
}

export default DriverProfile;
