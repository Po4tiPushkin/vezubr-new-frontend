import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import React from 'react';
import moment from 'moment';
import Address from '@vezubr/elements/DEPRECATED/address/address';
function TrailerGeneral(props) {
  const { trailer, dictionaries } = props;
  const tabData = [
    {
      title: t.trailer('generalInfo'),
      show: true,
      list: [
        {
          title: t.transports('table.categoryType'),
          value: trailer?.category
            ? dictionaries?.vehicleTypeCategories.find((item) => item.id === trailer.category)?.title
            : '',
        },
        {
          title: t.trailer('regNum'),
          value: trailer?.plateNumber,
        },
        {
          title: 'VIN',
          value: trailer?.vin,
        },
        {
          title: t.trailer('yom'),
          value: trailer?.yearOfManufacture,
        },
        {
          title: t.trailer('markAndModel'),
          value: trailer?.markAndModel,
        },
      ],
    },
    {
      title: t.transports('settings'),
      show: true,
      list: [
        {
          title: t.transports('table.platformLength'),
          value: trailer?.platformLength ? trailer.platformLength / 100 : '',
        },
        {
          title: t.transports('table.platformHeight'),
          value: trailer?.platformHeight ? trailer.platformHeight / 100 : '',
        },
        {
          title: t.transports('table.arCount'),
          value: trailer?.carCount || '',
        },
        {
          title: t.transports('table.isCarTransporterCovered'),
          value: trailer?.isCarTransporterCovered ? t.common('yes') : t.common('no'),
        },
        {
          title: t.transports('table.compartmentCount'),
          value: trailer?.compartmentCount || '',
        },
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
      {trailer.nightParkingAddress ? (
        <div>
          <div className={'info-title'}>{t.common('location')}</div>
          <div className={'padding-16 padding-top-18'}>
            <Address
              style={{ background: '#fff' }}
              title={'Адрес базирования ТС'}
              fullAddress={trailer.nightParkingAddress}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TrailerGeneral;
