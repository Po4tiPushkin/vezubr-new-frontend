import { Ant, VzForm } from '@vezubr/elements';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
const OrderSpecialities = (props) => {
  const { loaderSpecialities = [], disabled, specs = [], setSpecs, loaderErrors } = props;
  const renderOptions = useMemo(() => {
    return loaderSpecialities.map((el) => {
      return (
        <Ant.Select.Option disabled={specs.find((item) => item.id === el.id)} key={el.id} value={el.id}>
          {el.title}
        </Ant.Select.Option>
      );
    });
  }, [loaderSpecialities, specs]);

  const onChangeSpec = useCallback(
    (type, index, value) => {
      if (type === 'id' && !value) {
        onRemove(index);
        return;
      }
      const specsInput = [...specs];
      specsInput[index] = { ...specsInput[index], [type]: value };
      setSpecs(specsInput);
    },
    [specs],
  );

  const onRemove = useCallback(
    (index) => {
      const specsInput = [...specs.filter((el, elIndex) => index !== elIndex)];
      setSpecs(specsInput);
    },
    [specs],
  );

  const renderSpecialities = useMemo(() => {
    return loaderSpecialities.map((el, index) => {
      if (index > 0 && !specs[disabled ? index : index - 1]?.id) {
        return;
      }
      return (
        <>
          <VzForm.Col span={4}>
            <VzForm.Item label={'Тип специализации'} disabled={disabled}>
              <Ant.Select
                placeholder={'Выберите тип'}
                allowClear={true}
                disabled={disabled}
                value={specs[index]?.id}
                onChange={(e) => onChangeSpec('id', index, e)}
              >
                {renderOptions}
              </Ant.Select>
            </VzForm.Item>
          </VzForm.Col>
          {specs[index]?.id && (
            <VzForm.Col span={2} className={'order-specs__count'}>
              <VzForm.Item label={'Кол-во'} disabled={disabled} error={loaderErrors?.[specs[index]?.id]}>
                <Ant.InputNumber
                  allowClear={true}
                  disabled={disabled}
                  precision={0}
                  min={0}
                  onChange={(value) => onChangeSpec('count', index, value)}
                  value={specs[index]?.count}
                />
              </VzForm.Item>
            </VzForm.Col>
          )}
        </>
      );
    });
  }, [renderOptions, specs]);
  return <div className="order-specs">{renderSpecialities}</div>;
};

export default OrderSpecialities;
