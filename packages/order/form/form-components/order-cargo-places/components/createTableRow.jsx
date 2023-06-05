import { useContext } from "react";
import React from 'react';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { OrderContext } from "../../../context";

export function createTableRow({ fieldNameStore, fieldNameAddressIn,  fieldNameAddressOut, }) {
  function TableRow({ className: classNameInput, ...props }) {
    const { store } = useContext(OrderContext);

    const cargoPlaceId = ~~props['data-row-key'];

    const item = store.getDataItem(fieldNameStore);
    const addressIn = item.get(cargoPlaceId)?.[fieldNameAddressIn];
    const addressOut = item.get(cargoPlaceId)?.[fieldNameAddressOut];

    const isFull = !!addressIn && !!addressOut;

    const className = cn(classNameInput, 'order-cargo-places__row', { 'order-cargo-places__row--full': isFull });

    return <tr {...props} className={className} />;
  }

  return observer(TableRow);
}


export default createTableRow;
