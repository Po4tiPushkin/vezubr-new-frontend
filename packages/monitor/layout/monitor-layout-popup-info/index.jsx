import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';

const CLS = 'monitor-info-popup';

function MonitorLayoutPopupInfo(props) {
  const { header, footer, body } = props;

  return (
    <article className={`${CLS}`}>
      <header className={`${CLS}__header`}>{header}</header>

      <div className={`${CLS}__body`}>{body}</div>

      {footer && <footer className={`${CLS}__footer`}>{footer}</footer>}
    </article>
  );
}

MonitorLayoutPopupInfo.propTypes = {
  header: PropTypes.node.isRequired,
  footer: PropTypes.node,
  body: PropTypes.node.isRequired,
};

export default MonitorLayoutPopupInfo;
