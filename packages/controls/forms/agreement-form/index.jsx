import t from '@vezubr/common/localization';
import { fileGetFileData } from '@vezubr/common/utils';
import { AssignAgreementToContract } from '@vezubr/components';
import AssignTariffToAgreement from '@vezubr/components/assign/assignTariffToAgreement';
import { Ant, ButtonDeprecated, showAlert, showError, VzForm } from '@vezubr/elements';
import { Contracts as ContractsService } from '@vezubr/services';
import * as Uploader from '@vezubr/uploader';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { agreementNumberValidator, agreementTypeValidator, contractTypeValidator, signedAtValidator } from './validate';

const FIELDS = {
  agreementNumber: 'agreementNumber',
  signedAt: 'signedAt',
  expiresAt: 'expiresAt',
  file: 'file',
  tariffId: 'tariffId',
  comment: 'comment',
};

export const validators = {
  [FIELDS.agreementNumber]: (agreementNumber) => agreementNumberValidator(agreementNumber, true),
  [FIELDS.signedAt]: (signedAt) => signedAtValidator(signedAt, true),
  [FIELDS.expiresAt]: (expiresAt) => signedAtValidator(expiresAt, false),
};

const AgreementForm = ({
  onSave,
  form,
  values = {},
  disabled,
  onCancel,
  contract,
  type = 'add',
  onDelete,
  goToTariff,
  contractorId,
  setReload,
  loading
}) => {
  const { getFieldError, getFieldDecorator, setFieldsValue, getFieldValue } = form;

  const dictionaries = useSelector((state) => state.dictionaries);
  const history = useHistory();
  const [showTariffs, setShowTariffs] = React.useState(false);
  const handleNewTariff = async (contractId) => {
    history.push(`/tariffs/add?contractId=${contract?.id}&agreementId=${+contractId}`);
  };

  const handleAssignTariff = React.useCallback(
    async (contractId, tariffId) => {
      try {
        await ContractsService.assignTariff({
          id: +contractId,
          tariff: tariffId,
        });
        setShowTariffs(false);
        showAlert({
          content: t.common('ДУ к договору было успешно создано'),
          onOk: () => history.push(`/contract/${contract?.id}`),
        });
      } catch (e) {
        showError(e)
      } finally {
        setShowTariffs(false)
      }
    },
    [],
  );
  
  const handleAssignLater = React.useCallback(
    () => {
      setShowTariffs(false);
      showAlert({
        content: t.common('ДУ к договору было успешно создано'),
        onOk: () => history.push(`/contract/${contract?.id}`),
      });
    },
    [],
  );

  const rules = VzForm.useCreateAsyncRules(validators);

  useEffect(() => {
    if (values?.[FIELDS.orderType]) {
      setFieldsValue({
        [FIELDS.orderType]: values?.[FIELDS.orderType],
      });
    }
  }, [values?.[FIELDS.orderType]]);

  const handleSubmit = React.useCallback(
    async (e) => {
      e.preventDefault();
      if (onSave) {
        const newId = await onSave(form);
        if (newId) {
          setShowTariffs(newId)
        }
      }
    },
    [form, onSave],
  );

  const updatedFileAttached = useCallback(
    (fieldData) => {
      if (!fieldData.fileId) {
        return;
      }

      setFieldsValue({ [FIELDS.file]: fieldData });
    },
    [setFieldsValue],
  );

  const disabledDate = (date, start) => {
    const valueStartDate = getFieldValue(FIELDS.signedAt);
    const valueFinishDate = getFieldValue(FIELDS.expiresAt);
    const dateIsAfterExpire = contract.expiresAt ? date.isAfter(moment(contract.expiresAt), 'date') : false;
    const dateIsBeforeSign = contract.signedAt ? date.isBefore(moment(contract.signedAt), 'date') : true;
    const dateIsBeforeStart = valueStartDate
      ? date.isBefore(moment(valueStartDate).add(1, 'day'), 'date')
      : dateIsBeforeSign;
    const dateIsAfterEnd = valueFinishDate
      ? date.isAfter(moment(valueFinishDate).add(-1, 'day'), 'date')
      : dateIsAfterExpire;
    if (start) {
      return dateIsBeforeSign || dateIsAfterEnd;
    } else {
      return dateIsBeforeStart || dateIsAfterExpire;
    }
  };

  const handleOrderType = useCallback((type) => {
    setFieldsValue({
      [FIELDS.contractType]: type === 'loaders_order' ? 'contract_loaders' : null,
    });
  }, []);

  return (
    <Ant.Form className="rate-form" layout="vertical" onSubmit={handleSubmit}>
      <VzForm.Group>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <VzForm.Item label={'Номер ДУ'} disabled={disabled} error={getFieldError(FIELDS.agreementNumber)}>
              {getFieldDecorator(FIELDS.agreementNumber, {
                rules: rules[FIELDS.agreementNumber]('d'),
                initialValue: values?.[FIELDS.agreementNumber],
              })(<Ant.Input placeholder={''} disabled={disabled} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={8}>
            <VzForm.Item label={'ДЕЙСТВИЕ ТАРИФА С'} disabled={disabled} error={getFieldError(FIELDS.signedAt)}>
              {getFieldDecorator(FIELDS.signedAt, {
                rules: rules[FIELDS.signedAt](),
                initialValue: values?.[FIELDS.signedAt],
              })(
                <Ant.DatePicker
                  placeholder={'дд.мм.гггг'}
                  disabledDate={(date) => disabledDate(date, true)}
                  disabled={disabled}
                  allowClear={true}
                  format={['DD.MM.YYYY', 'YYYY.MMM.DD']}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={8}>
            <VzForm.Item label={'ДЕЙСТВИЕ ТАРИФА ДО'} disabled={disabled} error={getFieldError(FIELDS.expiresAt)}>
              {getFieldDecorator(FIELDS.expiresAt, {
                rules: rules[FIELDS.expiresAt](),
                initialValue: null,
              })(
                <Ant.DatePicker
                  placeholder={'дд.мм.гггг'}
                  disabledDate={(date) => disabledDate(date, false)}
                  disabled={disabled}
                  allowClear={true}
                  format={['DD.MM.YYYY', 'YYYY.MMM.DD']}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>

          {/* {type === 'info' && values?.tariffId ? (
            <VzForm.Col span={12}>
              <button
                className={'vz-form-item'}
                onClick={() => goToTariff()}
                style={{ cursor: 'pointer', padding: '0', height: '100%', width: '100%' }}
              >
                <div className={'vz-form-item__label'}>Номер Тарифа</div>
                <div className={'ant-input'}>{values?.tariffId}</div>
              </button>
            </VzForm.Col>
          ) : (
            <></>
          )} */}
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <Uploader.FormFieldUpload
              label={'СКАН ДОКУМЕНТА (ПРИ НАЛИЧИИ)'}
              onChange={updatedFileAttached}
              fileData={getFieldValue(FIELDS.file)}
            />
          </VzForm.Col>
        </VzForm.Row>
        
        <VzForm.Row>
          <VzForm.Col span={24}>
            <VzForm.Item label="Комментарий" error={getFieldError(FIELDS.comment)}>
              {getFieldDecorator(FIELDS.comment, {
                rules: rules[FIELDS.comment](),
                initialValue: values?.comment,
              })(<Ant.Input.TextArea placeholder={'Комментарий'} rows={2} />)}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col span={12}>
            {getFieldDecorator(FIELDS.file, {
              initialValue: values?.[FIELDS.file] || [],
            })(<Ant.Input type={'hidden'} />)}
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>
      <VzForm.Actions>
        {onCancel && (
          <ButtonDeprecated loading={loading} onClick={onCancel} className={'semi-wide margin-left-16'} theme={'secondary'}>
            Отмена
          </ButtonDeprecated>
        )}
        {onDelete && (
          <ButtonDeprecated loading={loading} onClick={() => onDelete()} className={'semi-wide margin-left-16'} theme={'danger'}>
            Удалить
          </ButtonDeprecated>
        )}
        {onSave && (
          <ButtonDeprecated loading={loading} onClick={handleSubmit} className={'semi-wide margin-left-16'} theme={'primary'}>
            Сохранить
          </ButtonDeprecated>
        )}
        {type === 'info' && contractorId && !values?.mainContract && (
          <AssignAgreementToContract
            setReload={setReload}
            contractorId={contractorId}
            agreementId={values?.id}
            style={{ minWidth: '216px', marginTop: '0' }}
            size={'big'}
            type={'primary'}
          />
        )}
      </VzForm.Actions>
      <AssignTariffToAgreement
        showTariffs={showTariffs}
        setShowTariffs={setShowTariffs}
        handleNewTariff={handleNewTariff}
        contractorId={contract?.createdContractorId}
        id={contract?.id}
        handleAssignTariff={handleAssignTariff}
        handleAssignLater={handleAssignLater}
      />
    </Ant.Form>
  );
};

AgreementForm.propTypes = {
  values: PropTypes.object,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
  form: PropTypes.object,
  disabled: PropTypes.bool,
  agreementTypes: PropTypes.array,
};

export default Ant.Form.create({ name: 'agreement_form' })(AgreementForm);
