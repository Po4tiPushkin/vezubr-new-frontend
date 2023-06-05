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

function TrailerHeader(props) {
  const { trailer, maintainanceAction, goBack } = props;
  const dictionaries = useSelector((state) => state.dictionaries);
  const [menuVisible, setMenuVisible] = useState(false);

  const trailerId = useMemo(() => trailerId?.id, [trailerId]);

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
          title: t.buttons(trailer.onMaintenance ? 'startMaintenance' : 'stopMaintenance'),
          icon: <IconDeprecated name={trailer.onMaintenance ? 'playOrange' : 'pauseOrange'} />,
          onAction: () => maintainanceAction(),
          disabled: trailer?.uiState == 7,
        },
      ],
    }),
    [menuVisible, trailer?.onMaintenance, trailer?.uiState],
  );

  const uiStateName = useMemo(() => {
    const { unitUiStates } = dictionaries;
    return (
      (unitUiStates.find((item) => item.id == trailer?.uiState)?.title || '') +
      (trailer?.activeOrderNumber ? ` №${trailer?.activeOrderNumber}/${trailer?.activeRequestNumber}` : '')
    );
  }, [trailer?.uiState,trailer?.activeOrderNumber,trailer?.activeRequestNumber, dictionaries]);

  const status = useMemo(
    () => ({
      type: UI_STATES[trailer?.uiState || 0],
      name: uiStateName || '',
    }),
    [trailer?.uiState, uiStateName],
  );
  return (
    <Page.Title
      onBack={goBack}
      extra={
        <>
          <div className="flexbox size-1 margin-left-12">
            <div className={'flexbox'}>
              <h4 style={{ fontWeight: '600', fontSize: '24px' }} className={'flexbox center'}>
                {'Подрядчик: ' + (trailer?.producer?.title || '')}
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
      <div>{`ТС №${trailer.plateNumber}`}</div>
      {trailer?.uiState ? (
        <div className={'flexbox center margin-left-8'}>
          <span className={`circle status margin-left-10 ${status.type || 'default'}`} />
          <span className={'status-title margin-left-6'}>{status.name}</span>
        </div>
      ) : null}
    </Page.Title>
  );
}

export default TrailerHeader;
