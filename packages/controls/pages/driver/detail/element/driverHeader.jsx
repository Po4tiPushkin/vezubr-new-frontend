import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import t from '@vezubr/common/localization';
import {
  FilterButton,
  ButtonDeprecated,
  IconDeprecated,
  showConfirm,
  showAlert,
  Page,
} from '@vezubr/elements';
import Utils from '@vezubr/common/common/utils';
import useGoBack from '@vezubr/common/hooks/useGoBack';
import { Drivers as DriverService } from '@vezubr/services';
import { useSelector } from 'react-redux'

const UI_STATES = Utils.uiStatesClassNames;

function DriverHeader(props, context) {
  const { driver, reloadDriver, dictionaries, maintainanceAction, logoutDriver, goBack } = props;
  const [menuVisible, setMenuVisible] = React.useState(false);
  const userId = useSelector((state) => state.user.id)

  const driverId = React.useMemo(() => driver?.id, [driver]);

  const toggleMenu = React.useCallback(() => {
    setMenuVisible(!menuVisible);
  }, [menuVisible]);

  const fireDriver = React.useCallback(async () => {
    showConfirm({
      title: 'Вы уверены?',
      onOk: async (e) => {
        await DriverService.remove({ driverId });
        await reloadDriver();
        showAlert({
          message: 'Водитель был уволен',
        });
      },
    });
  }, []);

  const menuOptions = React.useMemo(
    () => ({
      show: menuVisible,
      arrowPosition: 'right',
      onClick: () => {
        toggleMenu();
      },
      list: [
        {
          title: t.buttons(driver?.onSickLeave ? 'restore' : 'tempStop'),
          icon: <IconDeprecated name={driver?.onSickLeave ? 'playOrange' : 'pauseOrange'} />,
          onAction: maintainanceAction,
          disabled: driver?.status === 'not_active' || driver?.producer?.id !== userId,
        },
        {
          title: t.buttons('fire'),
          disabled: driver?.status === 'not_active' || driver?.producer?.id !== userId,
          icon: <IconDeprecated name={'xOrange'} />,
          onAction: fireDriver,
        },
      ],
    }),
    [menuVisible, driver?.onSickLeave, driver?.status],
  );

  const uiStateName = React.useMemo(() => {
    const { driverUiState } = dictionaries;
    return (
      (driverUiState.find((item) => item.id == driver?.uiState)?.title || '') +
      (driver?.activeOrderNumber ? ` №${driver?.activeOrderNumber}/${driver?.activeRequestNumber}` : '')
    );
  }, [driver?.uiState, driver?.activeOrderNumber, driver?.activeRequestNumber, dictionaries]);

  const status = React.useMemo(
    () => ({
      type: UI_STATES[driver?.uiState || 0],
      name: uiStateName || '',
    }),
    [driver?.uiState, uiStateName],
  );
  return (
    <Page.Title
      onBack={goBack}
      extra={
        <>
          <div className="flexbox size-1 margin-left-12">
            <div className="buttons">
              {driver?.hasActiveSession ? (
                <ButtonDeprecated theme={'secondary'} onClick={() => logoutDriver()} className={'margin-right-12'}>
                  Завершить сессию
                </ButtonDeprecated>
              ) : null}
            </div>
            <div className={'flexbox'}>
              <h4 style={{ fontWeight: '600', fontSize: '24px' }} className={'flexbox center'}>
                {'Подрядчик: ' + (driver?.producer?.title || '')}
              </h4>
              <FilterButton
                icon={'dotsBlue'}
                onClose={(e) => menuOptions.onClick(e)}
                onClick={(e) => menuOptions.onClick(e)}
                className={'circle box-shadow margin-left-12'}
                withMenu={true}
                menuOptions={menuOptions}
              />
            </div>
          </div>
        </>
      }
    >
      <div>{`${driver?.name} ${driver?.surname}`}</div>
      {driver?.uiState ? (
        <div className={'flexbox center margin-left-8'}>
          <span className={`circle status margin-left-10 ${status.type || 'default'}`} />
          <span className={'status-title margin-left-6'}>{status.name}</span>
        </div>
      ) : null}
      {/* {driver?.uiState === 3 || driver?.uiState === 4 ? (
        <div className={'buttons'}>{buttons}</div>
      ) : (
        null
      )} */}
    </Page.Title>
  );
}

DriverHeader.propTypes = {
  title: PropTypes.string.isRequired,
  status: PropTypes.object,
  producer: PropTypes.string,
};

const mapStateToProps = (state) => {
  const { dictionaries } = state;

  return {
    dictionaries,
  };
};

export default connect(mapStateToProps)(DriverHeader);
