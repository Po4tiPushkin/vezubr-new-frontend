import React from 'react';
import cn from 'classnames';
import TooltipError from '../controls/tooltip-error';
import PropTypes from 'prop-types';
import * as Ant from '../../antd';
import { isHasError } from '../utils';
import { ErrorItemProp } from '../types';

const DIV = (<div />).type;
const LABEL = (<label />).type;

const Item = ({ children, centerLabel, className, label, error, disabled, shortInfo, type, required }) => {
  const modalInfoLink = React.useMemo(() => {
    if (!shortInfo) {
      return null;
    }

    const { title, type = 'popup'} = shortInfo;

    if (type === 'tooltip') {
      return (
        <Ant.Tooltip placement="top" title={shortInfo.content}>
          <span className={'vz-form-item__short-info-link'}>
             <Ant.Icon type={'info-circle'} />
          </span>
        </Ant.Tooltip>
      );
    }

    return (
      <a
        className={'vz-form-item__short-info-link'}
        title={title}
        onClick={(e) => {
          e.preventDefault();
          Ant.Modal.info({
            ...shortInfo,
            className: 'vz-form-item__short-info-modal',
            style: {
              maxWidth: '100%',
            },
          });
        }}
      >
        <Ant.Icon type={'info-circle'} />
      </a>
    );
  }, [shortInfo?.title, shortInfo?.content, shortInfo?.width]);

  const hasError = isHasError(error);

  const Tag = type === 'label' ? LABEL : DIV;

  return (
      <Tag
        className={cn(
          'vz-form-item',
          { 'has-error': !disabled && hasError, 'vz-form-item--disabled': disabled, 'vz-form-item--required': !disabled && required, 'flexbox justify-center': centerLabel },
          className,
        )}
      >
        {label ? (
          <span className={`vz-form-item__label ${centerLabel ? 'center' : ''}`}>
            {label}
            {modalInfoLink}
          </span>
        ) : (
          null
        )}
        <div className="vz-form-item__content">
          <div className="vz-form-item__elem">{children}</div>
          <div className="vz-form-item__error">
            <TooltipError error={error} />
          </div>
        </div>
      </Tag>
  );
};

Item.defaultProps = {
  type: 'label',
};

Item.propTypes = {
  children: PropTypes.node,
  type: PropTypes.oneOf(['label', 'div']),
  className: PropTypes.string,
  label: PropTypes.node,
  error: ErrorItemProp,
  disabled: PropTypes.bool,
  required: PropTypes.bool,
  shortInfo: PropTypes.shape({
    type: PropTypes.oneOf(['popup', 'tooltip']),
    title: PropTypes.string,
    content: PropTypes.node,
    width: PropTypes.number,
  }),
};

export default Item;
