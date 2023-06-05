import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { Ant, ButtonDeprecated, VzForm } from '@vezubr/elements';
import * as Uploader from '@vezubr/uploader';
import {
  contractNumberValidator,
  paymentDelayValidator,
  typeAutomaticRegistersValidator,
  periodRegistersValidator,
  manualPeriodValidator,
  signedAtValidator,
  generatedDocsValidator,
} from './validate';

import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

const FIELDS = {
  contractNumber: 'contractNumber',
  signedAt: 'signedAt',
  expiresAt: 'expiresAt',
  paymentDelay: 'paymentDelay',
  scanDocument: 'scanDocument',
  file: 'file',
  defaultForBargain: 'defaultForBargain',
  defaultForClientRate: 'defaultForClientRate',
  clientRate: 'clientRate',
  periodRegisters: 'periodRegisters',
  typeAutomaticRegisters: 'typeAutomaticRegisters',
  manualPeriod: 'manualPeriod',
  attribute: 'attribute',
  comment: 'comment'
};

const TYPE_AUTOMATIC_REGISTERS = [
  {
    key: 0,
    value: 1,
    text: 'Включить все завершенные в отчетном периоде рейсы',
  },
  {
    key: 1,
    value: 2,
    text: 'Только рейсы с подтвержденными документами ГВ, Расчетами Заказчиком и полученными оригиналами у водителей',
  },
  {
    key: 2,
    value: 0,
    text: 'Автоматическое формирование Реестров отключено',
  },
];

const GENERATED_DOCUMENTS_TYPES = [
  {
    value: 'generated_doc_type_transport',
    text: 'По договору перевозки',
  },
  {
    value: 'generated_doc_type_expedition',
    text: 'По договору экспедиции',
  },
  {
    value: 'generated_doc_type_select',
    text: 'Выбирать в рейсе',
  },
];

export const validators = {
  [FIELDS.contractNumber]: (contractNumber) => contractNumberValidator(contractNumber, true),
  [FIELDS.signedAt]: (signedAt) => signedAtValidator(signedAt, true),
  [FIELDS.paymentDelay]: (paymentDelay) => paymentDelayValidator(paymentDelay),
  [FIELDS.periodRegisters]: (periodRegisters, values) =>
    values.typeAutomaticRegisters !== 0 && periodRegistersValidator(periodRegisters, true),
  [FIELDS.typeAutomaticRegisters]: (typeAutomaticRegisters) =>
    typeAutomaticRegistersValidator(typeAutomaticRegisters, true),
  [FIELDS.manualPeriod]: (manualPeriod, values) => manualPeriodValidator(manualPeriod, values.periodRegisters == 0),
};

const ContractForm = ({ onSave, onCancel, form, values = {}, disabled, contractTypes, loading = false }) => {
  const { getFieldError, getFieldDecorator, setFieldsValue, getFieldValue, getFieldsValue } = form;

  const rules = VzForm.useCreateAsyncRules(validators);
  const history = useHistory();
  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form);
      }
    },
    [form, onSave],
  );

  const { contourContractPeriodRegisterTypes } = useSelector((state) => state.dictionaries);

  const generatedDocumentsTypeOptions = React.useMemo(() => {
    return GENERATED_DOCUMENTS_TYPES.map((item) => [
      <Ant.Select.Option key={item.value} value={item.value}>
        {item.text}
      </Ant.Select.Option>,
    ]);
  }, []);

  const updatedFileAttached = useCallback(
    (fieldData) => {
      if (!fieldData.fileId) {
        return;
      }
      setFieldsValue({ [FIELDS.file]: fieldData });
    },
    [setFieldsValue],
  );

  const disabledStartDate = React.useCallback(
    (date) => {
      const valueFinishDate = getFieldValue(FIELDS.expiresAt);
      if (valueFinishDate) {
        return date.isAfter(valueFinishDate, 'date');
      }
    },
    [getFieldValue],
  );

  const disabledEndDate = React.useCallback(
    (date) => {
      const valueStartDate = getFieldValue(FIELDS.signedAt);
      if (valueStartDate) {
        return date.isBefore(valueStartDate, 'date');
      }
    },
    [getFieldValue],
  );

  const periodRegistersOptions = useMemo(() => {
    return contourContractPeriodRegisterTypes.map((item) => [
      <Ant.Select.Option key={item.id} value={item.id}>
        {item.title}
      </Ant.Select.Option>,
    ]);
  }, [contourContractPeriodRegisterTypes]);

  const typeAutomaticRegistersOptions = useMemo(() => {
    return TYPE_AUTOMATIC_REGISTERS.map((item) => [
      <Ant.Select.Option title={item.text} key={item.key} value={item.value}>
        {item.text}
      </Ant.Select.Option>,
    ]);
  }, [TYPE_AUTOMATIC_REGISTERS]);

  React.useEffect(() => {
    setFieldsValue({ [FIELDS.contractTypes]: Array.from(new Set(values.contractTypes)) });
  }, [values[FIELDS.contractTypes]]);

  return (
    <Ant.Form className="rate-form" layout="vertical" onSubmit={handleSubmit}>
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Номер договора'} error={getFieldError(FIELDS.contractNumber)}>
              {getFieldDecorator(FIELDS.contractNumber, {
                rules: rules[FIELDS.contractNumber](getFieldsValue()),
                initialValue: values?.[FIELDS.contractNumber],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Дата подписания'} error={getFieldError(FIELDS.signedAt)}>
              {getFieldDecorator(FIELDS.signedAt, {
                rules: rules[FIELDS.signedAt](getFieldsValue()),
                initialValue: values?.[FIELDS.signedAt],
              })(
                <Ant.DatePicker
                  placeholder={'дд.мм.гггг'}
                  disabled={disabled}
                  disabledDate={disabledStartDate}
                  allowClear={true}
                  format={'DD.MM.YYYY'}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item disabled={disabled} label={'Срок действия договора'} error={getFieldError(FIELDS.expiresAt)}>
              {getFieldDecorator(FIELDS.expiresAt, {
                rules: rules[FIELDS.expiresAt](getFieldsValue()),
                initialValue: values?.[FIELDS.expiresAt] || '',
              })(
                <Ant.DatePicker
                  placeholder={disabled ? 'Бессрочный' : 'дд.мм.гггг'}
                  disabled={disabled}
                  disabledDate={disabledEndDate}
                  allowClear={true}
                  format={'DD.MM.YYYY'}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        <VzForm.Row>

          <VzForm.Col span={8}>
            <VzForm.Item
              disabled={disabled}
              label={'Отсрочка платежа (дней)'}
              error={getFieldError(FIELDS.paymentDelay)}
            >
              {getFieldDecorator(FIELDS.paymentDelay, {
                rules: rules[FIELDS.paymentDelay](getFieldsValue()),
                initialValue: values?.[FIELDS.paymentDelay],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            {values?.[FIELDS.file] ? (
              <Uploader.FormFieldUpload
                label={'Загрузите договор (PDF)'}
                onChange={updatedFileAttached}
                fileData={{
                  fileType: 'application/pdf',
                  fileId: values?.[FIELDS.file].id,
                  fileNameOrigin: values?.[FIELDS.file].originalName,
                  fileName: values?.[FIELDS.file].originalName,
                  download: `${window.API_CONFIGS[APP].host.replace(/\/$/, '') + values?.[FIELDS.file]?.downloadUrl}`,
                }}
                disabled={disabled}
              />
            ) : (
              <Uploader.FormFieldUpload
                disabled={disabled}
                label={'Загрузите договор (PDF)'}
                onChange={updatedFileAttached}
              />
            )}
          </VzForm.Col>
          <VzForm.Col span={8}>
            {getFieldDecorator(FIELDS.file, {
              initialValue: values?.[FIELDS.file] || [],
            })(<Ant.Input type={'hidden'} />)}
          </VzForm.Col>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <VzForm.Item
              disabled={disabled}
              label={'Договор для рейсов по Ставкам '}
              error={getFieldError(FIELDS.defaultForClientRate)}
            >
              {getFieldDecorator(FIELDS.defaultForClientRate, {
                rules: rules[FIELDS.defaultForClientRate](getFieldsValue()),
                initialValue: values?.[FIELDS.defaultForClientRate] || false,
              })(
                <VzForm.FieldSwitch
                  checked={getFieldValue(FIELDS.defaultForClientRate)}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  disabled={disabled}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item
              disabled={disabled}
              label={'Договор для рейсов по Торгам'}
              error={getFieldError(FIELDS.defaultForBargain)}
              shortInfo={{
                type: 'tooltip',
                title: ''
              }}
            >
              {getFieldDecorator(FIELDS.defaultForBargain, {
                rules: rules[FIELDS.defaultForBargain](getFieldsValue()),
                initialValue: values?.[FIELDS.defaultForBargain] || false,
              })(
                <VzForm.FieldSwitch
                  checked={getFieldValue(FIELDS.defaultForBargain)}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  disabled={disabled}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col
            span={
              getFieldValue(FIELDS.periodRegisters) == 0 && getFieldValue(FIELDS.typeAutomaticRegisters) !== 0 ? 8 : 12
            }
          >
            <VzForm.Item
              disabled={disabled}
              className={'contract__form'}
              label={'Принцип автоматического формирования реестра'}
              error={getFieldError(FIELDS.typeAutomaticRegisters)}
            >
              {getFieldDecorator(FIELDS.typeAutomaticRegisters, {
                rules: rules[FIELDS.typeAutomaticRegisters](getFieldsValue()),
                initialValue: values?.configuration?.[FIELDS.typeAutomaticRegisters],
              })(
                <Ant.Select
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                  disabled={disabled}
                  dropdownStyle={{ width: '1000px !important' }}
                  dropdownMatchSelectWidth={false}
                  searchPlaceholder={'Выберите принцип автоматического формирования реестра'}
                >
                  {typeAutomaticRegistersOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col
            span={
              getFieldValue(FIELDS.periodRegisters) == 0 && getFieldValue(FIELDS.typeAutomaticRegisters) !== 0 ? 8 : 12
            }
          >
            <VzForm.Item
              disabled={disabled || getFieldValue(FIELDS.typeAutomaticRegisters) == 0}
              label={'Период формирования Реестров'}
              error={getFieldError(FIELDS.periodRegisters)}
            >
              {getFieldDecorator(FIELDS.periodRegisters, {
                rules: rules[FIELDS.periodRegisters](getFieldsValue()),
                initialValue: values?.configuration?.[FIELDS.periodRegisters]?.type,
              })(
                <Ant.Select
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                  disabled={disabled || getFieldValue(FIELDS.typeAutomaticRegisters) == 0}
                  searchPlaceholder={'Выберите период формирования Реестров'}
                >
                  {periodRegistersOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          {getFieldValue(FIELDS.periodRegisters) == 0 && getFieldValue(FIELDS.typeAutomaticRegisters) !== 0 ? (
            <VzForm.Col span={8}>
              <VzForm.Item
                disabled={disabled}
                label={'Интервал формирования реестра (дней)'}
                error={getFieldError(FIELDS.manualPeriod)}
              >
                {getFieldDecorator(FIELDS.manualPeriod, {
                  rules: rules[FIELDS.manualPeriod](getFieldsValue()),
                  initialValue: values?.configuration?.[FIELDS.periodRegisters]?.value,
                })(<Ant.Input placeholder={'Ручной период формирования'} disabled={disabled} allowClear={true} />)}
              </VzForm.Item>
            </VzForm.Col>
          ) : null}
        </VzForm.Row>
        <VzForm.Row >
          <VzForm.Col span={24}>
            <VzForm.Item
              label='Комментарий'
              error={getFieldError(FIELDS.comment)}
              disabled={disabled}
            >
              {getFieldDecorator(FIELDS.comment, {
                rules: rules[FIELDS.comment](getFieldValue()),
                initialValue: values?.comment
              })(<Ant.Input.TextArea disabled={disabled} placeholder={'Комментарий'} rows={2} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Actions>
        {onCancel && (
          <ButtonDeprecated
            onClick={onCancel}
            loading={loading}
            className={'semi-wide margin-left-16'}
            theme={'secondary'}
          >
            Отмена
          </ButtonDeprecated>
        )}

        {onSave && (
          <ButtonDeprecated
            loading={loading}
            onClick={handleSubmit}
            className={'semi-wide margin-left-16'}
            theme={'primary'}
          >
            Сохранить
          </ButtonDeprecated>
        )}
      </VzForm.Actions>
    </Ant.Form>
  );
};

ContractForm.propTypes = {
  values: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  disabled: PropTypes.bool,
  contractTypes: PropTypes.array,
};

export default Ant.Form.create({ name: 'contract_form' })(ContractForm);
