import React from 'react';
import { FIELD_META_PROP } from 'antd/es/form/constants';
import { Form } from '../../antd';

function getControls(children, recursively) {
  let controls = [];
  const childrenArray = React.Children.toArray(children);
  for (let i = 0; i < childrenArray.length; i++) {
    if (!recursively && controls.length > 0) {
      break;
    }

    const child = childrenArray[i];
    if (child.type && (child.type === Form.Item || child.type.displayName === 'FormItem')) {
      continue;
    }
    if (!child.props) {
      continue;
    }
    if (FIELD_META_PROP in child.props) {
      // And means FIELD_DATA_PROP in child.props, too.
      controls.push(child);
    } else if (child.props.children) {
      controls = controls.concat(getControls(child.props.children, recursively));
    }
  }
  return controls;
}

function getOnlyControl(children) {
  const child = getControls(children, false)[0];
  return child !== undefined ? child : null;
}

function getChildProp(children, prop) {
  const child = getOnlyControl();
  return child && child.props && child.props[prop];
}

function getId(children) {
  return getChildProp(children, 'id');
}

export { getId };
