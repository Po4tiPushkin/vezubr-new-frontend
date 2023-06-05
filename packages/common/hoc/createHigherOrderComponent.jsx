import React from 'react';
import _camelCase from 'lodash/camelCase';
import _upperFirst from 'lodash/upperFirst';

function createHigherOrderComponent(mapComponentToEnhancedComponent, modifierName, propTypes) {
  return (OriginalComponent) => {
    const EnhancedComponent = mapComponentToEnhancedComponent(OriginalComponent);
    const { displayName = OriginalComponent.name || 'Component' } = OriginalComponent;
    EnhancedComponent.displayName = `${_upperFirst(_camelCase(modifierName))}(${displayName})`;

    if (propTypes) {
      EnhancedComponent.propTypes = propTypes;
    }

    return EnhancedComponent;
  };
}

export default createHigherOrderComponent;
