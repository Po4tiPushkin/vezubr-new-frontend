import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import MonitorList from '../monitor-list';
import { MonitorContext } from '../../context';
import usePrevious from '@vezubr/common/hooks/usePrevious';

function MonitorContent(props) {
  const { listProps, ...otherProps } = props;
  const { store } = React.useContext(MonitorContext);
  const otherPropsPrev = usePrevious(otherProps);

  useEffect(() => {
    for (const propName of Object.keys(otherProps)) {
      const currentPropValue = otherProps[propName];
      const prevPropValue = otherPropsPrev?.[propName];
      if (currentPropValue !== prevPropValue) {
        store.setProp(propName, currentPropValue);
      }
    }
  }, [otherPropsPrev, otherProps]);

  return <MonitorList {...{ ...listProps, loading: otherProps.loading }} />;
}

MonitorContent.propTypes = {
  listProps: PropTypes.object,
  mapProps: PropTypes.object,
  loading: PropTypes.bool,
  waiting: PropTypes.bool,
};

export default MonitorContent;
