import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { OrderContext } from '../../context';
import { VzForm } from '@vezubr/elements';
import { Ant } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';

function OrderFieldTextarea(props) {
  const { placeholder, setValue, ...otherProps } = props;

  const onChange = React.useCallback(
    (e) => {
      const value = e.target.value;
      setValue(value);
    },
    [setValue],
  );

  return <Ant.Input.TextArea allowClear={true} {...otherProps} onChange={onChange} />;
}

OrderFieldTextarea.propTypes = {
  placeholder: PropTypes.string,
};

export default compose([withOrderFormFieldWrapper])(OrderFieldTextarea);
