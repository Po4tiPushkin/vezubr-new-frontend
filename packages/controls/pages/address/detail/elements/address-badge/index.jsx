import React, { useContext } from 'react';
import AddressBadgeLabel from './label';
import AddressContext from '../../context';

function AddressTabBadge(props) {
  const { children, className = '', conditionBadge } = props;
  const context = useContext(AddressContext);
  const count = conditionBadge(context);

  return count ? (
    <AddressBadgeLabel count={count} className={className}>
      {children}
    </AddressBadgeLabel>
  ) : (
    children
  );
}

export default AddressTabBadge;