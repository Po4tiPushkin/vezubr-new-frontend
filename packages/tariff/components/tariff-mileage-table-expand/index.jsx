import React from 'react';
import withConvertTariff from '../../hoc/withConvertTariff';
import compose from '@vezubr/common/hoc/compose';
import withTariffMileageStore from '../../hoc/withTariffMileageStore';
import TariffMileageTable from '../../forms/tariff-mileage-form/tariff-mileage-table';

function TariffMileageTableExpand(props) {
  return <TariffMileageTable {...props} />;
}

export default compose([withConvertTariff, withTariffMileageStore])(TariffMileageTableExpand);
