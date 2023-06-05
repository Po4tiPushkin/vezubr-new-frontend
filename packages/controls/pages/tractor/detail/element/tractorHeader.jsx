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

function TractorHeader(props) {
  const { tractor, maintainanceAction, goBack } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const [menuVisible, setMenuVisible] = useState(false);

  const tractorId = useMemo(() => tractorId?.id, [tractorId]);

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
          title: t.buttons(tractor.onMaintenance ? 'startMaintenance' : 'stopMaintenance'),
          icon: <IconDeprecated name={tractor.onMaintenance ? 'playOrange' : 'pauseOrange'} />,
          onAction: () => maintainanceAction(),
          disabled: tractor?.uiState == 7,
        },
      ],
    }),
    [menuVisible, tractor?.onMaintenance, tractor?.uiState],
  );

  const uiStateName = useMemo(() => {
    const { unitUiStates } = dictionaries;
    return (
      (unitUiStates.find((item) => item.id == tractor?.uiState)?.title || '') +
      (tractor?.activeOrderNumber ? ` №${tractor?.activeOrderNumber}/${tractor?.activeRequestNumber}` : '')
    );
  }, [tractor?.uiState,tractor?.activeRequestNumber,tractor?.activeOrderNumber, dictionaries]);

  const status = useMemo(
    () => ({
      type: UI_STATES[tractor?.uiState || 0],
      name: uiStateName || '',
    }),
    [tractor?.uiState, uiStateName],
  );
  return (
    <Page.Title
      onBack={goBack}
      extra={
        <>
          <div className="flexbox size-1 margin-left-12">
            <div className={'flexbox'}>
              <h3 className={'flexbox center'}>{'Подрядчик: ' + (tractor?.owner?.title || '')}</h3>
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
      <div>{`Тягач №${tractor.plateNumber}`}</div>
      {tractor?.uiState ? (
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

export default TractorHeader;
