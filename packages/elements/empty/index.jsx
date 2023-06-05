import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Empty as AntEmpty } from '../antd';
import VzImage from '../DEPRECATED/icon/icon';

function Empty(props) {
  const { className: classNameInput, description, title, image, vzImageName, ...otherProps } = props;

  const className = cn('vz-empty', classNameInput);
  const resultImage = image || (vzImageName && <VzImage name={vzImageName} />) || AntEmpty.PRESENTED_IMAGE_DEFAULT;

  return (
    <AntEmpty
      {...otherProps}
      className={className}
      image={resultImage}
      description={
        <>
          {title && <span className={'vz-empty__title'}>{title}</span>}
          <span className={'vz-empty__description'}>{description || 'Данные для отображения отсутствуют'}</span>
        </>
      }
    />
  );
}

Empty.propTypes = {
  className: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  imageStyle: PropTypes.object,
  vzImageName: PropTypes.string,
  image: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};

export default Empty;
