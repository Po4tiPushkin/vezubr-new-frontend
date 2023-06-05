import React, { useMemo } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import {
  documentNumberValidator,
  documentDateValidator,
} from './validate';

const FIELDS = {
  documentNumber: 'documentNumber',
  documentDate: 'documentDate',
}

export const validators = {
  [FIELDS.documentNumber]: (documentNumber) => documentNumberValidator(documentNumber, true),
  [FIELDS.documentDate]: (documentDate) => documentDateValidator(documentDate, true),
};

function GenerateDocsForm({ onSave, form, values = {}, accepted }) {
  const { getFieldDecorator, getFieldError } = form;

  const handleSubmit = (e) => {
    e.preventDefault();

    if (onSave) {
      onSave(form);
    }
  }

  const disabled = useMemo(() => {
    if (typeof accepted === 'boolean') return !accepted
    return false
  }, [accepted]);

  const inputStyle = useMemo(() => {
    if (disabled) return {style:{ backgroundColor : 'white' }, className:'label__disabled'}
    return {style:{}, className:''}
  }, [disabled])

  const rules = VzForm.useCreateAsyncRules(validators);

  return (
    <Ant.Form onSubmit={handleSubmit} >
      <VzForm.Group>
        <div><b>
          {disabled ?
          <Ant.Tooltip placement="right" title={t.registries('documentsFormHint')}>
           Сформировать Акт и Реестр для подтверждения с необходимой нумерацией {<Ant.Icon type={'info-circle'} />}
          </Ant.Tooltip>
          :
          'Сформировать Акт и Реестр для подтверждения с необходимой нумерацией'
          }
          </b></div>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item className={inputStyle.className} label={'Номер'} error={getFieldError(FIELDS.documentNumber)}>
              {getFieldDecorator(FIELDS.documentNumber, {
                rules: rules[FIELDS.documentNumber]('d'),
              })(
                <Ant.Input style={inputStyle.style} disabled={disabled} allowClear={true}/>
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item className={inputStyle.className} label={'Дата'} error={getFieldError(FIELDS.documentDate)}>
              {getFieldDecorator(FIELDS.documentDate, {
                rules: rules[FIELDS.documentDate]('d'),
              })(
                <Ant.DatePicker
                  style={inputStyle.style}
                  disabled={disabled}
                  placeholder={'дд.мм.гггг'}
                  allowClear={true}
                  format={['DD.MM.YYYY', 'YYYY.MM.DD']}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <Ant.Button ghost={disabled} disabled={disabled} type={'primary'}  htmlType="submit" >
              Сформировать документы для бухгалтерии
            </Ant.Button>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
    </Ant.Form>
  )
}

export default Ant.Form.create({ name: 'generate_docs_form' })(GenerateDocsForm);