import React from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import MonitorLayoutContent from '../../layout/monitor-layout-content';
import MonitorPageMap from './monitor-page-map';

function MonitorPage(props) {
  const { className, filters, tabs, children, dateRange } = props;

  const map = React.useCallback((mapContainerRef) => {
    return (<MonitorPageMap mapContainer={mapContainerRef}/>)
  }, [])

  return (
    <div className={cn('monitor-page', className)}>
      <div className={'monitor-page__tabs'}>{tabs}</div>

      <MonitorLayoutContent dateRange={dateRange} map={map} list={children} filters={filters}/>
    </div>
  );
}

MonitorPage.propTypes = {
  className: PropTypes.string,
  tabs: PropTypes.node,
  children: PropTypes.node,
};

export default MonitorPage;
