import React from 'react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';

function OrderFieldText(props) {
  const { setValue, ...otherProps } = props;

  const onChange = React.useCallback(
    (e) => {
      const value = e.target.value;
      setValue(value);
    },
    [setValue],
  );

  return <Ant.Input allowClear={true} {...otherProps} onChange={onChange} />;
}

OrderFieldText.propTypes = {
  ...OrderFormFieldProps,
  placeholder: PropTypes.string,
};

export default compose([withOrderFormFieldWrapper])(OrderFieldText);
