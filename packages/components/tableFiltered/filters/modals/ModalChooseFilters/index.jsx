import React, { useState, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

import FilterContext from '../../context';
import ModalDeprecated from '../../../../DEPRECATED/modal/modal';
import { ButtonDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';

function ModalChooseFilters(props) {
  const { enabledFilterKeys, setEnabledFilterKeys, extraFilters, form } = useContext(FilterContext);

  const defaultSelected = useMemo(() => {
    const defaultEnabled = {};
    for (const filterKey of enabledFilterKeys) {
      defaultEnabled[filterKey] = true;
    }
    return defaultEnabled;
  }, [enabledFilterKeys]);

  const [selected, setSelected] = useState(defaultSelected);

  const { open, onClose } = props;

  const reset = () => {
    setEnabledFilterKeys([]);
    setSelected({});

    const valuesDisabled = {};
    for (const filter of extraFilters) {
      const checkNames = Array.isArray(filter.name) ? filter.name : [filter.name];
      for (const name of checkNames) {
        valuesDisabled[name] = null;
      }
    }

    form.setFieldsValue(valuesDisabled);
  };

  const apply = () => {
    const newEnabledFilters = [];

    const valuesDisabled = {};

    for (const filterKey of Object.keys(selected)) {
      if (selected[filterKey]) {
        newEnabledFilters.push(filterKey);
      } else {
        const filter = extraFilters.find((filter) => filter.key === filterKey);

        if (filter) {
          const checkNames = Array.isArray(filter.name) ? filter.name : [filter.name];
          for (const name of checkNames) {
            valuesDisabled[name] = null;
          }
        }
      }
    }

    form.setFieldsValue(valuesDisabled);
    setEnabledFilterKeys(newEnabledFilters);
    onClose();
  };

  const toggleChooseFilter = (e, filterKey) => {
    const newSelected = { ...selected };
    newSelected[filterKey] = e.target.checked;
    setSelected(newSelected);
  };

  return (
    <ModalDeprecated
      options={{
        showModal: open,
        showClose: true,
        modalClassnames: 'no-padding',
        bodyClassnames: 'no-padding-right no-padding-left no-padding-top',
      }}
      title={{
        text: 'Дополнительные фильтры',
        classnames: 'small-title no-margin additional-title',
      }}
      size={'small'}
      onClose={onClose}
      content={
        <div className="flexbox wrap choose-additional-filters column size-1">
          {extraFilters.map((filter) => (
            <div className={'flexbox additional-input'} key={filter.key}>
              <label className="additional-container">
                <span className={'text-big additional-title light-bold'}>{filter.label || filter.key}</span>
                <input
                  name={filter.key + '_selected'}
                  type="checkbox"
                  onChange={(e) => {
                    toggleChooseFilter(e, filter.key);
                  }}
                  checked={selected[filter.key] === true}
                />
                <span className="checkmark" />
              </label>
            </div>
          ))}
          <div className={'flexbox'}>
            <div className={'area full-width'}>
              <div className={'flexbox align-right justify-right full-width'}>
                <ButtonDeprecated theme={'secondary'} onClick={reset} className={'mid light'}>
                  {t.buttons('byDefault')}
                </ButtonDeprecated>
                <ButtonDeprecated className={'margin-left-15'} theme={'primary'} onClick={apply}>
                  {t.buttons('accept')}
                </ButtonDeprecated>
              </div>
            </div>
          </div>
        </div>
      }
    />
  );
}

ModalChooseFilters.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ModalChooseFilters;
