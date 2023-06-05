import React, { useState, useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
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

const UI_STATES = Utils.uiStatesClassNames;

const disabledMaintenanceStates = [1, 7, 4, 8];

const disabledExploitationStates = [7, 4, 8];

function TransportHeader(props) {
  const { transport, maintainanceAction, goBack, stopExploitation } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const [menuVisible, setMenuVisible] = useState(false);

  const transportId = useMemo(() => transportId?.id, [transportId]);

  const toggleMenu = useCallback(() => {
    setMenuVisible(!menuVisible);
  }, [menuVisible]);

  const menuOptions = useMemo(
    () => ({
      show: menuVisible,
      arrowPosition: 'right',
      onClick: () => {
        toggleMenu();
      },
      list: [
        {
          title: t.buttons(transport.onMaintenance ? 'startMaintenance' : 'stopMaintenance'),
          icon: <IconDeprecated name={transport.onMaintenance ? 'playOrange' : 'pauseOrange'} />,
          onAction: () => maintainanceAction(),
          disabled: transport?.status === 'not_active',
        },
        {
          title: t.buttons('stopExploitation'),
          icon: <IconDeprecated name={'xOrange'} />,
          onAction: () => stopExploitation(),
          disabled: transport?.status === 'not_active',
        },
      ],
    }),
    [menuVisible, transport?.onMaintenance, transport?.uiState],
  );

  const uiStateName = useMemo(() => {
    const { vehicleUiState } = dictionaries;
    return (
      (vehicleUiState.find((item) => item.id == transport?.uiState)?.title || '') +
      (transport?.activeOrderId ? ` №${transport?.activeOrderId?.id}` : '')
    );
  }, [transport?.uiState, transport?.activeOrderId, dictionaries]);

  const status = useMemo(
    () => ({
      type: UI_STATES[transport?.uiState || 0],
      name: (uiStateName || '') + (transport?.activeOrderNumber ? ` №${transport?.activeOrderNumber}/${transport?.activeRequestNumber}` : ''),
    }),
    [transport?.uiState, uiStateName, transport?.activeOrderNumber, transport?.activeRequestNumber],
  );
  return (
    <Page.Title
      onBack={goBack}
      extra={
        <>
          <div className="flexbox size-1 margin-left-12">
            <div className={'flexbox'}>
              <h4 style={{ fontWeight: '600', fontSize: '24px' }} className={'flexbox center'}>
                {'Подрядчик: ' + (transport?.producer?.title || '')}
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
      <div>{`ТС №${transport.plateNumber}`}</div>
      {transport?.uiState ? (
        <div className={'flexbox center margin-left-8'}>
          <span className={`circle status margin-left-10 ${status.type || 'default'}`} />
          <span className={'status-title margin-left-6'}>{status.name}</span>
        </div>
      ) : null}
    </Page.Title>
  );
}

export default TransportHeader;
