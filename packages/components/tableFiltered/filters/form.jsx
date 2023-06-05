import React, { useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Form } from '@vezubr/elements/antd';
import { IconDeprecated } from '@vezubr/elements';
import * as components from './components';
import * as actions from './actions';
import FilterSave from './save';

import FilterContext from './context';
import { Ant } from '@vezubr/elements';

function FiltersForm(props) {
  const {
    classNames,
    title,
    availableItems,
    extraFilters,
    enabledFilterKeys,
    setEnabledFilterKeys,
    form,
    goBack,
    filterSetName,
    pushParams,
    params,
    visibleSaveButtons,
    showArrow = true,
    tableKey,
  } = props;

  const itemPosition = {
    topLeft: [],
    topRight: [],
    main: [],
  };

  const render = {
    item: (dataField) => {
      const { key, type, disabled } = dataField;

      if (disabled) {
        return null;
      }

      if (!components[type] && !actions[type]) {
        console.warn(`Item type ${type} don\`t exist`);
        return null;
      }

      const Component = actions[type] || components[type];
      return <Component filterSetName={filterSetName} key={key} {...{ ...dataField, form }} />;
    },

    items: (dataFields) => dataFields.map(render.item),
  };

  for (const item of availableItems) {
    if (item.position) {
      if (!itemPosition[item.position]) {
        console.warn(`Item position ${item.position} don\`t exist`);
        itemPosition.main.push(item);
      } else {
        itemPosition[item.position].push(item);
      }
    } else {
      itemPosition.main.push(item);
    }
  }

  return (
    <FilterContext.Provider
      value={{
        enabledFilterKeys,
        setEnabledFilterKeys,
        extraFilters,
        filterSetName,
        form,
      }}
    >
      <Form
        className={cn('table-filters', classNames)}
        layout="inline"
        onSubmit={(e) => {
          e.preventDefault();
        }}
      >
        {(title || itemPosition.topLeft.length > 0 || itemPosition.topRight.length > 0) && (
          <>
            <div className="table-filters-title-zone">
              {title && (
                <div className="table-filters-title-zone-item table-filters-title">
                  {showArrow && <IconDeprecated name={'backArrowOrange'} className={'pointer'} onClick={goBack} />}
                  <h2 className={'big-title title-bold margin-left-12'}>{title}</h2>
                </div>
              )}

              {itemPosition.topLeft.length > 0 && (
                <div className="table-filters-title-zone-item table-filters-title-left">
                  {render.items(itemPosition.topLeft)}
                </div>
              )}

              {itemPosition.topRight.length > 0 && (
                <div className="table-filters-title-zone-item table-filters-title-right">
                  {render.items(itemPosition.topRight)}
                </div>
              )}
            </div>
            <hr />
          </>
        )}
        {itemPosition.main.length > 0 && (
          <div className="table-filters-main-zone">
            {render.items(itemPosition.main)}
            {visibleSaveButtons && (
              <div className="filter-item table-filters-main-zone-buttons">
                <div className="filter-item filter-item--button">
                  <Ant.Button type={'ghost'} onClick={(e) => { pushParams({}) }} className={'semi-wide margin-left-16'}>
                    Сбросить
                  </Ant.Button>
                </div>
                <div className="filter-item filter-item--button">
                  <FilterSave tableKey={tableKey} params={params} filterSetName={filterSetName} />
                </div>
              </div>
            )}
          </div>
        )}
      </Form>
    </FilterContext.Provider>
  );
}

FiltersForm.contextTypes = {
  history: PropTypes.object,
};

FiltersForm.propTypes = {
  form: PropTypes.object,
  className: PropTypes.string,
  filterSetName: PropTypes.string,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string,
      type: PropTypes.string,
      config: PropTypes.any,
      position: PropTypes.oneOf(['main', 'topLeft', 'topRight']),
      disabled: PropTypes.bool,
    }),
  ),
  enabledFilterKeys: PropTypes.arrayOf(PropTypes.string),
  extraFilters: PropTypes.arrayOf(PropTypes.object),
  setEnabledFilterKeys: PropTypes.func,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node, PropTypes.object]),
  onChange: PropTypes.func,
  goBack: PropTypes.func,
};

export default Form.create({
  onValuesChange: (props, changedValues, allValues) => {
    props.onChange(allValues, changedValues);
  },
})(FiltersForm);
