import React from 'react';
import { Icon, Tooltip } from '../../../antd';
import Animate from 'rc-animate';
import PropTypes from 'prop-types';
import { isHasError } from '../../utils';
import { ErrorItemProp } from '../../types';

const TooltipError = ({ error: errorInput }) => {
  const hasError = isHasError(errorInput);

  const error =
    hasError && (Array.isArray(errorInput) ? errorInput.map((e, index) => <div key={index}>{e}</div>) : errorInput);

  const renderChildren = error ? (
    <Tooltip key="help" placement="bottom" title={error}>
      <Icon className="icon-error" type="warning" />
    </Tooltip>
  ) : null;
  return (
    <Animate transitionName="fade" component="" transitionAppear key="help">
      {renderChildren}
    </Animate>
  );
};

TooltipError.propTypes = {
  error: ErrorItemProp,
};

export default TooltipError;
