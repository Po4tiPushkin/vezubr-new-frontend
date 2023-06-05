import React, { useMemo } from "react"
import _uniqBy from 'lodash/uniqBy';
import _get from 'lodash/get';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { beautifyNumber } from '@vezubr/common/utils'
import { useSelector } from "react-redux";
import { Comments, Ant, VzForm } from '@vezubr/elements';
import OrderViewGeneralComment from "../components/comment";
import { useHistory } from 'react-router-dom';
const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

const useOrderInfo = ({ order, requiredDocuments, dictionaries }) => {
  const { vehicleTypes } = dictionaries;
  const vehicleType = vehicleTypes?.find(item => item.id == order?.requiredVehicleTypeId)?.name || '-'
  const customProperties = useSelector((state) =>
    state.customProperties.filter((item) => item.entityName == 'order'),
  );
  const history = useHistory();
  const orderInfos = useMemo(() => {
    const requiredPasses = order?.requiredPassesIds?.map(el => dictionaries?.geozones[el]?.name)?.join(', ')


    const { assessedCargoValue } = order

    const globalInfo = [
      {
        title: t.order('requestNr'),
        value: order?.requestNr,
      },
      {
        title: t.order('orderDate'),
        value: Utils.formatDate(order?.startAtLocal),
      },
      {
        title: t.order('orderTime'),
        value: Utils.formatDate(order?.startAtLocal, 'HH:mm'),
      },
    ];

    let transportInfo = order?.type !== 2 ? [
      {
        title: t.order('vehicleType'),
        value: vehicleType || '-',
      },
      {
        title: t.order('bodyType'),
        value: (order.requiredBodyTypes
          ? Object.values(order.requiredBodyTypes)
            ?.map((el) => dictionaries?.vehicleBodies?.find(item => item.id === el)?.title)
            ?.join(', ')
          : dictionaries?.vehicleBodies?.[order.requiredBodyTypes]) || '-',
      },
      {
        title: 'Тип автоперевозки',
        value: order?.type === 2
          ? null
          : dictionaries?.vehicleTypeCategories?.find(item => item.id == order?.vehicleTypeCategory)?.title,
      },
    ] : [
      [
        {
          title: t.order('Кол-во специалистов'),
          value: _get(order, 'loadersCount') || '-',
        },
      ],
      [
        {}
      ]
    ];

    if (order?.type == 2 && Object.values(order?.requiredLoaderSpecialities || {}).length > 0) {
      Object.entries(order?.requiredLoaderSpecialities)?.map(([key, value], index) => {
        if (index % 2 == 0) {
          transportInfo[1].push({
            title: dictionaries.loaderSpecialities?.find(item => item.id == key)?.title,
            value: value || '-',
          })
        } else {
          transportInfo[0].push({
            title: dictionaries.loaderSpecialities?.find(item => item.id == key)?.title,
            value: value || '-',
          })
        }
      })
    }

    if (Object.values(order?.requiredBodyTypes || {})?.includes(2)) {
      transportInfo = [
        [
          ...transportInfo
        ],
        [
          {
            title: t.order('isThermograph'),
            value: _get(order, 'isThermograph') ? "Да" : "Нет"
          },
          {
            title: t.order('vehicleTemperatureMin'),
            value: _get(order, 'vehicleTemperatureMin')
          },
          {
            title: t.order('vehicleTemperatureMax'),
            value: _get(order, 'vehicleTemperatureMax')
          }
        ]
      ]
    }

    const additinalInfo =
      order.type === 2
        ? []
        : [
          [
            {
              title: t.order('needHydrolyf'),
              value: order?.hydroliftRequired ? t.common('yes') : t.common('no'),
            },
            {
              title: t.order('cargoVolume'),
              value: order?.cargoDeclaredVolume ? beautifyNumber(order?.cargoDeclaredVolume) : '-',
            },
            {
              title: t.order('cargoWeight'),
              value: order?.cargoDeclaredWeight ? beautifyNumber(order?.cargoDeclaredWeight) : '-',
            },
            {
              title: 'Санитарная обработка',
              value: _get(order, 'sanitaryPassportRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Наличие рохлы',
              value: _get(order, 'palletJackIsRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Нужна Цепь',
              value: _get(order, 'isChainRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Нужны Брезент',
              value: _get(order, 'isTarpaulinRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Нужны Сети',
              value: _get(order, 'isNetRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Деревянный пол',
              value: _get(order, 'isWoodenFloorRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Совместимость с рампой',
              value: _get(order, 'rampCompatibilityRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Водитель-грузчик',
              value: _get(order, 'isDriverLoaderRequired') ? t.common('yes') : t.common('no'),
            }
          ],
          [
            {
              title: t.order('transportPasses'),
              value: requiredPasses?.length ? requiredPasses : '-',
            },
            {
              title: t.order('sanBook'),
              value: _get(order, 'sanitaryBookRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: t.order('packageType'),
              value: order?.cargoPackagingType || '-',
            },
            {
              title: t.order('placesCount'),
              value: order?.cargoDeclaredPlacesCount || '-',
            },
            {
              title: 'Наличие угловых стоек',
              value: _get(order, 'isCornerPillarRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Наличие конников',
              value: _get(order, 'conicsIsRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Нужны Ремни',
              value: _get(order, 'isStrapRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Нужны Башмаки',
              value: _get(order, 'isWheelChockRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'GPS Мониторинг',
              value: _get(order, 'isGPSMonitoringRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Допельшток',
              value: _get(order, 'isDoppelstockRequired') ? t.common('yes') : t.common('no'),
            },
            {
              title: 'Вывоз упаковки',
              value: _get(order, 'isTakeOutPackageRequired') ? t.common('yes') : t.common('no'),
            },
          ],
        ];

    const moreInfo =
      [
        {
          title: t.order('orderId'),
          value: order?.clientNumber || '-',
        },
        {
          title: t.order('comments'),
          value: _get(order, 'comment'),
          comment: true,
        },
        {
          title: t.order('source'),
          value: _get(order, 'source'),
        },
        {
          title: 'Изменение и пропуск точек маршрута водителем',
          show: order?.type !== 2,
          value: order?.settings?.pointChangeType
            ? dictionaries?.orderSettingPointChangeType?.find(el => el.id === order.settings.pointChangeType)?.title
            :
            '-',
        }
      ];

    if (order.type === 2 && _get(order, 'clientComment')) {
      moreInfo.push({
        title: t.order('comments'),
        value: _get(order, 'clientComment'),
        comment: true,
      });
    };

    const prices = [
      {
        title: t.order('insuranceNeeded'),
        value:
          (APP === 'client' && order?.orderUiState?.state === 102 && order?.isInsuranceRequiredClient) ||
            _get(order, 'performers')?.[0]?.isInsuranceRequired
            ? t.common('yes')
            : t.common('no'),
      },
      {
        title: t.order('assessedCargoValue'),
        value: currencyFormat.format(assessedCargoValue / 100 || 0),
      },
      {
        title: t.order('cargoCategory'),
        value: dictionaries?.cargoTypes?.find((item) => item.id == order?.cargoCategoryId)?.title,
      },
    ];

    let docs = [];
    let current = null;
    requiredDocuments.forEach((item, index) => {
      const mod = index % 2;

      if (mod === 0) {
        current = {
          title: null,
          value: null,
        };
        docs.push(current);
      }

      if (mod > 0) {
        current.value = item.title;
      } else {
        current.title = item.title;
      }
    });

    const documentsInfo = order.type === 2 ? [] : [docs];

    const customPropertiesInfo = customProperties?.map(({ latinName, cyrillicName, possibleValues, type }) => {
      const value = order?.customProperties?.find(item => item.customProperty.latinName == latinName)?.values
      return {
        title: cyrillicName,
        value: value
          ?
          type === 'array' ?
            value.map(item => item).join('; ')
            :
            (possibleValues?.length > 0 ? possibleValues?.find(({ id }) => id == value)?.title : value?.[0]) || '-'
          :
          '-',
      }
    })


    const linkedOrderInfo = (linkedOrder, index) => ({
      title: `Рейс № ${index + 1}`,
      data: [
        {
          title: 'Номер рейса',
          titleClass: 'thin',
          value: linkedOrder?.orderNr,
          comment: true,
        },
        {
          title: 'Номер заявки',
          titleClass: 'thin',
          value: linkedOrder?.requestNr,
          comment: true,
        },
        ...[
          linkedOrder?.driverPhone
            ?
            {
              title: 'Номер водителя',
              titleClass: 'thin',
              value: linkedOrder?.driverPhone,
              comment: true,
            }
            :
            {}
        ],
        ...[
          linkedOrder?.loaderSpecialistPhone
            ?
            {
              title: 'Номер специалиста',
              titleClass: 'thin',
              value: linkedOrder?.loaderSpecialistPhone,
              comment: true,
            }
            :
            {}
        ],
        ...[
          linkedOrder?.plateNumber
            ?
            {
              title: 'Госномер',
              titleClass: 'thin',
              value: linkedOrder?.plateNumber,
              comment: true,
            }
            :
            {}
        ],
        {
          title: 'Адрес подачи',
          titleClass: 'thin',
          value: linkedOrder?.firstAddress,
          comment: true,
        },
        {
          title: 'Время подачи',
          titleClass: 'thin',
          value: linkedOrder?.toStartAt,
          comment: true,
        },
      ]
    })

    const linkedOrdersInfo = order?.linkedOrders.map((el, index) => linkedOrderInfo(el, index))
    let groupedOrdersInfo = [];
    current = null;
    order?.ownGroupedOrders.forEach((item, index) => {
      const mod = index % 2;

      if (mod === 0) {
        current = {
          title: null,
          value: null,
        };
        groupedOrdersInfo.push(current);
      }

      current[mod > 0 ? 'value' : 'title'] = <a onClick={() =>
        history.replace({
          pathname: `/orders/${item.orderId}/general`,
          search: '?goTo=relatedOrders',
          state: {
            back: {
              pathname: history.location.pathname,
            }
          }
        })
      }>
        {item.orderNr}
      </a>

    });

    const comments = [
      {
        single: true,
        value:
          <OrderViewGeneralComment />,
      }
    ]
    const infos = [
      {
        title: t.order('globalInfo'),
        data: globalInfo,
        column: false,
        key: 'general'
      },
      {
        title: order.type !== 2 ? t.order('transportInfo') : t.order('loadersInfo'),
        data: transportInfo,
        column: false,
        key: 'parameters'
      },
      {
        title: t.order('addresses'),
        data: [],
        column: true,
        key: 'address',
      },
      {
        title: t.order('additionalInfo'),
        data: additinalInfo,
        column: false,
        key: 'additional'
      },
      {
        title: t.order('documentsInfo'),
        data: documentsInfo,
        column: false,
        className: 'documents-info',
        key: 'documents'
      },
      {
        title: t.order('Стоимость, категория груза и страхование'),
        data: prices,
        column: false,
        key: 'insurance'
      },
      {
        title: t.common('more'),
        data: moreInfo,
        column: false,
        key: 'more'
      },
    ];

    if (customProperties?.length > 0) {
      infos.push({
        title: t.order('customProperties'),
        data: customPropertiesInfo,
        column: false,
        key: 'customProperties',
      });
    }

    if (order?.ownGroupedOrders.length) {
      infos.push({
        title: t.order('relatedOrders'),
        data: groupedOrdersInfo,
        column: false,
        className: 'grouped-orders-info',
        key: 'groupedOrders',
      });
    }

    if (order?.linkedOrders.length) {
      infos.push({
        title: 'Взаимосвязанные рейсы',
        data: [...linkedOrdersInfo],
        column: true,
        className: 'linked-orders-info',
        multipleInfos: true,
        key: 'linkedOrders',
      });
    }
    infos.push({
      title: 'Внутренние комментарии',
      data: comments,
      column: false,
      key: 'comments'
    })
    return infos;

  }, [order, requiredDocuments, dictionaries]);

  return orderInfos;

}

export default useOrderInfo;