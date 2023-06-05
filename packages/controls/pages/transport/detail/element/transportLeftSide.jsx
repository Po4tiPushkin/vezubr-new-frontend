import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, IconDeprecated, showError, VzForm } from '@vezubr/elements';
import moment from 'moment';

function TransportLeftSide(props) {
  const { unsetDriver, transport, linkedDrivers = [], openAssignDriver, history } = props;

  const user = useSelector((state) => state.user);

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
    return transport?.photoFile
      ? transport?.photoFile.imageFilesPreviewModel && transport?.photoFile.length
        ? transport?.photoFile.imageFilesPreviewModel
            .find((el) => el && el.widthInPx === 328)
            ?.downloadUrl.replace('/', '')
        : transport?.photoFile.downloadUrl.replace('/', '')
      : null;
  }, [transport?.photoFile]);

  return (
    <div className={'profile-box left'}>
      {previewUri && (
        <div className={'profile-avatar'} style={{ width: '328px' }}>
          <img style={{ width: '100%', height: '100%' }} src={`${window.API_CONFIGS[APP].host}${previewUri}`} />
        </div>
      )}
      {filteredDrivers?.length ? (
        <div>
          <div className={'info-title'}>{'Водители'}</div>
          <div className={'flexbox column transport-list'}>{filteredDrivers}</div>
        </div>
      ) : null}
      {user.id === transport?.producer?.id ? (
        <div className={'flexbox center margin-top-24 margin-bottom-12'}>
          <ButtonDeprecated
            onClick={openAssignDriver}
            disabled={transport?.uiState === 7 || transport?.uiState === 8}
            className={'semi-wide'}
            theme={'primary'}
          >
            {'Добавить Водителей'}
          </ButtonDeprecated>
        </div>
      ) : null}
    </div>
  );
}

export default TransportLeftSide;
