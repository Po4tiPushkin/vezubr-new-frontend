import React, { useContext } from 'react';
import { observer, useObserver } from 'mobx-react';
import PropTypes from 'prop-types';
import { VzForm } from '@vezubr/elements';
import CustomPropertiesForm from '@vezubr/controls/forms/custom-props-form';
import compose from '@vezubr/common/hoc/compose';
import withOrderFormFieldWrapper from '../../hoc/withOrderFormFieldWrapper';
import { useSelector } from 'react-redux';
import { OrderContext } from '../../context';
function OrderCustomProperties(props) {
  const { disabled = false, setValue, value: valueInput } = props;
  const { store } = useContext(OrderContext)
  const customProperties = useSelector((state) =>
    state.customProperties.filter((item) => item.entityName == 'order'),
  );
  const onChange = React.useCallback(
    (value) => {
      setValue(value);
    },
    [valueInput],
  );

  const value = React.useMemo(() => valueInput, [valueInput]);
  const customPropertiesErrors = useObserver(() => store.getDataItem('customPropertiesErrors'))
  if (!customProperties.length) {
    return null;
  }

  return (
    <VzForm.Group title='Пользовательские поля:'>
      <CustomPropertiesForm
        values={value || []}
        errors={customPropertiesErrors || {}}
        onChange={onChange}
        entityName={'order'}
        disabled={disabled}
        withoutTitle={true}
        span={12}
        id={'order-customproperty'}
        showRequired={true}
      />
    </VzForm.Group>
  );
}

export default compose([withOrderFormFieldWrapper])(OrderCustomProperties);
