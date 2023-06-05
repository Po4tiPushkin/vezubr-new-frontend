import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import FormFieldUpload from '../form-field-upload';

function FormGroupUpload(props) {
  const { className, list } = props;
  return (
    <div className={cn('form-group-upload', className)}>
      {list.map((item, index) => (
        <FormFieldUpload key={item.fileId || index} {...item} />
      ))}
    </div>
  );
}

FormGroupUpload.propTypes = {
  className: PropTypes.string,
  list: PropTypes.arrayOf(
    PropTypes.shape({
      fileId: PropTypes.number,
      fileName: PropTypes.string,
      fileNameOrigin: PropTypes.string,
      preview: PropTypes.string,
    }),
  ),
};

export default FormGroupUpload;
