import React from 'react';
import { ButtonContext, Button, ButtonAttachDownload } from '../../../actions';
import filterButtonExtra from './filterButtonExtra';
import filtersApply from '../../filtersApply';
import { FilterWrapper } from '../helper';

const buttonAttachDownload = (props) => (
  <FilterWrapper>
    <ButtonAttachDownload {...props.config} />
  </FilterWrapper>
);
const button = (props) => (
  <FilterWrapper>
    <Button {...props.config} />
  </FilterWrapper>
);
const buttonContext = (props) => (
  <FilterWrapper>
    <ButtonContext {...props.config} />
  </FilterWrapper>
);

const custom = (props) => {
  const Component = props.component;
  return (
    <FilterWrapper>
      <Component {...props.config} />
    </FilterWrapper>
  )
};

export { button, buttonContext, filterButtonExtra, filtersApply, buttonAttachDownload, custom };
