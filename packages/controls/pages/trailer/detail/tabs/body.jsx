import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import React from 'react';
import moment from 'moment';
import { useSelector } from 'react-redux';

function TrailerBody(props) {
  const { trailer } = props;

  const { vehicleBodies } = useSelector((state) => state.dictionaries);

  const tabData = [
    {
      title: t.trailer('bodyParams'),
      show: true,
      list: [
        {
          title: t.trailer('bodyType'),
          value: vehicleBodies?.find((item) => item.id === trailer?.bodyType)?.title,
        },
        {
          title: t.trailer('lifting'),
          value: trailer?.liftingCapacityInKg / 1000,
        },
        {
          title: t.trailer('palletCap'),
          value: `${trailer?.palletsCapacity}`,
        },
        {
          title: t.trailer('innerLength'),
          value: `${trailer?.bodyWidthInCm / 100}`,
        },
        {
          title: t.trailer('innerHeight'),
          value: `${trailer?.bodyHeightInCm / 100}`,
        },
        {
          title: t.trailer('innerWidth'),
          value: `${trailer?.bodyLengthInCm / 100}`,
        },
        {
          title: t.trailer('maxFromGround'),
          value: `${trailer?.heightFromGroundInCm / 100}`,
        },
        {
          title: t.trailer('volume'),
          value: `${trailer?.volume}`,
        },
        ...('liftingCapacityMin' in trailer
          ? [
              {
                title: t.order('liftingCapacityMin'),
                value: `${trailer?.liftingCapacityMin / 1000}`,
              },
            ]
          : []),
        ...('liftingCapacityMax' in trailer
          ? [
              {
                title: t.order('liftingCapacityMax'),
                value: `${trailer?.liftingCapacityMax / 1000}`,
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
          value: trailer?.sideLoadingAvailable ? t.common('yes') : t.common('no'),
        },
        {
          title: t.order('topLoading'),
          value: trailer?.topLoadingAvailable ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие гидроборта',
          value: trailer?.hasHydrolift ? t.common('yes') : t.common('no'),
        },
        {
          title: t.order('rosilyRequired'),
          value: trailer?.hasPalletsJack ? t.common('yes') : t.common('no'),
        },
        {
          title: t.order('fasteningRequired'),
          value: trailer?.hasFastening ? t.common('yes') : t.common('no'),
        },
        {
          title: t.order('hasConics'),
          value: trailer?.hasConics ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие цепи',
          value: trailer?.hasChain ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие ремней',
          value: trailer?.hasStrap ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие брезента',
          value: trailer?.hasTarpaulin ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие сети',
          value: trailer?.hasNet ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие башмаков',
          value: trailer?.hasWheelChock ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие деревянного пола',
          value: trailer?.hasWoodenFloor ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие допельштока',
          value: trailer?.hasDoppelstock ? t.common('yes') : t.common('no'),
        },
        {
          title: 'Наличие угловых стоек',
          value: trailer?.hasCornerPillar ? t.common('yes') : t.common('no'),
        },
        ...(trailer?.bodyType === 2
          ? [
              {
                title: 'Наличие термостата',
                value: trailer?.isThermograph ? t.common('yes') : t.common('no'),
              },
              {
                title: 'Минимальная температура',
                value: trailer?.temperatureMin || trailer?.temperatureMin === 0 ? trailer?.temperatureMin : '',
              },
              {
                title: 'Максимальная температура',
                value: trailer?.temperatureMax || trailer?.temperatureMax === 0 ? trailer?.temperatureMax : '',
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

export default TrailerBody;
