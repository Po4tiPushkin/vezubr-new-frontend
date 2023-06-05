import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';

const CLS = 'monitor-altering-list';

const Empty = () => null;

function MonitorLayoutAlteringList(props) {
  const { alteringData } = props;

  return (
    <div className={`${CLS}`}>
      {Object.keys(alteringData).map((rowKey) => {
        const rowClassName = alteringData[rowKey].rowClassName;
        const alignClassName = alteringData[rowKey].rowAlign;

        const rowClass = cn({
          [`${CLS}__row--${rowClassName}`]: rowClassName,
          [`${CLS}__row--${alignClassName}`]: alignClassName,
        });

        const cells = alteringData[rowKey].items;

        return (
          <div key={rowKey} className={cn(`${CLS}__row`, rowClass, rowKey)}>
            {Object.keys(cells).map((cellKey) => {
              const cellTitle = cells[cellKey].title;
              const cellValue = cells[cellKey].value;

              if (!cellTitle && !cellValue) {
                return <Empty key={cellKey} />;
              }

              return (
                <div key={cellKey} className={cn(`${CLS}__cell`, cellKey)}>
                  {cellTitle && <div className={cn(`${CLS}__cell__title`, `${cellKey}__cell-title`)}>{cellTitle}</div>}

                  <div className={cn(`${CLS}__cell__value`, `${cellKey}__cell-value`)}>{cellValue}</div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

MonitorLayoutAlteringList.propTypes = {
  alteringData: PropTypes.object.isRequired,
};

export default MonitorLayoutAlteringList;
