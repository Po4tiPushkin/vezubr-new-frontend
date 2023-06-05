import React from 'react';
import { TariffTableConfigProps } from '../../form-components/tarif-table';
import withConvertTariff from '../../hoc/withConvertTariff';
import withTariffLoadersStore from '../../hoc/withTariffLoadersStore';
import compose from '@vezubr/common/hoc/compose';
import TariffLoadersTable from '../../forms/tariff-loaders-form/tariff-loaders-table'

function TariffLoadersTableExpand(props) {
  return <TariffLoadersTable {...props} />;
}


export default compose([withConvertTariff, withTariffLoadersStore])(TariffLoadersTableExpand);
