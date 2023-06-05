import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

function TransportBody(props) {
  const { transport } = props;

  const { vehicleBodies } = useSelector((state) => state.dictionaries);

  const tabData = [
    {
      title: t.trailer('bodyParams'),
      show: true,
      list: [
        {
          title: t.trailer('bodyType'),
          value: vehicleBodies?.find((item) => item.id === transport?.bodyType)?.title,
        },
        {
          title: t.trailer('lifting'),
          value: transport?.liftingCapacityInKg / 1000,
        },
        {
          title: t.trailer('palletCap'),
          value: `${transport?.palletsCapacity}`,
        },
        {
          title: t.trailer('innerLength'),
          value: `${transport?.bodyWidthInCm / 100}`,
        },
        {
          title: t.trailer('innerHeight'),
          value: `${transport?.bodyHeightInCm / 100}`,
        },
        {
          title: t.trailer('innerWidth'),
          value: `${transport?.bodyLengthInCm / 100}`,
        },
        {
          title: t.trailer('maxFromGround'),
          value: `${transport?.heightFromGroundInCm / 100}`,
        },
        {
          title: t.transports('table.volume'),
          value: `${transport?.volume}`,
        },
        ...('liftingCapacityMin' in transport
          ? [
              {
                title: t.order('liftingCapacityMin'),
                value: `${transport?.liftingCapacityMin / 1000}`,
              },
            ]
          : []),
        ...('liftingCapacityMax' in transport
          ? [
              {
                title: t.order('liftingCapacityMax'),
                value: `${transport?.liftingCapacityMax / 1000}`,
              },
            ]
          : []),
      ],
    },
    {
      title: t.trailer('settings'),
      show: true,
      list: [
        {
          title: t.order('sideLoading'),
          value: transport?.sideLoadingAvailable ? t.common('yes') : t.common('no'),
        },
        {
          title: t.order('topLoading'),
          value: transport?.topLoadingAvailable ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие гидроборта',
          value: transport?.hasHydrolift ? t.common('yes') : t.common('no'),
        },
        {
          title: t.order('rosilyRequired'),
          value: transport?.hasPalletsJack ? t.common('yes') : t.common('no'),
        },
        {
          title: t.order('fasteningRequired'),
          value: transport?.hasFastening ? t.common('yes') : t.common('no'),
        },
        {
          title: t.order('hasConics'),
          value: transport?.hasConics ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие цепи',
          value: transport?.hasChain ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие ремней',
          value: transport?.hasStrap ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие брезента',
          value: transport?.hasTarpaulin ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие сети',
          value: transport?.hasNet ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие башмаков',
          value: transport?.hasWheelChock ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие GPS датчика',
          value: transport?.hasGPSMonitoring ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие деревянного пола',
          value: transport?.hasWoodenFloor ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие допельштока',
          value: transport?.hasDoppelstock ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие угловых стоек',
          value: transport?.hasCornerPillar ? t.common('yes') : t.common('no'),
        },
        ...(transport?.bodyType === 2
          ? [
              {
                title: 'Наличие термостата',
                value: transport?.isThermograph ? t.common('yes') : t.common('no'),
              },
              {
                title: 'Минимальная температура',
                value: transport?.temperatureMin || transport?.temperatureMin === 0 ? transport?.temperatureMin : '',
              },
              {
                title: 'Максимальная температура',
                value: transport?.temperatureMax || transport?.temperatureMax === 0 ? transport?.temperatureMax : '',
              },
            ]
          : []),
      ],
    },
  ];

  return (
    <div key={0}>
      {tabData?.map((group, groupIndex) => {
        return (
          <div key={groupIndex}>
            <div className={'info-title'}>{group?.title}</div>
            <hr />
            <div className={'padding-16 padding-top-0'}>
              <OrderSidebarInfos data={group?.list || []} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default TransportBody;
