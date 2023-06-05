import React from 'react';
import createHigherOrderComponent from '@vezubr/common/hoc/createHigherOrderComponent';
import { BargainOfferItemProps, BargainProducerTypeProps } from '../types';
import { createOfferListFromMinMy } from '../utils';

export const ConvertMiMinToListProps = {
  min: BargainOfferItemProps,
  my: BargainOfferItemProps,
  selfProducer: BargainProducerTypeProps,
};

const withConvertMiMinToList = () =>
  createHigherOrderComponent(
    (WrappedComponent) => (props) => {
      const { min, my, ...otherProps } = props;
      const { selfProducer } = otherProps;

      const list = React.useMemo(() => createOfferListFromMinMy(min, my, selfProducer), [min, my, selfProducer]);

      return <WrappedComponent {...otherProps} list={list} hasMy={!!my} />;
    },
    'withConvertMiMinToList',
    ConvertMiMinToListProps,
  );

export default withConvertMiMinToList;
