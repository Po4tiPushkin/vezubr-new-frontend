import React from 'react';
import PropTypes from 'prop-types';
import compose from '@vezubr/common/hoc/compose';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';
import { Ant, Images } from '@vezubr/elements';

function OrderFieldSelectVehicleList(props) {
  const { name, placeholder, vehicleTypesList, value, setValue, searchPlaceholder, ...otherProps } = props;

  const innerDropDownContentRef = React.useRef(null);

  const dropdownRender = React.useCallback((menu) => <div ref={innerDropDownContentRef}>{menu}</div>, []);

  const options = React.useMemo(() => {
    return vehicleTypesList.map(({ id, name, orderPosition }, index) => {
      const value = id;
      const key = id;
      return (
        <Ant.Select.Option key={key} value={value} data-title={name}>          
          <div className={'order-field-select-vehicle-list__content'}>{name}</div>
        </Ant.Select.Option>
      );
    });
  }, [vehicleTypesList]);

  return (
    <Ant.Select
      allowClear={true}
      showSearch={true}
      optionFilterProp={'data-title'}
      {...otherProps}
      className={'order-field-select-vehicle-list'}
      dropdownClassName={'order-field-select-vehicle-list__dropdown'}
      dropdownRender={dropdownRender}
      value={value}
      placeholder={placeholder || 'Выберите тип ТС'}
      searchPlaceholder={searchPlaceholder || 'Выберите тип ТС'}
      onChange={setValue}
    >
      {options}
    </Ant.Select>
  );
}

OrderFieldSelectVehicleList.propTypes = {
  ...OrderFormFieldProps,
  placeholder: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  vehicleTypesList: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      orderPosition: PropTypes.number.isRequired,
    }),
  ),
};

export default compose([withOrderFormFieldWrapper])(OrderFieldSelectVehicleList);
