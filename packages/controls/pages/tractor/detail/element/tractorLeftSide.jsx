import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, IconDeprecated, showError, VzForm } from '@vezubr/elements';
import moment from 'moment';

function TractorLeftSide(props) {
  const {
    unsetDriver,
    tractor,
    linkedDrivers = [],
    openAssignDriver,
    history,
    openAssignTrailer,
    trailer
  } = props;

  const user = useSelector((state) => state.user);

  const renderedTrailer = useMemo(() => {
    if (!trailer) {
      return null;
    }
    const { plateNumber, markAndModel, vehicleTypeTitle, photoFile, category, id } = trailer || {};
    return (
      <div className={`transport-box flexbox margin-top-12`} style={{ padding: '4px 12px' }}>
        {photoFile ? (
          <div className={'empty-attach-input'}>
            <img
              style={{ width: '52px', height: '52px' }}
              src={`${window.API_CONFIGS[APP].host}${photoFile?.downloadUrl.replace('/', '')}`}
            />
          </div>
        ) : (
          <div style={{ width: '52px', height: '52px' }}></div>
        )}
        <div className={'flexbox column align-left size-1 justify-left margin-left-16'}>
          <p className={'no-margin'}>
            {plateNumber} {markAndModel}
          </p>
          <p className={'no-margin'}>
            {category}
          </p>
          <p className={'no-margin'}>
            {vehicleTypeTitle}
          </p>
        </div>
        <div className={'flexbox transport-action justify-right center'}>
          <IconDeprecated
            className={'margin-left-26 pointer'}
            onClick={() => history.push(`/trailers/${id}`)}
            name={'chevronRightOrange'}
          />
        </div>
      </div>
    );
  }, [trailer])


  const filteredDrivers = linkedDrivers?.map((data, key) => {
    const { name, surname } = data;
    return (
      <div key={key} className={`transport-box flexbox margin-top-12`} style={{ padding: '4px 12px' }}>
        <div className={'empty-attach-input'}>
          {data?.photoFile?.downloadUrl ? (
            <img
              style={{ width: '52px', height: '52px' }}
              src={`${window.API_CONFIGS[APP].host}${data?.photoFile?.downloadUrl?.replace('/', '')}`}
            />
          ) : null}
        </div>
        <div className={'flexbox column align-left size-1 justify-left margin-left-16'}>
          <p className={'no-margin'}>
            {name} {surname}
          </p>
          <a style={{ cursor: 'pointer' }} onClick={() => unsetDriver(key, linkedDrivers)}>
            {t.order('unlink')}
          </a>
        </div>
        <div className={'flexbox transport-action justify-right center'}>
          <IconDeprecated
            className={'margin-left-26 pointer'}
            onClick={() => history.push(`/drivers/${data.id}`)}
            name={'chevronRightOrange'}
          />
        </div>
      </div>
    );
  });

  const previewUri = useMemo(() => {
    return tractor?.photo
      ? tractor?.photo.imageFilesPreviewModel && tractor?.photo.length
        ? tractor?.photo.imageFilesPreviewModel.find((el) => el && el.widthInPx === 328)?.downloadUrl.replace('/', '')
        : tractor?.photo.downloadUrl.replace('/', '')
      : null;
  }, [tractor?.photo]);

  return (
    <div className={'profile-box left'}>
      {previewUri && (
        <div className={'profile-avatar'} style={{ height: 250 }}>
          <img style={{ width: '100%', height: '100%' }} src={`${window.API_CONFIGS[APP].host}${previewUri}`} />
        </div>
      )}
      {filteredDrivers?.length ? (
        <div>
          <div className={'info-title'}>{'Водители'}</div>
          <div className={'flexbox column transport-list'}>{filteredDrivers}</div>
        </div>
      ) : null}
      {user.id === tractor?.owner?.id ? (
        <div className={'flexbox center margin-top-24 margin-bottom-12'}>
          <ButtonDeprecated
            onClick={openAssignDriver}
            disabled={tractor?.uiState === 7 || tractor?.uiState === 8}
            className={'semi-wide'}
            theme={'primary'}
          >
            {'Добавить Водителей'}
          </ButtonDeprecated>
        </div>
      ) : null}
      {renderedTrailer ? (
        <div>
          <div className={'info-title'}>{'Полуприцепы'}</div>
          <div className={'flexbox column transport-list'}>{renderedTrailer}</div>
        </div>
      ) : null}
      {user.id === tractor?.owner?.id ? (
        <div className={'flexbox center margin-top-24 margin-bottom-12'}>
          <ButtonDeprecated
            onClick={openAssignTrailer}
            disabled={tractor?.uiState === 7 || tractor?.uiState === 8}
            className={'semi-wide'}
            theme={'primary'}
          >
            {'Прикрепить Полуприцеп'}
          </ButtonDeprecated>
        </div>
      ) : null}
    </div>
  );
}

export default TractorLeftSide;
