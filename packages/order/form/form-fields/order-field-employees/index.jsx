import React, { useMemo, useCallback } from 'react';
import compose from '@vezubr/common/hoc/compose';
import withOrderFormFieldWrapper from '../../hoc/withOrderFormFieldWrapper';
import { ResponsibleEmployees } from '@vezubr/components';
import { Ant } from '@vezubr/elements';
const OrderFieldEmployees = (props) => {
  const { data = [], setValue, value = [], ...otherProps } = props;

  const onChange = useCallback((input) => {
    setValue(input.responsibleEmployees);
  }, []);

  const values = useMemo(() => {
    return { responsibleEmployees: value };
  }, [value]);

  return (
    <Ant.Collapse style={{ margin: 5 }}>
      <Ant.Collapse.Panel header="Ответственные за рейс">
        <ResponsibleEmployees data={data} values={values} onChange={onChange} {...otherProps} />
      </Ant.Collapse.Panel>
    </Ant.Collapse>
  );
};

export default compose([withOrderFormFieldWrapper])(OrderFieldEmployees);