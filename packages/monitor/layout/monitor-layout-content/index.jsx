import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from '@vezubr/elements';
import useGetProp from '../../hooks/useGetProp';
import { MONITOR_PROP_LOADING, MONITOR_PROP_WAITING } from '../../constants';

function MonitorLayoutContent(props) {
  const { list, map, filters, dateRange } = props;
  const waiting = useGetProp(MONITOR_PROP_WAITING);
  const loading = useGetProp(MONITOR_PROP_LOADING);
  const mapContainerRef = React.useRef(null)

  return (
    <div className={'monitor-layout-content'}>
      <div className="monitor-layout-content__left">
        <div className="monitor-layout-content__filters-wrapper flexbox">
          {dateRange ? (
            <div className="monitor-layout-content__filters">
              {dateRange}
            </div>
          ) : (
            null
          )}
          {filters ? (
            <div className="monitor-layout-content__filters">
              {filters}
            </div>
          ) : (
            null
          )}
        </div>

        <div className={'monitor-layout-content__list-wrap'}>
          {list}
        </div>
      </div>

      <div className={'monitor-layout-content__map'} ref={mapContainerRef}>
        {map(mapContainerRef)}
        {loading && <Loader />}
      </div>
      {waiting && <Loader />}
    </div>
  );
}

MonitorLayoutContent.propTypes = {
  children: PropTypes.node,
  list: PropTypes.node,
  loading: PropTypes.bool,
  waiting: PropTypes.bool,
};

export default MonitorLayoutContent;
