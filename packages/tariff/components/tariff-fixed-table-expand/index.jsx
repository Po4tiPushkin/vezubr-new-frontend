import React from 'react';
import { TariffTableConfigProps } from '../../form-components/tarif-table';
import withConvertTariff from '../../hoc/withConvertTariff';
import compose from '@vezubr/common/hoc/compose';
import withTariffFixedStore from '../../hoc/withTariffFixedStore';
import TariffFixedTable from '../../forms/tariff-fixed-form/tariff-fixed-table';

function TariffFixedTableExpand(props) {
  return <TariffFixedTable {...props} />;
}

TariffFixedTableExpand.propTypes = {
  tableConfig: TariffTableConfigProps,
};

export default compose([withConvertTariff, withTariffFixedStore])(TariffFixedTableExpand);
