import { useMemo } from "react";
import { useCallback } from 'react';
import isEmpty from 'lodash/isEmpty';
import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Ant, showError, VzForm } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import FormFieldUpload from '../../form/form-field-upload';

const FIELDS = {
  fileData: 'fileData',
};

const validatorsDefault = {
  [FIELDS.fileData]: (fileData) => !fileData?.fileId && 'Загрузите файл',
};

function DocViewerForm(props) {
  const { form, onSubmit, onCancel, saving, validators: validatorsInput, data, headers, accept, action, icon, onlyIcon, withCredentials } = props;

  const { getFieldDecorator, setFieldsValue, getFieldValue, getFieldError } = form;

  const validators = useMemo(() => ({...validatorsDefault, ...validatorsInput}), [validatorsInput]);

  const rules = VzForm.useCreateAsyncRules(validators);

  const updatedFileAttached = useCallback(
    (fieldData) => {
      setFieldsValue({ [FIELDS.fileData]: fieldData });
    },
    [setFieldsValue, getFieldValue],
  );

  const removeFileAttached = useCallback(() => {
    setFieldsValue({ [FIELDS.fileData]: null });
  }, [setFieldsValue, getFieldValue]);

  const handleSave = React.useCallback(() => {
    if (onSubmit) {
      onSubmit(form);
    }
  }, [form, onSubmit]);

  const label = React.useMemo(() => {
    return 'Загруженный файл' + (accept ? ` (${accept.split(',').map(i => i.split('/')[1])})` : '')
  }, [accept])

  return (
    <div className={cn('doc-viewer-form')}>
      <VzForm.Group>
        <VzForm.Row>
          {getFieldDecorator(FIELDS.fileData, {
            rules: rules[FIELDS.fileData](),
            initialValue: data?.[FIELDS.fileData] || null,
          })(<Ant.Input type={'hidden'} />)}

          <VzForm.Col span={24}>
            <FormFieldUpload
              fileData={getFieldValue(FIELDS.fileData)}
              error={getFieldError(FIELDS.fileData)}
              label={label}
              onRemove={removeFileAttached}
              onChange={updatedFileAttached}
              action={action}
              headers={headers}
              accept={accept}
              onlyIcon={onlyIcon}
              icon={icon}
              withCredentials={withCredentials}
            />
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Actions className={'address-edit-form__actions'}>
        <Ant.Button type={'ghost'} onClick={onCancel}>
          {t.order('cancel')}
        </Ant.Button>

        <Ant.Button type={'primary'} onClick={handleSave} loading={saving}>
          Загрузить
        </Ant.Button>
      </VzForm.Actions>
    </div>
  );
}

DocViewerForm.propTypes = {
  data: PropTypes.object,
  form: PropTypes.object,
  onSubmit: PropTypes.func,
  onCancel: PropTypes.func,
  saving: PropTypes.bool,
  action: PropTypes.string,
  headers: PropTypes.object,
  accept: PropTypes.string,
  onlyIcon: PropTypes.bool,
  icon: PropTypes.string,
  validators: PropTypes.object,
  withCredentials: PropTypes.bool,
};

export default Ant.Form.create({ name: 'doc_viewer_form' })(DocViewerForm);
