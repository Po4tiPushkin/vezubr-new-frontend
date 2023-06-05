import React from 'react';
import { observer } from 'mobx-react';
import { TariffContext } from '../../../context';
import { VzTable, VzForm } from '@vezubr/elements';

function TariffLoaderView(props) {
  const { loader } = props;
  const { store } = React.useContext(TariffContext);

  const renderWrapCell = (items) => <VzTable.Cell.TextOverflow>{items}</VzTable.Cell.TextOverflow>;

  return (
    <>
      {store.editable ? loader.specialityName : renderWrapCell(loader.specialityName)}
      {store.editable && <VzForm.TooltipError error={store.getLoaderError(loader.key)} />}
    </>
  );
}

export default observer(TariffLoaderView);
