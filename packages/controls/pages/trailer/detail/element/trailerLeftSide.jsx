import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, IconDeprecated, showError, VzForm } from '@vezubr/elements';
import moment from 'moment';

function TrailerLeftSide(props) {
  const { trailer, setOpenAssignTractor, history, tractor } = props;
  const user = useSelector((state) => state.user);

  const renderedTractor = useMemo(() => {
    if (!tractor) {
      return null
    }
    const { plateNumber, markAndModel, photoFile, id } = tractor || {};
    return (
      <div className={`trailer-box flexbox margin-top-12`} style={{ padding: '4px 12px' }}>
        <div className={'empty-attach-input'}>
          {photoFile?.downloadUrl ? (
            <img
              style={{ width: '52px', height: '52px' }}
              src={`${window.API_CONFIGS[APP].host}${photoFile?.downloadUrl?.replace('/', '')}`}
            />
          ) : null}
        </div>
        <div className={'flexbox column align-left size-1 justify-left margin-left-16'}>
          <p className={'no-margin'}>
            {plateNumber} {markAndModel}
          </p>
        </div>
        <div className={'flexbox trailer-action justify-right center'}>
          <IconDeprecated
            className={'margin-left-26 pointer'}
            onClick={() => history.push(`/tractors/${id}`)}
            name={'chevronRightOrange'}
          />
        </div>
      </div>
    );
  }, [tractor])

  const previewUri = useMemo(() => {
    return trailer?.photoFile
      ? trailer?.photoFile.imageFilesPreviewModel && trailer?.photoFile.length
        ? trailer?.photoFile.imageFilesPreviewModel
          .find((el) => el && el.widthInPx === 328)
          ?.downloadUrl.replace('/', '')
        : trailer?.photoFile.downloadUrl.replace('/', '')
      : null;
  }, [trailer?.photoFile]);

  return (
    <div className={'profile-box left'}>
      {previewUri && (
        <div className={'profile-avatar'} style={{ width: '328px' }}>
          <img style={{ width: '100%', height: '100%' }} src={`${window.API_CONFIGS[APP].host}${previewUri}`} />
        </div>
      )}
      {renderedTractor ? (
        <div>
          <div className={'info-title'}>{'Тягачи'}</div>
          <div className={'flexbox column trailer-list'}>{renderedTractor}</div>
        </div>
      ) : null}
      {user.id === trailer?.producer?.id ? (
        <div className={'flexbox center margin-top-24 margin-bottom-12'}>
          <ButtonDeprecated
            onClick={() => setOpenAssignTractor(true)}
            disabled={trailer?.uiState === 7 || trailer?.uiState === 8}
            className={'semi-wide'}
            theme={'primary'}
          >
            {'Прикрепить тягач'}
          </ButtonDeprecated>
        </div>
      ) : null}
    </div>
  );
}

export default TrailerLeftSide;
