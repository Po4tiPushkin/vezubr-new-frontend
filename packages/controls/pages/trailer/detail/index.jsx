import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { AssignTractorNew, StatusNotificationNew } from '@vezubr/components';
import { ButtonDeprecated, LoaderFullScreen, showError, showAlert, showConfirm } from '@vezubr/elements';
import {
  Vehicle as VehicleService,
  Trailer as TrailerService,
  Tractor as TractorService,
} from '@vezubr/services/index';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import { Tabs } from '../../../index';
import { ROUTE_PARAMS } from '../../../infrastructure';
import { createRouteWithParams, ROUTES } from '../../../infrastructure/routing';
import * as Extensions from './element';
import './index.scss';
import { TrailerDocuments, TrailerGeneral, TrailerBody } from './tabs';

const UI_STATES = Utils.uiStatesClassNames;
const UI_STATE_PARAMS = Utils.uiStateParams;

const ROUTE_DETAIL_GENERAL = createRouteWithParams(ROUTES.TRAILER, { [ROUTE_PARAMS.paramOptions]: 'general' });
const ROUTE_DETAIL_DOCUMENTS = createRouteWithParams(ROUTES.TRAILER, { [ROUTE_PARAMS.paramOptions]: 'documents' });
const ROUTE_DETAIL_BODY = createRouteWithParams(ROUTES.TRAILER, { [ROUTE_PARAMS.paramOptions]: 'body' });

function TrailerProfile(props) {
  const { match, history } = props;
  const user = useSelector((state) => state.user);
  const trailerId = match.params.id;
  const goBack = () => {
    history.push('/trailers');
  };
  const [loading, setLoading] = useState(true);
  const [trailer, setTrailerInfo] = useState(null);
  const [tractor, setTractor] = useState(null);
  const [openAssignTractor, setOpenAssignTractor] = useState(false);
  const dictionaries = useSelector((state) => state.dictionaries);
  const tabs = useMemo(() => {
    const props = {
      params: { [ROUTE_PARAMS.paramId]: match.params.id },
    };

    return {
      attrs: {
        className: 'trailer-tabs',
      },
      items: [
        {
          title: 'Основные',
          route: ROUTE_DETAIL_GENERAL,
          ...props,
          additionalRoutesMatch: [
            {
              route: ROUTES.TRAILER,
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
      ],
    };
  }, [match.params.id]);

  const routes = useMemo(() => {
    return (
      <Switch>
        <Route {...ROUTE_DETAIL_DOCUMENTS} render={() => <TrailerDocuments trailer={trailer} />} />
        <Route {...ROUTE_DETAIL_BODY} render={() => <TrailerBody trailer={trailer} />} />
        <Route {...ROUTES.TRAILER} render={() => <TrailerGeneral dictionaries={dictionaries} trailer={trailer} />} />
      </Switch>
    );
  }, [trailer]);

  const reloadTrailer = useCallback(async () => {
    await getTrailerInfo();
  }, []);

  useEffect(() => {
    (async () => {
      if (parseInt(trailerId) > 0) {
        await reloadTrailer();
      } else {
        setLoading(false);
      }
    })();
  }, [trailerId]);

  const getTrailerInfo = useCallback(async () => {
    setLoading(true);
    try {
      const response = await TrailerService.info(trailerId);
      if (response.tractorId) {
        const tractorResponse = await TractorService.info(response.tractorId);
        setTractor(tractorResponse?.tractor);
      }
      setTrailerInfo(response);
    } catch (e) {
      showError(e);
      console.error(e);
    }
    finally {
      setLoading(false)
    }
  }, [trailerId]);

  const maintainanceAction = useCallback(async () => {
    try {
      await TrailerService.setMaintenance(trailerId, { isMaintenanceState: !trailer?.onMaintenance });
      await reloadTrailer();
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [trailerId, trailer?.onMaintenance]);

  const closeAssignTractor = useCallback(() => {
    setOpenAssignTractor(false);
  }, []);

  const onSelectTractor = useCallback(
    async (tractor) => {
      try {
        await VehicleService.updateTrailer({
          id: tractor?.id,
          trailer: String(trailer?.id),
        });
        closeAssignTractor();
        await reloadTrailer();
      } catch (e) {
        console.error(e);
        showError(e);
      }
    },
    [trailer],
  );

  const getNotification = useMemo(() => {
    const Notify = UI_STATE_PARAMS.transport[trailer?.uiState];
    if (trailer?.uiState === 6) {
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
  }, [trailer]);

  return (
    <div className={'other-profiles-view'}>
      {loading ? <LoaderFullScreen text={'Загрузка...'} /> : <></>}
      {trailer ? (
        <>
          <Extensions.TrailerHeader
            goBack={goBack}
            trailer={trailer}
            reloadTrailer={reloadTrailer}
            maintainanceAction={maintainanceAction}
          />
          {getNotification}
          <div className={'flexbox justify-center margin-top-16'} style={{ minHeight: '500px' }}>
            <Extensions.TrailerLeftSide
              history={history}
              trailer={trailer}
              setOpenAssignTractor={setOpenAssignTractor}
              reloadTrailer={reloadTrailer}
              tractor={tractor}
              setTrailerInfo={setTrailerInfo}
            />
            <div className={'margin-left-8'} style={{ width: '592px' }}>
              <Tabs {...tabs} />
              <div className={'profile-box margin-top-12 right'} style={{ minHeight: '552px' }}>
                {routes}
                <div className={'flexbox justify-right padding-16'}>
                  {trailer?.producer?.id === user?.id ? (
                    <ButtonDeprecated
                      className={'semi-wide'}
                      theme={'secondary'}
                      onClick={() => {
                        history.push(`/trailers/${trailerId}/edit`);
                      }}
                    >
                      {'Редактировать Полуприцеп'}
                    </ButtonDeprecated>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          {!loading && openAssignTractor && (
            <AssignTractorNew
              showModal={openAssignTractor}
              onClose={() => closeAssignTractor()}
              onSave={(e) => onSelectTractor(e)}
            />
          )}
        </>
      ) : null}
    </div>
  );
}

export default TrailerProfile;
