import React, { useState, useMemo, useCallback, useEffect } from 'react';
import _isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import FiltersForm from './form';
import * as actions from './actions';
import { useDebouncedCallback } from 'use-debounce';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { setLocalStorageItem } from '@vezubr/common/common/utils';
function Filters(props) {
  const history = useHistory();
  const { id } = useSelector(state => state.user);
  const {
    filtersActions,
    params,
    pushParams,
    goBack: goBackInput,
    paramKeys,
    timeReaction,
    visibleSaveButtons = false,
    canRefreshFilters,
    setCanRefreshFilters,
    forceUpdate,
    filterSetName,
    ...otherProps
  } = props;

  const defaultGoBack = useCallback(() => {
    history.push('/monitor/selection');
  }, []);

  const goBack = goBackInput || defaultGoBack;

  const items = useMemo(() => {
    return filtersActions.map((item) => {
      let { name, getValue, key, type } = item;

      if (actions[type]) {
        return item;
      }

      name = name || key;

      let value;

      if (Array.isArray(name)) {
        value = name.map((nameKey) => {
          return params[nameKey];
        });
      } else {
        value = params[name];
      }

      if (getValue) {
        value = getValue(value);
      }

      return {
        ...item,
        name,
        value,
      };
    });
  }, [filtersActions, params]);

  const defaultEnabledFilterKeys = useMemo(() => {
    const defaultEnabled = [];
    for (const filter of items) {
      if (actions[filter.type] || !filter.extra) {
        continue;
      }
      const checkNames = Array.isArray(filter.name) ? filter.name : [filter.name];
      for (const name of checkNames) {
        if (typeof params[name] !== 'undefined') {
          defaultEnabled.push(filter.key);
          break;
        }
      }
    }
    const localParams = JSON.parse(localStorage.getItem(`defaultParams-${id}`));
    if (localParams?.filters?.[filterSetName] && Array.isArray(localParams?.filters?.[filterSetName])) {
      localParams?.filters?.[filterSetName].forEach(el => {
        if (!defaultEnabled.includes(el)) {
          defaultEnabled.push(el);
        }
      })
    }
    return defaultEnabled;
  }, [items, params]);

  useEffect(() => {
    if (canRefreshFilters) {
      setEnabledFilterKeys(defaultEnabledFilterKeys);
      setCanRefreshFilters(false);
    }
  }, [params]);
  const [enabledFilterKeys, setEnabledFilterKeys] = useState(defaultEnabledFilterKeys);
  useEffect(() => {
    const tempLocalParams = JSON.parse(localStorage.getItem(`defaultParams-${id}`)) || {};
    if (tempLocalParams?.filters) {
      tempLocalParams.filters[filterSetName] = enabledFilterKeys;
    } else {
      tempLocalParams.filters = {};
      tempLocalParams.filters[filterSetName] = enabledFilterKeys;
    }
    setLocalStorageItem(`defaultParams-${id}`, JSON.stringify(tempLocalParams));
  }, [enabledFilterKeys])
  const { extraFilters, availableItems } = useMemo(() => {
    const extraFilters = [];
    const availableItems = [];

    for (const filter of items) {
      if (actions[filter.type]) {
        availableItems.push(filter);
        continue;
      }
      if (filter.extra) {
        extraFilters.push(filter);
        if (enabledFilterKeys.indexOf(filter.key) !== -1) {
          availableItems.push(filter);
        }
      } else {
        availableItems.push(filter);
      }
    }

    return {
      extraFilters,
      availableItems,
    };
  }, [items, enabledFilterKeys]);

  const [onFiltersChange] = useDebouncedCallback((allFilters, changedValues) => {
    let hasChanges = false;
    for (const keyChangeValue of Object.keys(changedValues)) {

      let changedValue = changedValues[keyChangeValue];
      if (Array.isArray(changedValue)) {
        changedValue = changedValue.join(',');
      }

      if (!_isEqual(params[keyChangeValue], changedValue)) {
        hasChanges = true;
        break;
      }
    }

    if (!hasChanges && !forceUpdate) {
      return;
    }

    const newPrams = {
      ...params,
      ...allFilters,
    };

    delete newPrams[paramKeys?.page || 'page'];

    pushParams(newPrams);
  }, timeReaction);

  const propsForm = {
    ...otherProps,
    availableItems,
    pushParams,
    params,
  };

  return (
    <FiltersForm
      {...propsForm}
      enabledFilterKeys={enabledFilterKeys}
      setEnabledFilterKeys={setEnabledFilterKeys}
      onChange={onFiltersChange}
      goBack={goBack}
      filterSetName={filterSetName}
      extraFilters={extraFilters}
      visibleSaveButtons={visibleSaveButtons}
    />
  );
}

Filters.contextTypes = {
  observer: PropTypes.object,
  history: PropTypes.object,
};

Filters.defaultProps = {
  timeReaction: 500,
}

Filters.propTypes = {
  params: PropTypes.object.isRequired,
  pushParams: PropTypes.func.isRequired,
  timeReaction: PropTypes.number,
  filtersActions: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      label: PropTypes.string,
      config: PropTypes.any,
      getValue: PropTypes.func,
      type: PropTypes.string.isRequired,
      extra: PropTypes.bool,
      disabled: PropTypes.bool,
      position: PropTypes.oneOf(['main', 'topLeft', 'topRight']),
    }),
  ),
};

export default Filters;
