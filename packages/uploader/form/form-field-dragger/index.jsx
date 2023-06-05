import React, { useState, useCallback, useMemo } from 'react';
import cn from 'classnames';
import { FILE_SIZE_LIMIT_IN_BYTES } from '../../contants';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import { getDefaultAuthHeaders, getDefaultAction, prepareAction } from '../../utils';
import customRequest from '../../request';

const CLS = 'vz-form-field-dragger';

const FormFieldDragger = (props) => {
  const {
    className,
    accept,
    error: errorInput,
    action: actionInput,
    withCredentials,
    headers: headersInput,
    onChange,
    children,
    ...otherProps
  } = props;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(errorInput);

  const accepts = useMemo(
    () =>
      accept
        .split(',')
        .map((f) => f.trim())
        .filter((f) => !!f),
    [accept],
  );

  const beforeUpload = useCallback(
    (file) => {
      const isAccept = accepts.includes(file.type);
      if (!isAccept) {
        Ant.message.error('Неподдерживаемый тип файла');
      }

      const isAllowableSize = file.size < FILE_SIZE_LIMIT_IN_BYTES;

      if (!isAllowableSize) {
        Ant.message.error('Файл превышает допустимый размер в ' + ~~(FILE_SIZE_LIMIT_IN_BYTES / 1024 / 1024) + 'Мб');
      }

      return isAccept && isAllowableSize;
    },
    [accepts],
  );

  const handleChange = useCallback(
    async (info) => {
      const { file } = info;

      if (file.status === 'uploading') {
        setLoading(true);
      } else if (file.status === 'error') {
        setError(file.error);
        setLoading(false);
      } else if (file.status === 'done') {
        setError(null);
        setLoading(false);
      }

      if (onChange) {
        onChange(info, file.status);
      }
    },
    [onChange],
  );

  const action = useMemo(() => (actionInput && prepareAction(actionInput)) || getDefaultAction(), [actionInput]);

  const headers = useMemo(() => {
    return {
      ...(withCredentials ? getDefaultAuthHeaders() : {}),
      ...headersInput,
    };
  }, [withCredentials, headersInput]);

  return (
    <div
      className={cn(`${CLS}`, className, {
        'field-has-error': error,
      })}
    >
      <Ant.Upload.Dragger
        {...otherProps}
        headers={headers}
        action={action}
        customRequest={customRequest}
        withCredentials={withCredentials}
        className={`${CLS}__dragger`}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
      >
        {children}
      </Ant.Upload.Dragger>

      {loading && (
        <div className={`${CLS}__loader`}>
          <Ant.Icon type="loading" />
        </div>
      )}
    </div>
  );
};

FormFieldDragger.defaultProps = {
  accept: 'image/jpeg, image/gif, image/png, application/pdf, image/x-eps',
  withCredentials: true,
};

FormFieldDragger.propTypes = {
  error: VzForm.Types.ErrorItemProp,
  className: PropTypes.string,
  action: PropTypes.string,
  headers: PropTypes.object,
  withCredentials: PropTypes.bool,
  accept: PropTypes.string,
  onChange: PropTypes.func,
  children: PropTypes.node,
};

export default FormFieldDragger;
