import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { OrderContext } from '../../context';
import { VzForm } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import withOrderFormFieldWrapper, { OrderFormFieldProps } from '../../hoc/withOrderFormFieldWrapper';

function OrderFieldSwitch(props) {
  const { store } = React.useContext(OrderContext);
  const { value, setValue, type = 'bool', ...otherProps } = props;

  const onChange = React.useCallback(
    (checked) => {
      setValue(type === 'number' ? (checked ? 1 : 0) : checked);
    },
    [type, setValue],
  );

  return <VzForm.FieldSwitch {...otherProps} checked={!!value} onChange={onChange} />;
}

OrderFieldSwitch.propTypes = {
  ...OrderFormFieldProps,
  type: PropTypes.oneOf(['number', 'bool']),
  checkedChildren: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  unCheckedChildren: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  checkedTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
  unCheckedTitle: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

export default compose([withOrderFormFieldWrapper])(OrderFieldSwitch);
