import React, { useMemo, useState, useContext } from 'react';
import {
  FilterButton,
  IconDeprecated
} from '@vezubr/elements';
import t from '@vezubr/common/localization'
import OrderViewContext from '../../context';
import { getMenuOptionsLK } from '../../utils';
import { useSelector } from 'react-redux';
const OrderViewMenu = (props) => {
  const { order, modal: { setShowModal }, actions } = useContext(OrderViewContext);
  const [showMenuOptions, setShowMenuOptions] = useState(false);
  const { user, dictionaries } = useSelector(state => state);
  const menuOptions = useMemo(() => {
    const listAction = (actions) => {
      setShowMenuOptions(false);
      actions();
    };
    const menuOpObject = {
      arrowPosition: 'right',
      list: {
        startOrder: {
          title: t.buttons('Начать исполнение'),
          icon: <IconDeprecated name={'playOrange'} />,
          onAction: () => listAction(actions.startOrder),
          id: 'order-start',
          disabled: false,
        },
        cancelOrder: {
          title: t.buttons('cancelOrder'),
          icon: <IconDeprecated name={'xOrange'} />,
          onAction: () => listAction(actions.cancelOrder),
          disabled: false,
          id: 'order-cancel',
        },
        getContractReport: {
          title: t.buttons('getContractReport'),
          icon: <IconDeprecated name={'documentStampOrange'} />,
          disabled: false,
          onAction: () => listAction(actions.getContractReport),
          id: 'order-contact-report',
        },
        replaceTransportAndDriver: {
          title: order.type !== 2 ? t.buttons('replaceTransportAndDriver') : t.buttons('replaceLoaders'),
          icon: <IconDeprecated name={'replaceOrangeSmall'} />,
          id: 'order-replace',
          disabled: false,
          onAction: () =>
            listAction(() => {
              setShowModal('assign');
            }),
        },
        executionCancel: {
          title: t.buttons('Отказаться от исполнения'),
          icon: <IconDeprecated name={'xOrange'} />,
          onAction: () => setShowModal('cancel'),
          id: 'order-refuse',
          disabled: false,
        },
        finishOrder: {
          title: 'Завершить Рейс',
          icon: <IconDeprecated name={'wheelOrange'} />,
          onAction: () => listAction(actions.finishOrder),
          id: 'order-finish',
          disabled: false,
        },
        editOrder: {
          title: t.buttons('editText'),
          icon: <IconDeprecated name={'editOrange'} />,
          onAction: () => listAction(actions.editOrder),
          disabled: false,
          id: 'order-edit',
        },
        cloneOrder: {
          title: t.buttons('repeat'),
          icon: <IconDeprecated name={'repeatOrange'} />,
          onAction: () => listAction(actions.cloneOrder),
          disabled: false,
          id: 'order-clone'
        },
        groupOrder: {
          title: 'Сгруппировать Рейсы',
          icon: <IconDeprecated name={'bindOrange'} />,
          onAction: () => listAction(() => setShowModal('grouped')),
          id: 'order-group',
          disabled: false,
        },
        linkOrder: {
          title: 'Связать Рейсы',
          icon: <IconDeprecated name={'bindOrange'} />,
          onAction: () => listAction(() => setShowModal('linked')),
          id: 'order-link',
          disabled: false,
        },
        createBindLoader: {
          title: 'Создать Рейс ПРР',
          icon: <IconDeprecated name={'bindOrange'} />,
          onAction: () => listAction(actions.createBindLoader),
          disabled: false,
          id: 'order-create-bind-loader'
        }
      },
    };


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
    const menuOptionsFilteredList = getMenuOptionsLK({ order, user, dictionaries });

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

    return {
      ...menuOpObject,
      list: Object.values(menuOpObject.list),
    };

  }, [order, actions])
  return (
    <FilterButton
      icon={'dotsBlue'}
      onClick={() => setShowMenuOptions(prev => !prev)}
      onClose={() => setShowMenuOptions(false)}
      className={'circle box-shadow margin-left-12'}
      withMenu={true}
      id={'order-menu'}
      menuOptions={{ ...menuOptions, show: showMenuOptions }}
    />
  )
}

export default OrderViewMenu;