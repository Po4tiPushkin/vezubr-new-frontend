import { Ant, Modal, VzForm } from '@vezubr/elements';
import cn from 'classnames';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import DocViewerForm from '../doc-viewer-form';

const CLS = 'doc-viewer-no-preview';

const DocViewerNoPreview = (props) => {
  const {
    label,
    value,
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
    validators,
  } = props;

  const [fileData, setFileData] = useState(fileDataInput || {});
  const [edit, setEdit] = useState(false);

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

  const handlePreviewClick = useCallback(
    (event) => {
      event.preventDefault();
      openEditor();
    },
    [fileData.fileId],
  );

  const formData = useMemo(() => ({ fileData }), [fileData]);

  return (
    <div className={cn(`${CLS}`, className, { 'field-has-error': error })}>

      <VzForm.Item label={label} >
        <Ant.Input  value={value} onFocus={(e) => {e.target.blur()}} onClick={handlePreviewClick}/>
      </VzForm.Item>


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

DocViewerNoPreview.propTypes = {
  label: PropTypes.string,
  error: VzForm.Types.ErrorItemProp,
  editable: PropTypes.bool,
  disabled: PropTypes.bool,
  value: PropTypes.string,
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

export default DocViewerNoPreview;
