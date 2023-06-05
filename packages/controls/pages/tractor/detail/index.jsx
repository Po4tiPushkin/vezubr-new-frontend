import React, { useState, useCallback, useMemo, useEffect } from 'react';
import moment from 'moment';
import _get from 'lodash/get';
import { Route, Switch } from 'react-router';
import t from '@vezubr/common/localization';
import {
  Drivers as DriverService,
  Tractor as TractorService,
  Trailer as TrailerService,
  Vehicle as VehicleService,
} from '@vezubr/services/index';
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
  AssignDriverNew,
  AssignTrailerNew,
  ModalDeprecated,
  InputField,
  OrderSidebarInfos,
  StatusNotificationNew
} from '@vezubr/components';
import Utils from '@vezubr/common/common/utils';
import { Tabs } from '../../../index';
import { createRouteWithParams, ROUTES } from '../../../infrastructure/routing';
import { ROUTE_PARAMS, history } from '../../../infrastructure';
import { TractorGeneral, TractorDocuments } from './tabs';
import './index.scss';
import { useSelector } from 'react-redux';

const UI_STATES = Utils.uiStatesClassNames;
const UI_STATE_PARAMS = Utils.uiStateParams;

const ROUTE_DETAIL_GENERAL = createRouteWithParams(ROUTES.TRACTOR, { [ROUTE_PARAMS.paramOptions]: 'general' });
const ROUTE_DETAIL_DOCUMENTS = createRouteWithParams(ROUTES.TRACTOR, { [ROUTE_PARAMS.paramOptions]: 'documents' });
const ROUTE_DETAIL_HISTORY = createRouteWithParams(ROUTES.TRACTOR, { [ROUTE_PARAMS.paramOptions]: 'history' });
//todo move to configs (utils)
const nonEditableStates = [3, 4, 7];

function TractorProfile(props) {
  const { match } = props;
  const user = useSelector((state) => state.user);
  const tractorId = match.params.id;
  const backUrl = useMemo(() => history.location.state ? history.location?.state?.back?.pathname : '/tractors', [])
  const goBack = () => {
    history.push(backUrl);
  };
  const [loading, setLoading] = useState(true);
  const [{ tractor, linkedDrivers, vehicle, }, setTractorInfo] = useState({});
  const [trailer, setTrailer] = useState(null);


  const [assignDriverVisible, setAssignDriverVisible] = useState(false);
  const [assignTrailerVisible, setAssignTrailerVisible] = useState(false);

  const onSelectDrivers = useCallback(
    async (driversValues) => {
      try {
        const drivers = driversValues.map((t) => String(t.id));
        await VehicleService.setLinkedDrivers(tractor?.id, drivers);
        await closeAssignDriver();
        await reloadTractor();
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [reloadTractor, tractor],
  );

  const tabs = useMemo(() => {
    const props = {
      params: { [ROUTE_PARAMS.paramId]: match.params.id },
    };

    return {
      attrs: {
        className: 'tractor-tabs',
      },
      items: [
        {
          title: 'Основные',
          route: ROUTE_DETAIL_GENERAL,
          ...props,
          additionalRoutesMatch: [
            {
              route: ROUTES.TRACTOR,
              ...props,
            },
          ],
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
        <Route {...ROUTE_DETAIL_DOCUMENTS} render={() => <TractorDocuments tractor={tractor} />} />
        <Route {...ROUTE_DETAIL_HISTORY} render={() => { }} />
        <Route {...ROUTES.TRACTOR} render={() => <TractorGeneral tractor={tractor} />} />
      </Switch>
    );
  }, [tractor]);

  const reloadTractor = useCallback(async () => {
    await getTractorInfo();
  }, []);

  useEffect(() => {
    (async () => {
      if (parseInt(tractorId) > 0) {
        await reloadTractor();
      } else {
        setLoading(false);
      }
    })();
  }, [tractorId]);

  const getTractorInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TractorService.info(tractorId);
      if (response?.tractor?.trailerId) {
        const responseTrailer = await TrailerService.info(response?.tractor.trailerId);
        setTrailer(responseTrailer);
      }
      setTractorInfo({
        tractor: response?.tractor,
        linkedDrivers: Object.values(response.linkedDrivers || {}).map(el => el.driver),
      });
      setLoading(false);
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [tractorId]);

  const openAssignDriver = useCallback(() => {
    setAssignDriverVisible(true);
  }, [setAssignDriverVisible]);

  const closeAssignDriver = useCallback(async () => {
    setAssignDriverVisible(false);
  }, [setAssignDriverVisible]);

  const openAssignTrailer = useCallback(() => {
    setAssignTrailerVisible(true);
  }, [setAssignTrailerVisible]);

  const closeAssignTrailer = useCallback(async () => {
    setAssignTrailerVisible(false);
  }, [setAssignTrailerVisible]);

  const unsetDriver = useCallback(async (index, drivers) => {
    drivers.splice(index, 1);
    await onSelectDrivers(drivers);
  });

  const onSelectTrailer = useCallback(
    async (trailer) => {
      try {
        await VehicleService.updateTrailer({
          id: tractor?.id,
          trailer: String(trailer?.id),
        });
        closeAssignTrailer();
        await reloadTractor();
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [tractor],
  );

  const maintainanceAction = useCallback(async () => {
    try {
      await TractorService.setMaintenance(tractorId, { isMaintenanceState: !tractor?.onMaintenance });
      await reloadTractor();
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [tractorId, tractor?.onMaintenance]);

  const getNotification = useMemo(() => {
    const Notify = UI_STATE_PARAMS.transport[tractor?.uiState];
    if (tractor?.uiState === 6) {
      Notify.description = tractor?.checkComment;
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
  }, [tractor]);

  return (
    <div className={'other-profiles-view'}>
      {loading ? <LoaderFullScreen text={'Загрузка...'} /> : <></>}
      {tractor ? (
        <>
          <Extensions.TractorHeader
            goBack={goBack}
            tractor={tractor}
            reloadTractor={reloadTractor}
            maintainanceAction={maintainanceAction}
          />
          {getNotification}
          <div className={'flexbox justify-center margin-top-16'} style={{ minHeight: '500px' }}>
            <Extensions.TractorLeftSide
              history={history}
              openAssignTrailer={openAssignTrailer}
              unsetDriver={unsetDriver}
              tractor={tractor}
              reloadTractor={reloadTractor}
              trailer={trailer}
              linkedDrivers={linkedDrivers}
              openAssignDriver={openAssignDriver}
              setTractorInfo={setTractorInfo}
            />
            <div className={'margin-left-8'} style={{ width: '592px' }}>
              <Tabs {...tabs} />
              <div className={'profile-box margin-top-12 right'} style={{ minHeight: '552px' }}>
                {routes}
                <div className={'flexbox justify-right  padding-16'}>
                  {tractor?.owner?.id === user?.id ? (
                    <ButtonDeprecated
                      className={'semi-wide'}
                      theme={'secondary'}
                      onClick={() => {
                        history.push(`/tractors/${tractorId}/edit`);
                      }}
                    >
                      {'Редактировать Тягач'}
                    </ButtonDeprecated>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {Object.keys(tractor).length && (
            <>
              <AssignDriverNew
                showActionButton={false}
                assignedDrivers={linkedDrivers}
                userId={user?.id}
                className={''}
                showModal={assignDriverVisible}
                onClose={() => closeAssignDriver()}
                onSelect={(e) => onSelectDrivers(e)}
              />
              {assignTrailerVisible && <AssignTrailerNew
                showModal={assignTrailerVisible}
                onClose={() => closeAssignTrailer()}
                onSave={(e) => onSelectTrailer(e)}
              />}
            </>
          )}
        </>
      ) : null}
    </div>
  );
}

export default TractorProfile;
