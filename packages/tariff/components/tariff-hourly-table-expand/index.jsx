import React from 'react';
import { TariffTableConfigProps } from '../../form-components/tarif-table';
import withTariffHourlyStore from '../../hoc/withTariffHourlyStore';
import withConvertTariff from '../../hoc/withConvertTariff';
import compose from '@vezubr/common/hoc/compose';
import TariffHourlyTable from '../../forms/tariff-hourly-form/tariff-hourly-table';

function TariffHourlyTableExpand(props) {
  return <TariffHourlyTable {...props} />;
}

TariffHourlyTableExpand.propTypes = {
  tableConfig: TariffTableConfigProps,
};

export default compose([withConvertTariff, withTariffHourlyStore])(TariffHourlyTableExpand);
