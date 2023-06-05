import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { OrderContext } from '../../context';
import OrderFieldSelect from '../../form-fields/order-field-select';

function OrderAdvancedFieldSelectBodyTypes(props) {
  const { store } = React.useContext(OrderContext);

  const { name, label, placeholder, searchPlaceholder, ...otherProps } = props;

  const { bodyGroup, bodyGroupsBodyTypes, bodyTypesAll } = store.data;

  let objectList = bodyTypesAll;

  if (bodyGroup && bodyGroupsBodyTypes[bodyGroup]) {
    objectList = {};
    for (const bodyTypeIdString of bodyGroupsBodyTypes[bodyGroup]) {
      objectList[bodyTypeIdString] = bodyTypesAll[bodyTypeIdString];
    }
  }

  return (
    <OrderFieldSelect
      placeholder={placeholder || 'Выберите тип кузова'}
      searchPlaceholder={searchPlaceholder || 'Тип кузова'}
      mode="multiple"
      label={label || 'Тип кузова'}
      {...otherProps}
      name={name}
      objectList={objectList}
    />
  );
}

OrderAdvancedFieldSelectBodyTypes.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
};

export default observer(OrderAdvancedFieldSelectBodyTypes);
