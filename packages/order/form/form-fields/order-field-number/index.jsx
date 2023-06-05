import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import cn from 'classnames';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';

function OrderFieldNumber(props) {
  const { name, setValue, className, ...otherProps } = props;
  return <Ant.InputNumber {...otherProps} className={cn('order-field-number', className)} onChange={setValue} />;
}

OrderFieldNumber.propTypes = {
  ...OrderFormFieldProps,
  placeholder: PropTypes.string,
};

export default compose([withOrderFormFieldWrapper])(OrderFieldNumber);
