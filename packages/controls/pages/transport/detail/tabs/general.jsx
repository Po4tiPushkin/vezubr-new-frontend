import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import React from 'react';
import moment from 'moment';
import Address from '@vezubr/elements/DEPRECATED/address/address';
import { useSelector } from 'react-redux';

function TransportGeneral(props) {
  const dictionaries = useSelector(state => state.dictionaries);
  const { transport } = props;
  let categories = ' ';

  if (Array.isArray(transport?.category)) {
    transport.category.forEach(el => {
      categories += ` ${dictionaries?.vehicleTypeCategories.find(item => item.id === el)?.title},`
    })
    categories = categories.slice(0, -1);
  }
  const tabData = [
    {
      title: t.trailer('generalInfo'),
      show: true,
      list: [
        {
          title: t.transports('table.categoryType'),
          value: categories,
        },
        {
          title: t.trailer('regNum'),
          value: transport?.plateNumber,
        },
        {
          title: t.order('exploatation'),
          value: transport?.exploitationStartDate && moment(transport.exploitationStartDate).format('DD.MM.YYYY'),
        },
        {
          title: 'VIN',
          value: transport?.vin,
        },
        {
          title: t.trailer('yom'),
          value: transport?.yearOfManufacture,
        },
        {
          title: t.trailer('markAndModel'),
          value: transport?.markAndModel,
        },
      ],
    },
    {
      title: t.transports('settings'),
      show: true,
      list: [
        {
          title: t.transports('table.craneCapacity'),
          value: transport?.craneCapacity ? transport.craneCapacity / 1000 : ''
        },
        {
          title: t.transports('table.craneLength'),
          value: transport?.craneLength ? transport.craneLength / 100 : ''
        },
        {
          title: 'Количество пассажиров',
          value: transport?.passengersCapacity || '-'
        }

      ]
    }
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
      {transport.nightParkingAddress ? (
        <div>
          <div className={'info-title'}>{t.common('location')}</div>
          <div className={'padding-16 padding-top-18'}>
            <Address
              style={{ background: '#fff' }}
              title={'Адрес базирования ТС'}
              fullAddress={transport.nightParkingAddress}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default TransportGeneral;
