import React, { useState } from 'react';
import { Ant, Modal } from '@vezubr/elements';
import { useCallback, useMemo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { VzForm } from '@vezubr/elements';
import { openFileData } from '../../utils';
import DocViewerForm from '../doc-viewer-form';
import { ReactComponent as Eye_IconComponent } from './eye.svg';
import { fileGetFileIconByType } from '@vezubr/common/utils';
import { Rotator } from '@vezubr/components';
import { Utils } from '@vezubr/common/common';
const CLS = 'doc-viewer';

const DocViewer = (props) => {
  const {
    label,
    onRemove,
    className,
    onlyIcon,
    action,
    fileData: fileDataInput,
    error,
    icon,
    withCredentials,
    headers,
    accept,
    onChange,
    editable,
    validators,
    viewButtonDownload,
    withPreview = true,
  } = props;

  const [fileData, setFileData] = useState(fileDataInput || null);
  const [edit, setEdit] = useState(false);
  const [rotate, setRotate] = useState(false);

  React.useEffect(() => {
    setFileData(fileDataInput)
  }, [fileDataInput])

  const titleView = 'Открыть файл';
  const titleAdd = 'Добавить файл';

  const closeEditor = useCallback(() => setEdit(false), []);
  const openEditor = useCallback(() => setEdit(true), []);

  const onSubmit = useCallback(async (form) => {
    const { errors, values } = await VzForm.Utils.validateFieldsFromAntForm(form);
    if (errors) {
      Ant.message.error('Исправьте ошибки в форме');
      return;
    }

    onChange(values.fileData, fileData);
    setFileData(values.fileData);

    closeEditor();

  }, [onChange, closeEditor, fileData]);

  const onView = useCallback(() => openFileData(fileData), [fileData]);

  const handlePreviewClick = useCallback(
    (event) => {
      event.preventDefault();
      if (fileData?.fileId) {
        onView();
      } else {
        openEditor();
      }
    },
    [onView, fileData?.fileId],
  );

  const handleRemoveClick = useCallback(
    (event) => {
      if (onRemove) {
        onRemove(fileData);
      }
      event.preventDefault();
    },
    [fileData, onRemove],
  );

  const handleViewClick = useCallback(
    (event) => {
      onView();
      event.preventDefault();
    },
    [onView],
  );

  const renderedPreview = useMemo(() => {
    if (fileData?.preview) {
      return <img src={fileData?.preview} alt="" className={`${CLS}__preview__image`} />;
    }
    const iconView = fileData?.fileType ? fileGetFileIconByType(fileData?.fileType) : 'plus';

    return (
      <span className={`${CLS}__preview__icon`}>
        <Ant.Icon type={iconView} />
      </span>
    );
  }, [fileData?.preview, fileData?.fileType]);

  const fileName = fileData?.fileName || fileData?.fileNameOrigin;

  const formData = useMemo(() => ({ fileData }), [fileData]);

  const goToRotator = React.useCallback(() => {
    window.open(
      `/rotator/?id=${fileData?.fileId}${
        Utils.queryString(fileData?.download)?.accessKey
          ? `&accessKey=${Utils.queryString(fileData?.download)?.accessKey}`
          : ''
      }${`&fileType=${fileData?.fileType?.replace('application/', '')}`}`,
      '_blank',
    );
  }, [fileData]);

  return (
    <div className={cn(`${CLS}`, className, { 'field-has-error': error })}>
      {withPreview &&
        <>
          <div
            title={fileData?.fileId ? titleView : titleAdd}
            className={`${CLS}__preview`}
            onClick={fileData?.fileId && !fileData.fileType.includes('pdf') ? goToRotator : openEditor}
          >
            {renderedPreview}
          </div>

          <div className={`${CLS}__info`}>
            {fileName &&
              <div
                className={`${CLS}__info__filename ${!fileData?.fileId ? CLS + '__info__filename__active' : ''}`}
                onClick={fileData?.fileId && !fileData.fileType.includes('pdf') ? goToRotator : openEditor}
              >
                {fileName}
              </div>
            }
            {label && <div className={`${CLS}__info__label`}>{label}</div>}
          </div>
        </>
      }

      <div className={`${CLS}__actions`}>
        {editable && fileData?.fileId && (
          <>
            <span title={'Удалить'} className={`${CLS}__actions__item`} onClick={handleRemoveClick}>
              <Ant.Icon type={'delete'} />
            </span>
            <span title={'Редактировать'} className={`${CLS}__actions__item`} onClick={openEditor}>
              <Ant.Icon type={'edit'} />
            </span>
          </>
        )}

        {(fileData?.preview || fileData?.download) && (
          <>
          <span title={'Скачать'} className={`${CLS}__actions__item`} onClick={handleViewClick}>
            <Ant.Icon type={'download'} />
          </span>
          {fileData.fileType.includes('pdf') && (
            <span title={titleView} className={`${CLS}__actions__item`} onClick={fileData?.fileId ? goToRotator : handleViewClick}>
              <Ant.Icon component={Eye_IconComponent} />
            </span>
          )}
          </>
        )}
      </div>

      <Modal
        title={'Загрузка файла'}
        width={400}
        visible={edit}
        centered={true}
        onCancel={closeEditor}
        destroyOnClose={true}
        footer={null}
      >
        <DocViewerForm
          data={formData}
          action={action}
          accept={accept}
          onCancel={closeEditor}
          onSubmit={onSubmit}
          onlyIcon={onlyIcon}
          headers={headers}
          validators={validators}
          icon={icon}
          withCredentials={withCredentials}
        />
      </Modal>
    </div>
  );
};

DocViewer.propTypes = {
  label: PropTypes.string,
  error: VzForm.Types.ErrorItemProp,
  editable: PropTypes.bool,
  viewButtonDownload: PropTypes.bool,
  fileData: PropTypes.shape({
    fileId: PropTypes.number,
    fileName: PropTypes.string,
    fileType: PropTypes.string,
    fileNameOrigin: PropTypes.string,
    preview: PropTypes.string,
    download: PropTypes.string,
  }),
  className: PropTypes.string,

  onRemove: PropTypes.func,
  onChange: PropTypes.func,

  validators: PropTypes.object,
  action: PropTypes.string,
  headers: PropTypes.object,
  accept: PropTypes.string,
  onlyIcon: PropTypes.bool,
  icon: PropTypes.string,
  withCredentials: PropTypes.bool,
};

export default DocViewer;
