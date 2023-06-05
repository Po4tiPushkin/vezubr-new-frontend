import React, { useState, useCallback, useMemo } from 'react';
import cn from 'classnames';
import { useDebouncedCallback } from 'use-debounce';
import { FILE_SIZE_LIMIT_IN_BYTES } from '../../contants';
import PropTypes from 'prop-types';
import { Ant, VzForm } from '@vezubr/elements';
import { openFileData } from "../../utils";
import { fileGetFileIconByType } from '@vezubr/common/utils'
import { getBase64, getDefaultAuthHeaders, getDefaultAction, prepareAction} from '../../utils';
import customRequest from '../../request';

const CLS = 'vz-form-field-upload';

const FormFieldUpload = (props) => {
  const {
    label,
    onRemove,
    className,
    accept,
    fileData: fileDataInput,
    error: errorInput,
    icon,
    action: actionInput,
    withCredentials,
    headers: headersInput,
    onChange,
    disabled = false,
    ...otherProps
  } = props;

  const [loading, setLoading] = useState(false);
  const [innerError, setInnerError] = useState(null);
  const [fileData, setFileData] = useState(fileDataInput || {});

  const error = innerError || errorInput;

  React.useEffect(() => {
    setFileData(fileDataInput || {})
  }, [fileDataInput])

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
      }

      if (file.status === 'error') {
        setInnerError(file.error);
        setLoading(false);
      }

      if (file.status === 'done') {
        const updatedFileData = {
          ...fileData,
          fileId: file?.response?.fileId,
          fileHash: file?.response?.fileHash,
          fileNameOrigin: file.name,
          fileType: file.type,
        };

        if (['image/jpeg', 'image/gif', 'image/png'].includes(file.type)) {
          const imageUrl = await getBase64(file.originFileObj);
          updatedFileData.preview = imageUrl;
        }

        if (!updatedFileData.fileName) {
          updatedFileData.fileName = file.name;
        }

        setInnerError(null);
        setLoading(false);
        setFileData(updatedFileData);
        if (onChange) {
          onChange(updatedFileData, fileData);
        }
      }
    },
    [fileData, onChange],
  );

  const handleRemove = useCallback(
    (e) => {
      e.preventDefault();
      if (onRemove) {
        onRemove(fileData);
      }
      if (!disabled) {
        setFileData({});
      }
      
    },
    [fileData],
  );

  const handlePreview = useCallback(
    (e) => {
      e.preventDefault();
      openFileData(fileData);
    },
    [fileData.preview, fileData.download],
  );

  const [onChangeDebounce] = useDebouncedCallback((updatedFileData, fileData) => {
    if (onChange) {
      onChange(updatedFileData, fileData);
    }
  }, 1000);

  const handleChangeFileName = useCallback(
    (e) => {
      const updatedFileData = {
        ...fileData,
        fileName: e.target.value,
      };
      setFileData(updatedFileData);
      onChangeDebounce(updatedFileData, fileData);
    },
    [fileData, onChange, onChangeDebounce],
  );

  const uploadViewButton = useMemo(() => {
    const title = !loading ? (fileData.fileId ? 'Посмотреть' : 'Прикрепить файл') : undefined;
    const icon = loading ? 'loading' : fileData.fileId ? icon || fileGetFileIconByType(fileData?.fileType) : 'plus';

    if (fileData.fileId && fileData.preview && fileData.fileType != "application/pdf") {
      return <img src={fileData.preview} alt="" title={title} className={`${CLS}__button-image`} />;
    }

    return (
      <span className={`${CLS}__button-icon`}>
        <Ant.Icon type={icon} title={title} />
      </span>
    );
  }, [fileData.fileId, fileData.preview, icon, loading]);

  const action = useMemo(() => (actionInput && prepareAction(actionInput)) || getDefaultAction(), [actionInput]);

  const headers = useMemo(() => {
    return {
      ...(withCredentials ? getDefaultAuthHeaders() : {}),
      ...headersInput,
    };
  }, [withCredentials, headersInput]);

  return (
    <div className={cn(`${CLS} ${disabled ? 'disabled' : ''}`, className, { 'field-has-error': error })}>
      {fileData.fileId && (
        <a className={`${CLS}__viewer`} onClick={handlePreview}>
          <span className={`${CLS}__viewer__wrap`}>
            <span className={`${CLS}__viewer__wrap__cell`}>{uploadViewButton}</span>
          </span>
        </a>
      )}

      {!fileData.fileId && !disabled && (
        <Ant.Upload
          {...otherProps}
          headers={headers}
          action={action}
          accept={accept}
          name={fileData?.fileName}
          customRequest={customRequest}
          withCredentials={withCredentials}
          listType="picture-card"
          className={`${CLS}__upload`}
          showUploadList={false}
          beforeUpload={beforeUpload}
          onChange={handleChange}
          disabled={disabled}
        >
          {uploadViewButton}
        </Ant.Upload>
      )}

      <div className={`${CLS}__elem ${disabled ? 'disabled' : ''}`}>
        {label && <div className={`${CLS}__label`}>{label}</div>}

        <div className={`${CLS}__content`}>
          <Ant.Input
            name={'fileName'}
            size={'small'}
            value={fileData.fileId ? fileData.fileName : ''}
            onChange={handleChangeFileName}
            placeholder={'Имя файла'}
            disabled={disabled}
          />
          <VzForm.TooltipError error={error} />
        </div>
      </div>
      {fileData.fileId && !disabled && (
        <a className={`${CLS}__button-delete`} title={'Удалить файл'} onClick={handleRemove}>
          <Ant.Icon type={'delete'} />
        </a>
      )}
    </div>
  );
};

FormFieldUpload.defaultProps = {
  accept: 'image/jpeg, image/gif, image/png, application/pdf, image/x-eps',
  withCredentials: true,
};

FormFieldUpload.propTypes = {
  label: PropTypes.string,
  error: VzForm.Types.ErrorItemProp,
  onlyIcon: PropTypes.bool,
  icon: PropTypes.string,
  fileData: PropTypes.shape({
    fileId: PropTypes.number,
    fileName: PropTypes.string,
    fileType: PropTypes.string,
    fileNameOrigin: PropTypes.string,
    preview: PropTypes.string,
    download: PropTypes.string,
  }),
  className: PropTypes.string,
  action: PropTypes.string,
  headers: PropTypes.object,
  withCredentials: PropTypes.bool,
  accept: PropTypes.string,
  onRemove: PropTypes.func,
  onChange: PropTypes.func,
};

export default FormFieldUpload;
