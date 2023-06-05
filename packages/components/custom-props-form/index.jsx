import React, { useEffect, useMemo, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { Ant, showError, VzForm, Loader } from '@vezubr/elements';
import ArrayComponent from './components/array-component';
const CustomPropertiesForm = (props) => {
  const { values = [], onSave, entityName, onChange: onChangeInput, disabled, withoutTitle, span = 24, id } = props;
  const [propertyValues, setPropertyValues] = useState([]);
  const customProperties = useSelector((state) =>
    state.customProperties.filter((item) => item.entityName == entityName),
  );
  useEffect(() => {
    const propertyValues = customProperties.map((el) => {
      const value = values?.find((item) => item.customProperty?.latinName == el.latinName || item.latinName == el.latinName)?.values
      return {
        latinName: el.latinName,
        values: (Array.isArray(value) && el.type !== 'array') ? value[0] || '' : (value || []).filter(item => item),
      };
    });
    setPropertyValues(propertyValues);
  }, []);
  const changed = useMemo(() => {
    if (!onSave) {
      return false;
    }
    let isChanged = false;
    propertyValues.forEach(el => {
      if (isChanged) {
        return;
      }

      const property = values?.find((item) => item.customProperty?.latinName === el.latinName || item.latinName === el.latinName);
      if (property?.customProperty?.type !== 'array' && !Array.isArray(el.values)) {
        return;
      }
      if (!property?.values) {
        isChanged = !!el?.values.filter(val => val).length;
        return;
      }

      if (property?.customProperty?.type === 'array' && !_.isEqual(el.values, property.values)) {
        isChanged = true;
      }
      else if (el.values?.[0] !== property.values?.[0]) {
        isChanged = true
      }
    })
    return isChanged;
  }, [values, propertyValues]);

  const onSubmit = useCallback(() => {
    if (onSave) {
      onSave(propertyValues.map(el => {
        if (!Array.isArray(el.values)) {
          el.values = [el.values];
        }
        return el;
      }));
    }
  }, [propertyValues]);

  const getOptions = useCallback((property) => {
    if (!property || !property.possibleValues) {
      return [];
    }
    return property.possibleValues.map((el) => (
      <Ant.Select.Option id={`${id}-${property.latinName}-${el.id}`} title={el.title} value={el.id} key={el.id}>
        {el.title}
      </Ant.Select.Option>
    ));
  }, []);

  const renderFields = useMemo(() => {
    return customProperties.map((el) => (
      <VzForm.Col key={el.id} span={span}>
        <VzForm.Item disabled={disabled} label={el.cyrillicName}>
          {
            el.type === 'array' ? (
              <ArrayComponent
                value={
                  Array.isArray(propertyValues.find((item) => el.latinName === item.latinName)?.values)
                    ?
                    propertyValues.find((item) => el.latinName === item.latinName).values
                    :
                    []
                }
                setValue={(e) => onChange(e, el.latinName)}
              />
            ) :
              el.type === 'multiple' ? (
                <Ant.Select
                  onChange={(e) => onChange(e, el.latinName)}
                  value={propertyValues.find((item) => el.latinName === item.latinName)?.values || ''}
                  disabled={disabled}
                  allowClear={true}
                  id={`${id}-${el.latinName}`}
                >
                  {getOptions(el)}
                </Ant.Select>
              ) : el.type === 'float' ? (
                <Ant.InputNumber
                  value={propertyValues.find((item) => el.latinName === item.latinName)?.values || ''}
                  disabled={disabled}
                  decimalSeparator={','}
                  formatter={(e) => String(e).replace(/[a-zA-Z]+/g, '')}
                  onChange={(e) => onChange((e || e === 0) ? String(e) : null, el.latinName)}
                  id={`${id}-${el.latinName}`}
                />
              ) : (
                <Ant.Input
                  value={propertyValues.find((item) => el.latinName === item.latinName)?.values || ''}
                  disabled={disabled}
                  onChange={(e) => onChange(e.target.value, el.latinName)}
                  id={`${id}-${el.latinName}`}
                />
              )}
        </VzForm.Item>
      </VzForm.Col>
    ));
  }, [propertyValues]);

  const onChange = useCallback(
    (value, name) => {
      setPropertyValues((prev) =>
        prev.map((el) => {
          if (el.latinName === name) {
            el.values = Array.isArray(value) ? value : [value];
          }
          if (!Array.isArray(el.values)) {
            el.values = [el.values]
          }
          return el;
        }),
      );
      if (onChangeInput) {
        onChangeInput(
          propertyValues.map((el) => {
            if (el.latinName === name) {
              el.values = Array.isArray(value) ? value : [value];
            }
            if (!Array.isArray(el.values)) {
              el.values = [el.values]
            }
            return el;
          }),
        );
      }
    },
    [propertyValues],
  );

  return (
    <>
      <VzForm.Group className={'custom-properties-form'} title={withoutTitle ? null : <h2 className="bold">Пользовательские поля</h2>}>
        <VzForm.Row>
          {renderFields}
        </VzForm.Row>
      </VzForm.Group>
      {onSave ? (
        <div className="flexbox margin-top-15" style={{ justifyContent: 'right' }}>
          <Ant.Button disabled={!changed} type={'primary'} onClick={() => onSubmit()}>
            Сохранить
          </Ant.Button>
        </div>
      ) : null}
    </>
  );
};

export default CustomPropertiesForm;