import React from 'react';
import { useSelector } from 'react-redux';
import t from '@vezubr/common/localization';
import {
  FilterButton,
  IconDeprecated,
  showConfirm,
  showAlert,
  Page,
} from '@vezubr/elements';
import Utils from '@vezubr/common/common/utils';
import { LoadersS as LoadersService } from '@vezubr/services'

const UI_STATES = Utils.uiStatesClassNames;

function LoaderHeader(props) {
  const { loader, reloadLoader, maintainanceAction, goBack } = props;
  const [menuVisible, setMenuVisible] = React.useState(false);
  const { driverUiStates } = useSelector(state => state.dictionaries);

  const loaderId = React.useMemo(() => loader?.id, [loader]);

  const toggleMenu = React.useCallback(() => {
    setMenuVisible(!menuVisible);
  }, [menuVisible]);

  const fireLoader = React.useCallback(async () => {
    showConfirm({
      title: 'Вы уверены?',
      onOk: async (e) => {
        await LoadersService.remove({ loaderId });
        await reloadLoader();
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
          title: t.buttons(loader?.onSickLeave ? 'restore' : 'tempStop'),
          icon: <IconDeprecated name={loader?.onSickLeave ? 'playOrange' : 'pauseOrange'} />,
          onAction: maintainanceAction,
        },
        // {
        //   title: t.buttons('fire'),
        //   disabled: loader?.uiState == 7,
        //   icon: <IconDeprecated name={'xOrange'} />,
        //   onAction: fireDriver,
        // },
      ],
    }),
    [menuVisible, loader?.onSickLeave, loader?.uiState],
  );

  const uiStateName = React.useMemo(() => {
    return (
      (driverUiStates.find((item) => item.id == loader?.uiState)?.title || '') +
      (loader?.activeOrderId ? ` №${loader?.activeOrderId?.id}` : '')
    );
  }, [loader?.uiState, loader?.activeOrderId]);

  const status = React.useMemo(
    () => ({
      type: UI_STATES[loader?.uiState || 0],
      name: uiStateName || '',
    }),
    [loader?.uiState, uiStateName],
  );
  return (
    <Page.Title
      onBack={goBack}
      extra={
        <>
          <div className="flexbox size-1 margin-left-12">
            <div className={'flexbox'}>
              <h3 className={'flexbox center'}>{'Подрядчик: ' + (loader?.producer?.title || '')}</h3>
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
      <div>{`${loader?.name} ${loader?.surname}`}</div>
      {loader?.uiState ? (
        <div className={'flexbox center margin-left-8'}>
          <span className={`circle status margin-left-10 ${status.type || 'default'}`} />
          <span className={'status-title margin-left-6'}>{status.name}</span>
        </div>
      ) : null}
      {/* {loader?.uiState === 3 || loader?.uiState === 4 ? (
        <div className={'buttons'}>{buttons}</div>
      ) : (
        null
      )} */}
    </Page.Title>
  );
}
export default LoaderHeader;
