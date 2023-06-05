import React from 'react';
import { connect } from 'react-redux';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, IconDeprecated, showError, VzForm } from '@vezubr/elements';
import moment from 'moment';
import { useHistory } from 'react-router-dom';

function DriverLeftSide(props) {
  const {
    unsetTransport,
    canWorkAsLoader,
    neverDelegate,
    handleTogglesChange,
    driver,
    linkedVehicles,
    user,
    openAssignTransport,
  } = props;
  const history = useHistory();
  const navigateToTransportPage = (id, constructionType) => (
    history.replace(
      {
        pathname: `/${constructionType === '1' ? 'transports' : 'tractors'}/${id}`,
        state: {
          back: {
            pathname: history.location.pathname,
          }
        }
      }
    )
  );

  const { driverLicenseExpired } = React.useMemo(() => {
    return {
      driverLicenseExpired: moment(driver?.driverLicenseExpiresAtDate).isBefore(moment().subtract(1, 'd')),
      driverLicenseWillExpire: moment().add(1, 'w').isAfter(moment(driver?.driverLicenseExpiresAtDate)),
    };
  }, [driver]);

  const filteredTransports = linkedVehicles?.map((data, key) => {
    const serial = data?.plateNumber;
    const model = data?.markAndModel;
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
            {serial} {model}
          </p>
          <a style={{ cursor: 'pointer' }} onClick={() => unsetTransport(key, linkedVehicles)}>
            {t.order('unlink')}
          </a>
        </div>
        <div className={'flexbox transport-action justify-right center'}>
          <IconDeprecated
            className={'margin-left-26 pointer'}
            onClick={() => navigateToTransportPage(data?.id, data?.constructionType)}
            name={'chevronRightOrange'}
          />
        </div>
      </div>
    );
  });

  const previewUri = React.useMemo(() => {
    return driver?.photoFile
      ? driver?.photoFile.previews && driver?.photoFile.previews.length
        ? driver?.photoFile.previews.find((el) => el && el.widthInPx === 328)?.downloadUrl.replace('/', '')
        : driver?.photoFile.downloadUrl.replace('/', '')
      : null;
  }, [driver?.photoFile]);

  return (
    <div className={'profile-box left'}>
      {previewUri && (
        <div className={'profile-avatar padding-16'} style={{ height: 250 }}>
          <img style={{ width: '100%', height: '100%' }} src={`${window.API_CONFIGS[APP].host}${previewUri}`} />
        </div>
      )}
      <div className="flexbox column padding-12">
        <div className={'flex-auto'}>
          <VzForm.Item disabled={driver?.uiState === 7}>
            <VzForm.FieldSwitch
              disabled={driver?.uiState === 7}
              style={{ padding: '6px 7px' }}
              checkedTitle={t.driver('canWorkAsLoader')}
              unCheckedTitle={t.driver('canWorkAsLoader')}
              colorChecked={false}
              checked={canWorkAsLoader || driver?.canWorkAsLoader || false}
              onChange={() => handleTogglesChange('canWorkAsLoader', !driver?.canWorkAsLoader)}
            />
          </VzForm.Item>
        </div>
        <div className={'flex-auto margin-top-12'}>
          <VzForm.Item disabled={driver?.uiState === 7}>
            <VzForm.FieldSwitch
              disabled={driver?.uiState === 7}
              style={{ padding: '6px 7px' }}
              checkedTitle={t.driver('neverDelegate')}
              unCheckedTitle={t.driver('neverDelegate')}
              colorChecked={false}
              checked={neverDelegate || driver?.neverDelegate || false}
              onChange={() => handleTogglesChange('neverDelegate', !driver?.neverDelegate)}
            />
          </VzForm.Item>
        </div>
      </div>
      {user.id === driver?.producer?.id ? (
        <div className={'flexbox center margin-top-24 margin-bottom-12'}>
          {!driverLicenseExpired ? (
            <ButtonDeprecated
              onClick={openAssignTransport}
              disabled={driver?.uiState === 7 || driver?.uiState === 8}
              className={'semi-wide'}
              theme={'primary'}
            >
              {t.order('addCar')}
            </ButtonDeprecated>
          ) : (
            <ButtonDeprecated disabled={true} className={'semi-wide driver__button--red'} theme={'primary'}>
              Обновите водительское удостоверение
            </ButtonDeprecated>
          )}
        </div>
      ) : null}
      {filteredTransports?.length ? (
        <div>
          <div className={'info-title'}>{t.driver('transports')}</div>
          <div className={'flexbox column transport-list'}>{filteredTransports}</div>
        </div>
      ) : null}
    </div>
  );
}

const mapStateToProps = (state) => {
  const { user, dictionaries } = state;

  return {
    user,
    dictionaries,
  };
};

export default connect(mapStateToProps)(DriverLeftSide);
