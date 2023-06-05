import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { OrderSidebarInfos } from '@vezubr/components';
import _get from 'lodash/get';
import React from 'react';

function LoaderPassport(props) {
  const { loader } = props;

  const tabData = [
    {
      title: t.driver('passport'),
      list: [
        {
          title: t.driver('passportScanFront'),
          value: _get(
            loader?.passportPhotoFile?.files?.find((el) => el.isActual),
            'file',
          ),
          image: true,
        },
        {
          title: t.driver('passportScanBack'),
          value: _get(
            loader?.passportRegistrationFile?.files?.find((el) => el.isActual),
            'file',
          ),
          image: true,
        },
        {
          title: t.driver('lastName'),
          value: loader?.surname,
          showSuggestions: 'surname',
        },
        {
          title: t.driver('firstName'),
          value: loader?.name,
          showSuggestions: 'name',
        },
        {
          title: t.driver('patranomy'),
          value: loader?.patronymic,
          showSuggestions: 'patronymic',
        },
        {
          title: t.driver('birthday'),
          value: loader?.dateOfBirth ? Utils.formatDate(loader?.dateOfBirth, 'DD/MM/YYYY') : '',
        },
        {
          title: t.driver('pob'),
          value: loader?.placeOfBirth,
        },
        {
          title: t.driver('regAddress'),
          value: loader?.registrationAddress,
        },
        {
          title: t.driver('issueDate'),
          value: loader?.passportIssuedAtDate ? Utils.formatDate(loader?.passportIssuedAtDate, 'DD/MM/YYYY') : 'Нет',
        },
        {
          title: t.driver('serialAndNumber'),
          value: `${loader?.passportId}`,
        },
        {
          title: t.driver('issueBy'),
          value: loader?.passportIssuedBy,
        },
        {
          title: t.driver('departmentCode'),
          value: loader?.passportUnitCode,
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

export default LoaderPassport;
