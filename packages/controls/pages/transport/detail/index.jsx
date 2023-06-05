import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { AssignDriverNew, StatusNotificationNew } from '@vezubr/components';
import { ButtonDeprecated, LoaderFullScreen, showError, showAlert, showConfirm } from '@vezubr/elements';
import { Vehicle as VehicleService } from '@vezubr/services/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Tabs } from '../../../index';
import { ROUTE_PARAMS } from '../../../infrastructure';
import { createRouteWithParams, ROUTES } from '../../../infrastructure/routing';
import * as Extensions from './element';
import './index.scss';
import { TransportDocuments, TransportGeneral, TransportBody } from './tabs';

const UI_STATES = Utils.uiStatesClassNames;
const COMMON_UI_STATE_PARAMS = Utils.uiStateParams;

const UI_STATE_PARAMS = {
  ...COMMON_UI_STATE_PARAMS,
  // Блокируем редактирование и скрываем меню (Есть рейсы, На рейсе) только для продюсера
  transport: {
    ...COMMON_UI_STATE_PARAMS.transport,
    3: {
      disableEdit: true,
      disableMenu: true,
    },
    4: {
      disableEdit: true,
      disableMenu: true,
    },
  },
};

const ROUTE_DETAIL_GENERAL = createRouteWithParams(ROUTES.TRANSPORTS, { [ROUTE_PARAMS.paramOptions]: 'general' });
const ROUTE_DETAIL_DOCUMENTS = createRouteWithParams(ROUTES.TRANSPORTS, { [ROUTE_PARAMS.paramOptions]: 'documents' });
const ROUTE_DETAIL_BODY = createRouteWithParams(ROUTES.TRANSPORTS, { [ROUTE_PARAMS.paramOptions]: 'body' });
const ROUTE_DETAIL_HISTORY = createRouteWithParams(ROUTES.TRANSPORTS, { [ROUTE_PARAMS.paramOptions]: 'history' });
//todo move to configs (utils)
const nonEditableStates = [7];

function TransportProfile(props) {
  const { match, history } = props;
  const user = useSelector((state) => state.user);
  const transportId = match.params.id;
  const backUrl = useMemo(() => history.location.state ? history.location?.state?.back?.pathname : '/transports', [])
  const goBack = () => {
    history.push(backUrl);
  };
  const [loading, setLoading] = useState(true);
  const [{ transport, linkedDrivers }, setTransportInfo] = useState({});

  const [assignDriverVisible, setAssignDriverVisible] = useState(false);

  const onSelectDrivers = useCallback(
    async (driversValues) => {
      try {
        const drivers = driversValues.map((t) => String(t.id));
        await VehicleService.setLinkedDrivers(transport?.id, drivers);
        await closeAssignDriver();
        await reloadTransport();
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [reloadTransport, transport],
  );

  const tabs = useMemo(() => {
    const props = {
      params: { [ROUTE_PARAMS.paramId]: match.params.id },
    };

    return {
      attrs: {
        className: 'transport-tabs',
      },
      items: [
        {
          title: 'Основные',
          route: ROUTE_DETAIL_GENERAL,
          ...props,
          additionalRoutesMatch: [
            {
              route: ROUTES.TRANSPORTS,
              ...props,
            },
          ],
        },
        {
          title: 'Кузов',
          route: ROUTE_DETAIL_BODY,
          ...props,
        },
        {
          title: 'Документы',
          route: ROUTE_DETAIL_DOCUMENTS,
          ...props,
        },
        {
          title: 'История',
          route: ROUTE_DETAIL_HISTORY,
          disabled: true,
          ...props,
        },
      ],
    };
  }, [match.params.id]);

  const routes = useMemo(() => {
    return (
      <Switch>
        <Route {...ROUTE_DETAIL_DOCUMENTS} render={() => <TransportDocuments transport={transport} />} />
        <Route {...ROUTE_DETAIL_BODY} render={() => <TransportBody transport={transport} />} />
        <Route {...ROUTE_DETAIL_HISTORY} render={() => { }} />
        <Route {...ROUTES.TRANSPORTS} render={() => <TransportGeneral transport={transport} />} />
      </Switch>
    );
  }, [transport]);

  const reloadTransport = useCallback(async () => {
    await getTransportInfo();
  }, []);

  useEffect(() => {
    (async () => {
      if (parseInt(transportId) > 0) {
        await reloadTransport();
      } else {
        setLoading(false);
      }
    })();
  }, [transportId]);

  const getNotification = useMemo(() => {
    const Notify = UI_STATE_PARAMS.transport[transport?.uiState];
    if (transport?.uiState === 6) {
      Notify.description = transport?.checkComment;
    }
    return (
      Notify &&
      (Notify.title || Notify.description) && (
        <StatusNotificationNew
          className={'margin-top-12'}
          style={{
            width: '960px',
            margin: '0 auto',
          }}
          type={'default'}
          title={Notify.title}
          color={Notify.color}
          description={Notify.description}
        />
      )
    );
  }, [transport]);

  const getTransportInfo = useCallback(async () => {
    setLoading(true);
    try {
      if (APP === 'operator') {
        const vehicle = (await VehicleService.monoInfo({ vehicleId: transportId })).data?.vehicle;
        setTransportInfo({
          transport: vehicle,
        })
        setLoading(false);
        return;
      }
      const response = await VehicleService.info(transportId);
      setTransportInfo({
        transport: response?.vehicle,
        linkedDrivers: response?.linkedDrivers
          ? Object.keys(response?.linkedDrivers).map((el) => response.linkedDrivers[el].driver)
          : [],
      });
      setLoading(false);
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [transportId]);

  const openAssignDriver = useCallback(() => {
    setAssignDriverVisible(true);
  }, [setAssignDriverVisible]);

  const closeAssignDriver = useCallback(async () => {
    setAssignDriverVisible(false);
  }, [setAssignDriverVisible]);

  const unsetDriver = useCallback(async (index, drivers) => {
    drivers.splice(index, 1);
    await onSelectDrivers(drivers);
  });

  const maintainanceAction = useCallback(async () => {
    try {
      await VehicleService.setMaintenance(transportId, { isMaintenanceState: !transport?.onMaintenance });
      await reloadTransport();
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [transportId, transport?.onMaintenance]);

  const stopExploitation = useCallback(async () => {
    showConfirm({
      title: 'Вы уверены?',
      onOk: async () => {
        await VehicleService.remove({ vehicleId: transportId });
        await reloadTransport();
        showAlert({
          message: 'Эксплуатация была завершена',
        });
      },
    });
  }, [transportId]);

  return (
    <div className={'other-profiles-view'}>
      {loading ? <LoaderFullScreen text={'Загрузка...'} /> : <></>}
      {transport ? (
        <>
          <Extensions.TransportHeader
            goBack={goBack}
            transport={transport}
            reloadTransport={reloadTransport}
            maintainanceAction={maintainanceAction}
            stopExploitation={stopExploitation}
          />
          {getNotification}
          <div className={'flexbox justify-center margin-top-16'} style={{ minHeight: '500px' }}>
            <Extensions.TransportLeftSide
              history={history}
              unsetDriver={unsetDriver}
              transport={transport}
              reloadTransport={reloadTransport}
              linkedDrivers={linkedDrivers}
              openAssignDriver={openAssignDriver}
              setTransportInfo={setTransportInfo}
            />
            <div className={'margin-left-8'} style={{ width: '592px' }}>
              <Tabs {...tabs} />
              <div className={'profile-box margin-top-12 right'} style={{ minHeight: '552px' }}>
                {routes}
                <div className={'flexbox justify-right  padding-16'}>
                  {transport?.producer?.id === user?.id && !nonEditableStates.includes(transport?.uiState) ? (
                    <ButtonDeprecated
                      className={'semi-wide'}
                      theme={'secondary'}
                      onClick={() => history.push(`/transports/${transportId}/edit`)}
                    >
                      {'Редактировать ТС'}
                    </ButtonDeprecated>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {Object.keys(transport).length && (
            <AssignDriverNew
              showActionButton={false}
              assignedDrivers={linkedDrivers}
              userId={user?.id}
              className={''}
              showModal={assignDriverVisible}
              onClose={() => closeAssignDriver()}
              onSelect={(e) => onSelectDrivers(e)}
            />
          )}
        </>
      ) : null}
    </div>
  );
}

export default TransportProfile;
