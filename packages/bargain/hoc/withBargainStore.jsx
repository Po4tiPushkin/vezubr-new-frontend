import React from 'react';
import PropTypes from 'prop-types';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { BargainListContext } from '../context';
import createHigherOrderComponent from '@vezubr/common/hoc/createHigherOrderComponent';
import OfferList from '../store/OfferList';
import { BargainOfferItemProps } from '../types';

export const OrderBargainConnectProps = {
  list: PropTypes.arrayOf(BargainOfferItemProps),
  getListFunc: PropTypes.func,
  status: PropTypes.number.isRequired,
};

const withBargainStore = (makeContext) =>
  createHigherOrderComponent(
    (WrappedComponent) => (props) => {
      const { list, status, getListFunc, ...otherProps } = props;

      const prevList = usePrevious(list);

      const [store] = React.useState(() => {
        return new OfferList({
          getListFunc,
          list,
          status,
        });
      });

      const context = React.useMemo(
        () => ({
          store,
          ...(makeContext ? makeContext(store) : {}),
        }),
        [],
      );

      React.useEffect(() => {
        if (prevList && list !== prevList) {
          store.clearData();
          store.setDirtyData(list);
        }
      }, [list, prevList, store]);

      return (
        <BargainListContext.Provider value={context}>
          <WrappedComponent {...otherProps} store={store} />
        </BargainListContext.Provider>
      );
    },
    'withBargainStore',
    OrderBargainConnectProps,
  );

export default withBargainStore;
