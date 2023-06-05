import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import compose from '@vezubr/common/hoc/compose';
import { Ant } from '@vezubr/elements';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';

function OrderFieldTreeSelect(props) {
  const { name, setValue, children, ...otherProps } = props;
  return (
    <Ant.TreeSelect {...otherProps} onChange={setValue}>
      {children}
    </Ant.TreeSelect>
  );
}

OrderFieldTreeSelect.propTypes = {
  ...OrderFormFieldProps,
};

export default compose([withOrderFormFieldWrapper])(OrderFieldTreeSelect);
