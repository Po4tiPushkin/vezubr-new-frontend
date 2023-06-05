import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import _get from 'lodash/get';
import moment from 'moment';
import React from 'react';

function DriverLicense(props) {
  const { driver } = props;

  const { driverLicenseExpired, driverLicenseWillExpire } = React.useMemo(() => {
    return {
      driverLicenseExpired: moment(driver?.driverLicenseExpiresAtDate).isBefore(moment().subtract(1, 'd')),
      driverLicenseWillExpire: moment().add(1, 'w').isAfter(moment(driver?.driverLicenseExpiresAtDate)),
    };
  }, [driver]);

  const sanitaryList = React.useMemo(
    () => [
      {
        title: t.common('medBook'),
        value: driver?.hasSanitaryBook ? t.common('yes') : t.common('no'),
      },
    ],
    [driver],
  );

  React.useEffect(() => {
    if (driver?.hasSanitaryBook) {
      sanitaryList.push({
        title: t.common('expireAt'),
        value: moment(driver?.sanitaryBookExpiresAtDate).format('DD/MM/YYYY'),
      });
    }
  }, [driver]);

  const tabData = [
    {
      title: t.common('medBook'),
      show: true,
      list: sanitaryList,
    },
    {
      title: t.driver('vu'),
      list: [
        {
          title: t.driver('vuScanFront'),
          value: _get(
            driver?.driverLicenseFrontSideFile?.files?.find((el) => el.isActual),
            'file',
          ),
          image: true,
        },
        {
          title: t.driver('vuScanBack'),
          value: _get(
            driver?.driverLicenseReverseSideFile?.files?.find((el) => el.isActual),
            'file',
          ),
          image: true,
        },
        {
          title: t.driver('lastName'),
          value: driver?.driverLicenseSurname,
        },
        {
          title: t.driver('firstName'),
          value: driver?.driverLicenseName,
        },
        {
          title: t.driver('patranomy'),
          value: driver?.driverLicensePatronymic,
        },
        {
          title: t.driver('birthday'),
          value: driver?.driverLicenseDateOfBirth
            ? Utils.formatDate(driver?.driverLicenseDateOfBirth, 'DD/MM/YYYY')
            : '',
        },
        {
          title: t.driver('pob'),
          value: driver?.driverLicensePlaceOfBirth,
        },
        {
          title: t.driver('serialAndNumberVu'),
          value: `${driver?.driverLicenseId}`,
        },
        {
          title: t.driver('issueBy'),
          value: driver?.driverLicenseIssuedBy,
        },
        {
          title: t.driver('issueDate'),
          value: driver?.driverLicenseIssuedAtDate
            ? Utils.formatDate(driver?.driverLicenseIssuedAtDate, 'DD/MM/YYYY')
            : '',
        },
        {
          title: t.driver('vuExpiredAT'),
          value: driver?.driverLicenseExpiresAtDate
            ? Utils.formatDate(driver?.driverLicenseExpiresAtDate, 'DD/MM/YYYY')
            : '',
          divClass: driverLicenseExpired ? 'driver__tabs--red' : driverLicenseWillExpire ? 'driver__tabs--orange' : '',
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
    </div>
  );
}

export default DriverLicense;
