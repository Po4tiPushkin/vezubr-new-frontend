import React from 'react';
import PropTypes from 'prop-types';
import { useObserver } from "mobx-react";
import { ORDER_CATEGORIES_GROUPPED } from '@vezubr/common/constants/constants';
import { Ant } from '@vezubr/elements';
import withOrderFormFieldWrapper from '../../hoc/withOrderFormFieldWrapper';
import compose from '@vezubr/common/hoc/compose';

function OrderFieldSelectCategoryChoice(props) {
  const { name, placeholder, value, setValue, searchPlaceholder, ...otherProps } = props;

  return (
    <Ant.TreeSelect
      allowClear={true}
      showSearch={true}
      {...otherProps}
      className={'order-field-select-category-choice'}
      dropdownClassName={'order-field-select-category-choice__dropdown custom-select-dropdown'}
      value={value}
      placeholder={placeholder || 'Выберите тип автоперевозки'}
      searchPlaceholder={searchPlaceholder || 'Выберите тип автоперевозки'}
      onChange={setValue}
      treeData={ORDER_CATEGORIES_GROUPPED}
    />
  );
}

export default compose([withOrderFormFieldWrapper])(OrderFieldSelectCategoryChoice);
