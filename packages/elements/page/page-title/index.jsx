import cn from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import IconDeprecated from '../../DEPRECATED/icon/icon';

function PageTitle(props) {
  const { children, onBack, hr, className: classNameInput, extra, subtitle = '' } = props;

  const className = cn('page-title', { 'page-title--hr': hr }, classNameInput);

  return (
    <div className={className}>
      <div className={'page-title__wrapper'}>
        {onBack && <IconDeprecated name={'backArrowOrange'} className={'pointer'} onClick={onBack} />}
        <div className={'page-title__title'}>
          <h1 className={'page-title__title__text flexbox'}>{children}</h1>
          <div className={'page-title__subtitle flexbox'}>{subtitle}</div>
        </div>

        {extra && <div className={'page-title__extra'}>{extra}</div>}
      </div>
      {hr && <hr />}
    </div>
  );
}

PageTitle.defaultProps = {
  hr: true,
};

PageTitle.propTypes = {
  hr: PropTypes.bool,
  className: PropTypes.string,
  onBack: PropTypes.func,
  children: PropTypes.node,
  extra: PropTypes.node,
};

export default PageTitle;
