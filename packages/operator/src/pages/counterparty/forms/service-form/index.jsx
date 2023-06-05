import React, { useCallback, useMemo, } from 'react';
import { Ant, ButtonDeprecated, VzForm } from '@vezubr/elements';

const ServiceForm = (props) => {
  const { contours = [], form, values, onSave } = props;
  const { getFieldError, getFieldDecorator, getFieldValue } = form;

  const contourOptions = useMemo(() => {
    return contours.map((contour) => {
      const value = contour.id;
      const key = value;
      const title = contour.title;
      return (
        <Ant.Select.Option key={key} value={value}>
          {title}
        </Ant.Select.Option>
      );
    });
  }, [contours]);

  const handleSave = useCallback(() => {
    if (onSave) {
      onSave(form)
    }
  }, [form, onSave])

  return (
    <div>
      <VzForm.Row>
        <VzForm.Col span={24}>
          <VzForm.Item
            label={'Контуры'}
          >
            {
              getFieldDecorator('contourIds', {
                initialValue: Array.isArray(values?.contourIds)
                  ? [...new Set(values?.contourIds)]
                  : values?.contourIds,
              })(
                <Ant.Select
                  mode={'multiple'}
                  allowClear={true}
                  optionFilterProp={'children'}
                  searchPlaceholder={'Выберите контуры'}
                >
                  {contourOptions}
                </Ant.Select>
              )
            }
          </VzForm.Item>
        </VzForm.Col>
      </VzForm.Row>
      <div>
        <Ant.Button onClick={handleSave}>
          Сохранить
        </Ant.Button>
      </div>
    </div>
  )
}

export default Ant.Form.create({})(ServiceForm);
