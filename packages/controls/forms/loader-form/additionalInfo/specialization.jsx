import { Ant, VzForm } from '@vezubr/elements';
import moment from 'moment';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux'
const SpecializationsAdditional = (props) => {
  const { specs = [], setSpecs, loaderSpecialities, error } = props;
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
      if (index > 0 && !specs[index - 1]?.id) {
        return;
      }

      const dictEl = loaderSpecialities?.find(item => specs[index]?.id == item.id)

      return (
        <VzForm.Row key={el.id}>
          <VzForm.Col span={12}>
            <VzForm.Item error={error} label={'Тип специализации'}>
              <Ant.Select
                placeholder={'Выберите тип специализации'}
                allowClear={true}
                value={specs[index]?.id || null}
                onChange={(e) => onChangeSpec('id', index, e)}
              >
                {renderOptions}
              </Ant.Select>
            </VzForm.Item>
          </VzForm.Col>
          {specs[index]?.id && (
            <VzForm.Col span={12}>
              <VzForm.Item
                label={'Документ о квалификации годен до'}
                disabled={!dictEl?.isLicenseRequired}
                error={(dictEl?.isLicenseRequired && !specs[index]?.expiresOnDate) ? 'Обязательное поле' : ''}
              >
                <Ant.DatePicker
                  allowClear={true}
                  placeholder={'дд.мм.гггг'}
                  disabled={!dictEl?.isLicenseRequired}
                  format={'DD.MM.YYYY'}
                  onChange={(e) => onChangeSpec('expiresOnDate', index, e ? e.format('YYYY-MM-DD') : e)}
                  value={specs[index]?.expiresOnDate ? moment(specs[index]?.expiresOnDate) : null}
                />
              </VzForm.Item>
            </VzForm.Col>
          )}
        </VzForm.Row>
      );
    });
  }, [loaderSpecialities, renderOptions, specs, error]);
  return <div>{renderSpecialities}</div>;
};

export default SpecializationsAdditional;
