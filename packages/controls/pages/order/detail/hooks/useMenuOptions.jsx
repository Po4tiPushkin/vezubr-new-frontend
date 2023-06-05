import React, { useMemo } from 'react';
import t from '@vezubr/common/localization';
import { IconDeprecated, FilterButton, Ant } from '@vezubr/elements';
import { ReactComponent as Sharing_IconComponent } from '@vezubr/common/assets/img/icons/republishArrow.svg';
import { useSelector } from 'react-redux';
import * as Utils from '../utils';
const useMenuOptions = ({
  executionCancel,
  finishOrder,
  replaceTransportAndDriver,
  exportOrderToExcel,
  getContractReport,
  order = {},
  startOrder,
  cancelOrder,
  selectionStates,
  isVisible = false,
  cloneOrder,
  editOrder,
  bargainOfferMy,
  setShowRepublishModal,
  take,
  setAppoint,
  setAssignModal,
  user,
  setGroupModal,
  setShowMenuOptions,
  createBindLoader,
  setLinkModal
}) => {
  const dictionaries = useSelector((state) => state.dictionaries);
  const menuOptions = useMemo(() => {
    const listAction = (actions) => {
      setShowMenuOptions(false);
      actions();
    };
    const menuOpObject = {
      show: isVisible,
      arrowPosition: 'right',
      list: {
        startOrder: {
          title: t.buttons('Начать исполнение'),
          icon: <IconDeprecated name={'playOrange'} />,
          onAction: () => listAction(startOrder),
          id: 'order-start',
          disabled: false,
        },
        cancelOrder: {
          title: t.buttons('cancelOrder'),
          icon: <IconDeprecated name={'xOrange'} />,
          onAction: () => listAction(cancelOrder),
          disabled: false,
          id: 'order-cancel',
        },
        getContractReport: {
          title: t.buttons('getContractReport'),
          icon: <IconDeprecated name={'excelOrange'} />,
          disabled: false,
          onAction: () => listAction(getContractReport),
          id: 'order-contact-report',
        },
        replaceTransportAndDriver: {
          title: order.type !== 2 ? t.buttons('replaceTransportAndDriver') : t.buttons('replaceLoaders'),
          icon: <IconDeprecated name={'replaceOrangeSmall'} />,
          id: 'order-replace',
          disabled: false,
          onAction: () =>
            listAction(() => {
              setAppoint(false);
              setShowRepublishModal(false);
              setAssignModal(true);
            }),
        },
        executionCancel: {
          title: t.buttons('Отказаться от исполнения'),
          icon: <IconDeprecated name={'xOrange'} />,
          onAction: () => listAction(executionCancel),
          id: 'order-refuse',
          disabled: false,
        },
        finishOrder: {
          title: 'Завершить Рейс',
          icon: <IconDeprecated name={'wheelOrange'} />,
          onAction: () => listAction(finishOrder),
          id: 'order-finish',
          disabled: false,
        },
        editOrder: {
          title: t.buttons('editText'),
          icon: <IconDeprecated name={'editOrange'} />,
          onAction: () => listAction(editOrder),
          disabled: false,
          id: 'order-edit',
        },
        cloneOrder: {
          title: t.buttons('repeat'),
          icon: <IconDeprecated name={'repeatOrange'} />,
          onAction: () => listAction(cloneOrder),
          disabled: false,
          id: 'order-clone'
        },
        groupOrder: {
          title: 'Сгруппировать Рейсы',
          icon: <IconDeprecated name={'bindOrange'} />,
          onAction: () => listAction(() => setGroupModal(true)),
          id: 'order-bind',
          disabled: false,
        },
        linkOrder: {
          title: 'Связать Рейсы',
          icon: <IconDeprecated name={'bindOrange'} />,
          onAction: () => listAction(() => setLinkModal(true)),
          id: 'order-bind',
          disabled: false,
        },
        createBindLoader: {
          title: 'Создать Рейс ПРР',
          icon: <IconDeprecated name={'bindOrange'} />,
          onAction: () => listAction(createBindLoader),
          disabled: false,
          id: 'order-create-bind-loader'
        }
      },
    };
    const isBargain = order?.strategyType === 'bargain';
    const isBargainMyAccepted = bargainOfferMy?.offer?.status === 'accepted';

    if (APP === 'client') {
      delete menuOpObject.list.replaceTransportAndDriver;
      delete menuOpObject.list.startOrder;
      delete menuOpObject.list.executionCancel;
      delete menuOpObject.list.finishOrder;
    }

    if (APP === 'producer') {
      delete menuOpObject.list.cancelOrder;
      delete menuOpObject.list.cloneOrder;
      delete menuOpObject.list.editOrder;
      delete menuOpObject.list.getContractReport;
      delete menuOpObject.list.createBindLoader;
      delete menuOpObject.list.linkOrder;
    }

    if (order.type == 2) {
      delete menuOpObject.list.getContractReport;
      delete menuOpObject.list.createBindLoader;
    }

    // Получаем доступные опции меню в зависимости от ЛК
    const menuOptionsFilteredList = Utils.getMenuOptionsLK({ order, user, bargainOfferMy, dictionaries });

    // Создаем пустой список опций в меню
    let menuOpObjectFiltered = {};

    // Проходим по ключам основного списка опций
    Object.keys(menuOpObject.list).forEach((el) => {
      // Если опция есть в доступном списке
      if (Object.keys(menuOptionsFilteredList).includes(el)) {
        // Добавляем её в новый список
        menuOpObjectFiltered[el] = menuOpObject.list[el];
        menuOpObjectFiltered[el].disabled = menuOptionsFilteredList[el].disabled;
      }
    });

    // Присваиваем фильтрованный список основному
    menuOpObject.list = menuOpObjectFiltered;

    let actions = <></>;

    if (APP !== 'client') {
      actions = (
        <>
          {APP === 'dispatcher' && order?.orderUiState?.state === 102 && (
            <Ant.Button
              onClick={() => setShowRepublishModal(true)}
              type={'secondary'}
              className={'filter-button default rounded box-shadow republish-button'}
              id={'order-republish'}
            >
              <span className="icon-content">
                <Ant.Icon className={'republish-icon'} component={Sharing_IconComponent} />
                <p className="padding-right-12 padding-left-10 no-margin">{t.buttons('republishOrder')}</p>
              </span>
            </Ant.Button>
          )}
          {order?.id &&
            order?.orderUiState?.state === 102 &&
            !order?.isTaken &&
            order?.type !== 2 &&
            (!isBargain || (isBargain && isBargainMyAccepted)) && (
              <FilterButton
                icon={'auctionBlue'}
                onClick={() => take()}
                id={'order-take'}
                content={<p className={'padding-right-12 no-margin'}>{'Принять Обязательства'}</p>}
                className={'rounded margin-left-12 margin-right-12 box-shadow'}
              />
            )}
          {order?.orderUiState &&
            dictionaries.orderStageToStateMap[10].indexOf(order?.orderUiState?.state) > -1 &&
            order?.orderUiState?.state !== 201 &&
            (!isBargain || (isBargain && isBargainMyAccepted)) && (
              <Ant.Button
                type={'primary'}
                onClick={() => {
                  setShowRepublishModal(false);
                  setAppoint(true);
                  setAssignModal(true);
                }}
                id={'order-accept'}
                className={'rounded margin-left-12 margin-right-12 semi-wide'}
              >
                {t.buttons('Принять рейс')}
              </Ant.Button>
            )}
        </>
      );
    }

    const menuOp = {
      ...menuOpObject,
      list: Object.values(menuOpObject.list),
    };

    return [menuOp, actions];
  }, [
    order,
    cancelOrder,
    selectionStates,
    isVisible,
    cloneOrder,
    startOrder,
    editOrder,
    replaceTransportAndDriver,
    bargainOfferMy,
    dictionaries,
  ]);
  return menuOptions;
};

export default useMenuOptions;
