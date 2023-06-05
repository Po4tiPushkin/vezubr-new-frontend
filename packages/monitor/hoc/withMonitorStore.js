import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MonitorContext } from '../context';
import MonitorStore from '../store/Monitor';
import { useSelector } from 'react-redux';
import useConvertDictionaries from '@vezubr/common/hooks/useConvertDictionaries';
import createHigherOrderComponent from '@vezubr/common/hoc/createHigherOrderComponent';


const withMonitorStore = (createServiceFuncs) =>
  createHigherOrderComponent(
    (WrappedComponent) => (props) => {
      const { dictionaries: dictionariesInput, user } = useSelector(state => state);
      const dictionaries = useConvertDictionaries({ dictionaries: dictionariesInput });

      const [store] = React.useState(() => {
        return new MonitorStore();
      });

      const serviceFuncs = createServiceFuncs(store);

      useEffect(() => {
        store.onInit();
        return () => {
          store.onDestroy();
        };
      }, [store]);

      const contextValue = React.useMemo(
        () => ({
          store,
          dictionaries,
          user,
          ...serviceFuncs
        }),
        [],
      );

      return (
        <MonitorContext.Provider value={contextValue}>
          <WrappedComponent {...props} {...contextValue} />
        </MonitorContext.Provider>
      );
    },
    'withMonitorStore',
  );

export default withMonitorStore;
