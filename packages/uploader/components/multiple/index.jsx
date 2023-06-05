import React, { useRef, useState } from 'react';
import { Ant } from '@vezubr/elements';
import { useCallback, useMemo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { FILE_SIZE_LIMIT_IN_BYTES } from '../../contants';
import customRequest from '../../request';
import { getBase64, getDefaultAction, getDefaultAuthHeaders, prepareAction } from '../../utils';

const CLS = 'doc-multiple-uploader';

const Multiple = (props) => {
  const { label, className, accept, action: actionInput, withCredentials, headers: headersInput, onChange } = props;

  const [loading, setLoading] = useState(false);
  const fileList = useRef(new Map());

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
      console.log('before upload', file);
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

  const action = useMemo(() => (actionInput && prepareAction(actionInput)) || getDefaultAction(), [actionInput]);

  const headers = useMemo(() => {
    return {
      ...(withCredentials ? getDefaultAuthHeaders() : {}),
      ...headersInput,
    };
  }, [withCredentials, headersInput]);

  const handleChange = useCallback(
    async (info) => {
      const { file } = info;

      const fileListMap = fileList.current;

      const currentFileInfo = fileListMap.get(file.uid) || { finished: false };

      if (file.status === 'uploading') {
        setLoading(true);
      }

      if (file.status === 'error') {
        currentFileInfo.finished = true;
        currentFileInfo.error = file.error;
      }

      if (file.status === 'done') {
        const fileData = {
          fileId: file?.response?.fileId,
          fileHash: file?.response?.fileHash,
          fileNameOrigin: file.name,
          fileType: file.type,
        };

        if (['image/jpeg', 'image/gif', 'image/png'].includes(file.type)) {
          const imageUrl = await getBase64(file.originFileObj);
          fileData.preview = imageUrl;
        }

        if (!fileData.fileName) {
          fileData.fileName = file.name;
        }

        currentFileInfo.fileData = fileData;
        currentFileInfo.finished = true;
      }

      if (['done', 'error', 'uploading'].includes(file.status)) {
        fileListMap.set(file.uid, currentFileInfo);
      }

      if (['done', 'error'].includes(file.status)) {
        const fileListArray = Array.from(fileListMap);
        const notFinished = fileListArray.find(([, { finished }]) => !finished);

        if (!notFinished) {
          setLoading(false);

          const filesData = fileListArray
            .filter(([, { error }]) => !error)
            .map(([, { fileData }]) => fileData);

          onChange(filesData);
        }
      }
    },
    [fileList, onChange],
  );

  return (
    <div className={cn(`${CLS}`, className)}>
      <Ant.Upload
        headers={headers}
        action={action}
        customRequest={customRequest}
        withCredentials={withCredentials}
        listType="picture-card"
        className={`${CLS}__upload`}
        showUploadList={false}
        beforeUpload={beforeUpload}
        onChange={handleChange}
        multiple={true}
      >
        <span className={`${CLS}__upload__icon`}>
          <Ant.Icon type={loading ? 'loading' : 'plus'} />
        </span>
      </Ant.Upload>

      <div className={`${CLS}__info`}>{label && <div className={`${CLS}__info__label`}>{label}</div>}</div>
    </div>
  );
};

Multiple.propTypes = {
  label: PropTypes.string,
  className: PropTypes.string,
  onChange: PropTypes.func,
  action: PropTypes.string,
  headers: PropTypes.object,
  accept: PropTypes.string,
  withCredentials: PropTypes.bool,
};

Multiple.defaultProps = {
  accept: 'image/jpeg, image/gif, image/png, application/pdf, image/x-eps',
  withCredentials: true,
};

export default Multiple;
