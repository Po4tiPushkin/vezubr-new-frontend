import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { BargainListContext } from '../../../context';

function BargainTableRow({ className: classNameInput, ...props }) {
  const { store } = React.useContext(BargainListContext);

  const offerId = props['data-row-key'];
  const offer = store.getOfferById(offerId);
  const { isNew } = offer;

  const className = cn(classNameInput, 'bargain-table-row', { 'bargain-table-row--new': isNew });

  return <tr {...props} className={className} />;
}

export default observer(BargainTableRow);
