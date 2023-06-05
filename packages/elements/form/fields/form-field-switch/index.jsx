import React from 'react';
import { Switch } from '../../../antd';
import cn from 'classnames';
import PropTypes from 'prop-types';
import Animate from 'rc-animate';

const sizes = {
  small: 'small',
  large: 'large',
  default: 'default',
};

function FormFieldSwitch(props, ref) {
  const {
    checked,
    checkedChildren,
    unCheckedChildren,
    checkedTitle,
    unCheckedTitle,
    onChange,
    colorChecked = true,
    size: sizeInput,
    ...otherProps
  } = props;

  const size = (sizeInput && sizes[sizeInput]) || 'default';
  const sizeSwitch = size === 'large' ? 'default' : size;

  return (
    <div
      className={cn('vz-form-field-switch', `vz-form-field-switch__size-${size}`, {
        'vz-form-field-switch--checked': colorChecked && checked,
      })}
    >
      <div className={'vz-form-field-switch__text'}>
        <Animate transitionLeave={false} transitionName={`${checkedTitle !== unCheckedTitle ? 'fade' : ''}`}>
          <span key={checked ? 'checked' : 'unchecked'}>
            {checked && checkedTitle}
            {!checked && unCheckedTitle}
          </span>
        </Animate>
      </div>

      <Switch
        {...otherProps}
        ref={ref}
        checked={checked}
        size={sizeSwitch}
        checkedChildren={checkedChildren}
        unCheckedChildren={unCheckedChildren}
        onChange={onChange}
      />
    </div>
  );
}

export default React.forwardRef(FormFieldSwitch);
