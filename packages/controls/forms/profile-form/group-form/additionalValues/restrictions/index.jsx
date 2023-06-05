import { Ant, VzForm } from '@vezubr/elements';
import React, { useCallback, useMemo } from 'react';

const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const Restrictions = (props) => {
  const { requestGroupTypes, disabled, values = [], setValues } = props;
  const renderOptions = useMemo(() => {
    return requestGroupTypes?.map((el) => {
      return (
        <Ant.Select.Option disabled={values.find((item) => item.id === el.id)} key={el.id} value={el.id}>
          {el.title}
        </Ant.Select.Option>
      );
    });
  }, [requestGroupTypes, values]);

  const onChangeRestrictions = useCallback(
    (type, index, value) => {
      if (type === 'id' && !value) {
        onRemove(index);
        return;
      }
      const restrictionsInput = [...values];
      restrictionsInput[index] = { ...restrictionsInput[index], [type]: value };
      setValues(restrictionsInput);
    },
    [values],
  );

  const onRemove = useCallback(
    (index) => {
      const restrictionsInput = [...values.filter((el, elIndex) => index !== elIndex)];
      setValues(restrictionsInput);
    },
    [values],
  );

  const renderRestrictions = useMemo(() => {
    return requestGroupTypes?.map((el, index) => {
      if (index > 0 && !values[disabled ? index : index - 1]?.id) {
        return;
      }
      return (
        <>
          <VzForm.Col span={8}>
            <VzForm.Item label={'Тип ограничения'} disabled={disabled}>
              <Ant.Select
                placeholder={'Выберите тип'}
                allowClear={true}
                disabled={disabled}
                value={values[index]?.id}
                onChange={(e) => onChangeRestrictions('id', index, e)}
              >
                {renderOptions}
              </Ant.Select>
            </VzForm.Item>
          </VzForm.Col>
          {values[index]?.id && (
            <VzForm.Col span={4} className={'group-restrictions__value'}>
              <VzForm.Item label={'Значение'} disabled={disabled} error={!values[index]?.value ? 'Обязательно для заполнения' : ''}>
                <Ant.Input
                  allowClear={true}
                  disabled={disabled}
                  onChange={(e) => onChangeRestrictions('value', index, e.target.value)}
                  value={values[index]?.value}
                />
              </VzForm.Item>
            </VzForm.Col>
          )}
        </>
      );
    });
  }, [renderOptions, requestGroupTypes, values]);
  return <div className="group-restrictions">{renderRestrictions}</div>;
};


export default Restrictions;