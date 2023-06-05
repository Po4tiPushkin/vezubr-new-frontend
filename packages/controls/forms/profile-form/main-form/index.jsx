import React, { useMemo, useCallback, useEffect } from 'react';
import t from '@vezubr/common/localization';
import { Ant, ButtonDeprecated, VzForm } from '@vezubr/elements';
import { Utils } from '@vezubr/common/common';
import { ContourLinks } from '@vezubr/components';
import InputMask from "react-input-mask";
import { DocViewerNoPreview } from "@vezubr/uploader";
import _isEqual from 'lodash/isEqual'
import _get from 'lodash/get'

const FIELDS = {
  id: 'id',
  addressLegal: 'addressLegal',
  inn: 'inn',
  kpp: 'kpp',
  addressFact: 'addressFact',
  fullName: 'fullName',
  name: 'name',
  addressPost: 'addressPost',
  phone: 'phone',
  vatRate: 'vatRate',
  taxationSystem: 'taxationSystem',
  stampUploaded: 'stampUploaded',
  signatureUploaded: 'signatureUploaded',
  isCostWithVat: 'isCostWithVat',
  ordinaryDocFlow: 'docFlowConfiguration.ordinaryDocFlow',
  electronicDocFlow: 'docFlowConfiguration.electronicDocFlow',
  edfOperator: 'docFlowConfiguration.edfOperator',
};

const IS_COST_WITH_VAT_OPTIONS = [
  {
    value: true,
    title: 'С НДС',
  },
  {
    value: false,
    title: 'Без НДС',
  },
]

const DOCUMENT_FLOW_OPERATORS = [
  {
    key: 0,
    value: 'astral',
    text: 'АСТРАЛ',
  },
];

const PHONE_PLACEHOLDER = '+7 (___) ___-__-__';
const PHONE_MASK = '+7 (999) 999-99-99';

const MainForm = (props) => {
  const {
    onSave,
    dictionaries,
    form,
    values,
    canViewStampAndSignature,
    edited
  } = props;
  const { taxationSystem, vatRate } = dictionaries;
  const { getFieldError, getFieldDecorator, getFieldValue } = form;
  const appIsClient = ['client', 'dispatcher'].includes(APP);

  // const [signatureFile, setSignatureFile] = React.useState(null)
  // const [stampFile, setStampFile] = React.useState(null)
  const [stampAndSignatureFile, setStampAndSignatureFile] = React.useState(null)

  const vatRateOptions = useMemo(
    () =>
      vatRate && vatRate.map((item) => (
        <Ant.Select.Option key={item?.id} value={item?.id}>
          {item?.title}
        </Ant.Select.Option>
      )) || null,
    [vatRate],
  );

  const documentFlowOperators = useMemo(
    () =>
      DOCUMENT_FLOW_OPERATORS.map((item) => (
        <Ant.Select.Option key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [DOCUMENT_FLOW_OPERATORS],
  );

  const taxationSystemOptions = useMemo(
    () =>
      taxationSystem && taxationSystem.map((item) =>
        <Ant.Select.Option key={parseInt(item?.id)} value={item?.id}>
          {item?.title}
        </Ant.Select.Option>
      ) || null,
    [taxationSystem],
  );

  const isCostWithVatOptions = useMemo(
    () =>
      IS_COST_WITH_VAT_OPTIONS && IS_COST_WITH_VAT_OPTIONS.map((item) =>
        <Ant.Select.Option key={parseInt(item?.value)} value={item?.value}>
          {item?.title}
        </Ant.Select.Option>
      ) || null,
    [IS_COST_WITH_VAT_OPTIONS],
  );

  const handleSave = useCallback(
    async (e) => {
      e.preventDefault();
      const files = {
        //// 
        //  Заготовка на будущее если будет запрос от бизнеса сделать два поля
        //
        // stampFile: stampFile ? {
        //   fileId: stampFile?.fileId,
        //   fileHash: stampFile?.fileHash
        // } : null,
        // signatureFile: signatureFile ? {
        //   fileId: signatureFile?.fileId,
        //   fileHash: signatureFile?.fileHash
        // } : null,
        //
        ////
        stampAndSignatureFile: stampAndSignatureFile ? {
          fileId: stampAndSignatureFile?.fileId,
          fileHash: stampAndSignatureFile?.fileHash
        } : null,
      }
      if (onSave) {
        await onSave(form, files);
        setStampAndSignatureFile(null)
      }
    },
    [
      form,
      onSave,
      // stampFile, 
      // signatureFile, 
      stampAndSignatureFile
    ]
  );

  const contours = (values?.contours || []).filter((contour) => contour.isManager === true);

  ////
  //  Заготовка на будущее если будет запрос от бизнеса сделать два поля
  // const stampFileValue = React.useMemo(() => {
  //   return values?.stampUploaded && !stampFile?.fileId ? 'Загружено' : stampFile?.fileId ? 'Ожидает сохранения формы' : 'Необходимо загрузить'
  // }, [values?.stampUploaded, stampFile?.fileId])

  // const signatureFileValue = React.useMemo(() => {
  //   return values?.signatureUploaded && !signatureFile?.fileId ? 'Загружено' : signatureFile?.fileId ? 'Ожидает сохранения формы' : 'Необходимо загрузить'
  // }, [values?.signatureUploaded, signatureFile?.fileId])
  //
  ////
  const stampAndSignatureFileValue = React.useMemo(() => {
    return values?.signatureUploaded && values?.stampUploaded && !stampAndSignatureFile?.fileId ? 'Загружено' : stampAndSignatureFile?.fileId ? 'Ожидает сохранения формы' : 'Необходимо загрузить'
  }, [values?.signatureUploaded, values?.stampUploaded, stampAndSignatureFile?.fileId])

  return (
    <div className={'flexbox size-1 column company-info__wrapper'}>
      <div className={'company-info'}>
        <h2 className={'company-info-title bold'}>{t.profile('companyInfoTitle')}</h2>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={'ID'} error={getFieldError(FIELDS.id)}>
              {getFieldDecorator(FIELDS.id, {
                initialValue: values?.[FIELDS.id] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('addressLegal')} error={getFieldError(FIELDS.addressLegal)}>
              {getFieldDecorator(FIELDS.addressLegal, {
                initialValue: values?.[FIELDS.addressLegal] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('inn')} error={getFieldError(FIELDS.inn)}>
              {getFieldDecorator(FIELDS.inn, {
                initialValue: values?.[FIELDS.inn] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('kpp')} error={getFieldError(FIELDS.kpp)}>
              {getFieldDecorator(FIELDS.kpp, {
                initialValue: values?.[FIELDS.kpp] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={t.profile('fullName')} error={getFieldError(FIELDS.fullName)}>
              {getFieldDecorator(FIELDS.fullName, {
                initialValue: values?.[FIELDS.fullName] || '',
              })(<Ant.Input placeholder={''} disabled={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={t.profile('shortName')} error={getFieldError(FIELDS.name)}>
              {getFieldDecorator(FIELDS.name, {
                initialValue: values?.[FIELDS.name] || '',
              })(<Ant.Input placeholder={''} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item
              label={`${t.profile('addressFact')} (${t.common('optional')})`}
              error={getFieldError(FIELDS.addressFact)}
            >
              {getFieldDecorator(FIELDS.addressFact, {
                initialValue: values?.[FIELDS.addressFact] || '',
              })(<Ant.Input placeholder={'Укажите адрес'} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={t.profile('addressPost')} error={getFieldError(FIELDS.addressPost)}>
              {getFieldDecorator(FIELDS.addressPost, {
                rules: [{ required: true, message: 'Обязательное поле' }],
                initialValue: values?.[FIELDS.addressPost] || '',
              })(<Ant.Input placeholder={'Укажите адрес'} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={t.profile('phone')} error={getFieldError(FIELDS.phone)}>
              {getFieldDecorator(FIELDS.phone, {
                rules: [{ required: true, message: 'Обязательное поле' }],
                initialValue: values?.[FIELDS.phone] || '',
              })(
                <InputMask mask={PHONE_MASK}>
                  <Ant.Input placeholder={PHONE_PLACEHOLDER} allowClear={true} />
                </InputMask>,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>

        {canViewStampAndSignature ? (
          <>
            <h2 className={'company-info-title margin-top-28 bold'}>Факсимиле печати и подписи для документов</h2>
            <VzForm.Row>
              {/* 560 - 24 */}
              <VzForm.Col span={12}>
                <DocViewerNoPreview
                  label={t.profile('profileStampAndSignature')}
                  disabled={true}
                  value={stampAndSignatureFileValue}
                  onChange={(docSaving) => {
                    setStampAndSignatureFile(docSaving);
                  }}
                  accept={'image/png, image/jpg, image/jpeg'}
                  viewButtonDownload={false}
                />
              </VzForm.Col>
              {/* <VzForm.Col span={12}>
                <DocViewerNoPreview
                  label={t.profile('profileStamp')}
                  disabled={true}
                  value={stampFileValue}
                  onChange={(docSaving) => {
                    setStampFile(docSaving);
                  }}
                  viewButtonDownload={false}
                />
              </VzForm.Col>

              <VzForm.Col span={12}>
                <DocViewerNoPreview
                  label={t.profile('profileSignature')}
                  disabled={true}
                  value={signatureFileValue}
                  onChange={(docSaving) => {
                    setSignatureFile(docSaving);
                  }}
                  viewButtonDownload={false}
                />
              </VzForm.Col> */}
            </VzForm.Row>
          </>
        ) : null}

        <h2 className={'company-info-title margin-top-28 bold'}>Система налогообложения</h2>
        <VzForm.Row>
          {/* novat 560 - 12 */}
          <VzForm.Col span={getFieldValue('vatRate') == 2 ? 8 : 12}>
            <VzForm.Item label={t.profile('nds')} error={getFieldError(FIELDS.vatRate)}>
              {getFieldDecorator(FIELDS.vatRate, {
                rules: [{ required: true, message: 'Обязательное поле' }],
                initialValue: !!parseInt(values?.[FIELDS.vatRate]) + 1 || null,
              })(
                <Ant.Select
                  placeholder={t.order('selectFromList')}
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                >
                  {vatRateOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          {/* novat 560 - 12 */}
          <VzForm.Col span={getFieldValue('vatRate') == 2 ? 8 : 12}>
            <VzForm.Item label={t.profile('whomSendOrder')} error={getFieldError(FIELDS.taxationSystem)}>
              {getFieldDecorator(FIELDS.taxationSystem, {
                rules: [{ required: true, message: 'Обязательное поле' }],
                initialValue: parseInt(values?.[FIELDS.taxationSystem]) || null,
              })(
                <Ant.Select
                  placeholder={'Выбрать из списка'}
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                >
                  {taxationSystemOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          {getFieldValue('vatRate') == 2 && (
            <VzForm.Col span={8}>
              {/* 560 - 12 */}
              <VzForm.Item label={t.profile('isCostWithVat')} error={getFieldError(FIELDS.isCostWithVat)}>
                {getFieldDecorator(FIELDS.isCostWithVat, {
                  initialValue: values?.['costWithVat'],
                })(<Ant.Select placeholder={'Выбрать из списка'}>{isCostWithVatOptions}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
          )}
        </VzForm.Row>

        <h2 className={'company-info-title margin-top-28 bold'}>Настройка документооборота</h2>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item disabled={true} label={'Бумажный документооборот'}>
              {getFieldDecorator(FIELDS.ordinaryDocFlow, {
                initialValue: true,
              })(
                <VzForm.FieldSwitch
                  disabled={true}
                  style={{ padding: '6px 7px' }}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  colorChecked={false}
                  checked={getFieldValue(FIELDS.ordinaryDocFlow) || false}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Электронный документооборот'}>
              {getFieldDecorator(FIELDS.electronicDocFlow, {
                initialValue:
                  typeof _get(values, FIELDS.electronicDocFlow) !== 'undefined'
                    ? _get(values, FIELDS.electronicDocFlow)
                    : false,
              })(
                <VzForm.FieldSwitch
                  style={{ padding: '6px 7px' }}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  colorChecked={false}
                  checked={getFieldValue(FIELDS.electronicDocFlow) || false}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
          {getFieldValue(FIELDS.electronicDocFlow) ? (
            <VzForm.Col span={8}>
              <VzForm.Item error={getFieldError(FIELDS.edfOperator)} required={true} label={'Оператор ЭДО'}>
                {getFieldDecorator(FIELDS.edfOperator, {
                  initialValue: _get(values, FIELDS.edfOperator),
                  rules: [{ required: true, message: 'Обязательное поле' }],
                })(<Ant.Select showSearch={true}>{documentFlowOperators}</Ant.Select>)}
              </VzForm.Item>
            </VzForm.Col>
          ) : null}
        </VzForm.Row>

        <ContourLinks
          title="Ссылки для регистрации контрагентов в ваши контуры"
          contours={contours}
          getRegisterLink={(code) =>
            window.API_CONFIGS.enter.url + 'contour-join' + Utils.toQueryString({ contourCode: code })
          }
        />
      </div>
      <div className={'bottom-wrapper flexbox justify-right'}>
        <ButtonDeprecated
          theme={'primary'}
          className={'semi-wide'}
          onClick={handleSave}
          disabled={!edited && !stampAndSignatureFile?.fileId}
        >
          {t.common('saveChanges')}
        </ButtonDeprecated>
      </div>
    </div>
  );
};

export default Ant.Form.create({
  onValuesChange: ({ setEdited, values }, changedValues) => {
    setEdited(!_isEqual(changedValues, values));
  },
})(MainForm);
