import React from 'react';
import PropTypes from 'prop-types';
import Icon from '../icon/icon';
import t from '@vezubr/common/localization';
function EmptyBlock({ ...props }) {
  const { theme, content, className } = props;

  let icon = '';
  switch (theme) {
    case 'monitor':
      icon = 'emptyMonitor';
      break;
    case 'documents':
    case 'execution':
    case 'photos':
    case 'ordersHistory':
    case 'customProps':
      icon = 'emptyDocuments';
      break;
    case 'users':
    case 'groups':
      icon = 'emptyUsers';
      break;
  }

  return (
    <div className={`empty-container ${className || ''}`}>
      <div className={'circle'}>
        <Icon className={'wide big'} name={icon} />
      </div>
      <h2 className={'margin-top-44'}>{t.nav(theme)}</h2>
      <p className={'margin-top-12 text-center'}>{content || t.nav(`${theme}-emptyText`)}</p>
    </div>
  );
}

EmptyBlock.propTypes = {
  content: PropTypes.string,
  theme: PropTypes.string,
};

export default EmptyBlock;
