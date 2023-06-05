import React from 'react';
import PropTypes from 'prop-types';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import OrderStore from '../store/OrderStore';
import { OrderContext } from '../context';
import { VEHICLE_BODY_GROUPS_BODY_TYPES } from '@vezubr/common/constants/constants';
import { reaction } from 'mobx';
import createHigherOrderComponent from '@vezubr/common/hoc/createHigherOrderComponent';
import { useSelector } from 'react-redux';
export const OrderStoreConnectProps = {
  onChange: PropTypes.func,
  dictionaries: PropTypes.object.isRequired,
  lazyData: PropTypes.object,
  contours: PropTypes.arrayOf(PropTypes.object),
  validators: PropTypes.object,
};

const withOrderStore = (DataStore) =>
  createHigherOrderComponent(
    (WrappedComponent) => (props) => {
      const { lazyData, staticData: staticDataInput, validators, onChange, ...otherProps } = props;

      const { dictionaries } = otherProps;

      const orderRequiredCustomProperties = useSelector((state) =>
        state.customProperties.filter((item) => item.entityName == 'order' && item.isRequired),
      );
      const { id } = useSelector(state => state.user)
      const {
        vehicleBodies,
        loadingTypes,
        vehicleBodyTypeAvailableLoadingTypes,
        loadersOrderMaxWorkingDate,
      } = dictionaries;
      const bodyGroupsBodyTypes = VEHICLE_BODY_GROUPS_BODY_TYPES;

      // const lazyDataPrev = usePrevious(lazyData);

      const staticData = {
        ...staticDataInput,
        bodyTypesAll: vehicleBodies,
        loadersOrderMaxWorkingDate,
        bodyGroupsBodyTypes,
        loadingTypes,
        vehicleBodyTypeAvailableLoadingTypes,
        orderRequiredCustomProperties,
        currentUser: id
      };

      const [store] = React.useState(() => {
        return new OrderStore({
          validators,
          DataStore,
          staticData,
        });
      });

      const contextValue = React.useMemo(
        () => ({
          store,
        }),
        [store],
      );

      React.useEffect(() => {
        if (lazyData) {
          store.startBulkUpdate();
          store.setData({
            ...lazyData,
            ...staticData,
          });
          store.endBulkUpdate();
        }
      }, [lazyData]);

      React.useEffect(() => {
        if (!onChange) {
          return;
        }

        const disposer = reaction(
          () => {
            const data = {};
            Object.keys(store.data).forEach((name) => {
              const field = name.replace(/^_/, '');
              data[field] = store.data[field];
            });
            return data;
          },
          (data) => onChange(data, store),
        );

        return () => {
          disposer();
        };
      }, [onChange, store]);

      React.useEffect(() => {
        return () => {
          store.destroy();
        };
      }, []);

      return (
        <OrderContext.Provider value={contextValue}>
          <WrappedComponent {...otherProps} store={store} />
        </OrderContext.Provider>
      );
    },
    'withOrderStore',
  );

export default withOrderStore;
