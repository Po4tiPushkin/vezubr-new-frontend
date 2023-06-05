import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import _get from 'lodash/get';
import React from 'react';

function DriverPassport(props) {
  const { driver } = props;

  const tabData = [
    {
      title: t.driver('passport'),
      list: [
        {
          title: t.driver('passportScanFront'),
          value: _get(
            driver?.passportPhotoFile?.files?.find((el) => el.isActual),
            'file',
          ),
          image: true,
        },
        {
          title: t.driver('passportScanBack'),
          value: _get(
            driver?.passportRegistrationFile?.files?.find((el) => el.isActual),
            'file',
          ),
          image: true,
        },
        {
          title: t.driver('lastName'),
          value: driver?.surname,
          showSuggestions: 'surname',
        },
        {
          title: t.driver('firstName'),
          value: driver?.name,
          showSuggestions: 'name',
        },
        {
          title: t.driver('patranomy'),
          value: driver?.patronymic,
          showSuggestions: 'patronymic',
        },
        {
          title: t.driver('birthday'),
          value: driver?.dateOfBirth ? Utils.formatDate(driver?.dateOfBirth, 'DD/MM/YYYY') : '',
        },
        {
          title: t.driver('pob'),
          value: driver?.placeOfBirth,
        },
        {
          title: t.driver('regAddress'),
          value: driver?.registrationAddress,
        },
        {
          title: t.driver('issueDate'),
          value: driver?.passportIssuedAtDate ? Utils.formatDate(driver?.passportIssuedAtDate, 'DD/MM/YYYY') : 'Нет',
        },
        {
          title: t.driver('serialAndNumber'),
          value: `${driver?.passportId}`,
        },
        {
          title: t.driver('issueBy'),
          value: driver?.passportIssuedBy,
        },
        {
          title: t.driver('departmentCode'),
          value: driver?.passportUnitCode,
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

export default DriverPassport;
