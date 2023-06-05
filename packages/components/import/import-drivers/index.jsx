import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { Ant, showAlert, showError } from '@vezubr/elements';
import * as Uploader from '@vezubr/uploader';
import templateUrl from '@vezubr/common/assets/templates/Импорт водителей (шаблон).csv';
import ImportError from '../import-error';

const ImportDrivers = (props) => {
  const { onOk, action } = props;

  const handleChange = useCallback(
    (info, status) => {
      if (status === 'error') {
        showError(info?.file?.error);
      } else if (status === 'done') {
        const pasteErrors = info?.file?.response?.pasteErrors;

        if (pasteErrors && pasteErrors.length > 0) {
          showError(null, {
            content: <ImportError pasteErrors={pasteErrors} />,
          });
          return;
        }

        showAlert({
          content: 'Водители были успешно импортированы',
          onOk,
        });
      }
    },
    [onOk],
  );

  return (
    <div className={'import-drivers'}>
      <Uploader.FormFieldDragger action={action} accept="text/csv, application/vnd.ms-excel" onChange={handleChange}>
        <p className="ant-upload-drag-icon">
          <Ant.Icon type="inbox" />
        </p>

        <p className="ant-upload-text">Нажмите или перетащите файл для загрузки</p>
        <p className="ant-upload-hint">Поддерживаются файлы формата: CSV</p>
      </Uploader.FormFieldDragger>
      <div className={'import-drivers__template'}>
        <a href={templateUrl} rel="noopener noreferrer" target="_blank">
          Шаблон для заполнения
        </a>
      </div>
    </div>
  );
};

ImportDrivers.propTypes = {
  onOk: PropTypes.func,
  action: PropTypes.string.isRequired,
};

export default ImportDrivers;
