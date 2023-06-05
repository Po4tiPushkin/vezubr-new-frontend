import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/constants';
import { ReactComponent as Sharing_IconComponent } from '@vezubr/common/assets/img/icons/republishArrow.svg';
import { Ant } from '@vezubr/elements'

export const allStrategyTypes = {
  bargain: ['Торги', ' по торгам'],
  tariff: ['Тариф', ' по тарифу'],
  rate: ['Ставка', ' по ставке'],
}

function PublishContourInfo(props) {
  const {
    contourIds = [],
    strategyType = null,
    republishStrategyType = null,
  } = props;

  const strategyTypeContent = useMemo(() => {
    if (!strategyType) {
      return null;
    }
    const title = 'Опубликовано от заказчика в контуре'
      + (strategyType ? allStrategyTypes[strategyType][1] : '');

    return (
      <span key={title} className="publish-contour-info__item">
        <span title={title} className="publish-contour-info__item__text">
          {allStrategyTypes[strategyType][0]}
        </span>
      </span>
    )
  }, [strategyType]);

  const republishStrategyTypeContent = useMemo(() => {
    if (!republishStrategyType) {
      return null;
    }
    const republishTitle = 'Опубликовано от Экспедитора' + (republishStrategyType ? allStrategyTypes[republishStrategyType][1] : '');

    return (
      <span key={republishTitle} className="publish-contour-info__item">
        <Ant.Icon component={Sharing_IconComponent} />
        <span title={republishTitle} className="publish-contour-info__item__text">
          {allStrategyTypes[republishStrategyType][0]}
        </span>
      </span>
    )
  }, [republishStrategyType]);

  if (!contourIds?.length && !strategyType) {
    return null;
  }

  const links = [];

  if (APP !== 'dispatcher') {
    for (const contourId of contourIds) {
      const title = (CONTOUR_MAIN_ID === contourId ? 'Опубликовано в агрегаторе' : 'Опубликовано в контуре')
        + (strategyType ? allStrategyTypes[strategyType][1] : '');

      const text = CONTOUR_MAIN_ID === contourId ? 'A' : 'К';

      links[CONTOUR_MAIN_ID === contourId ? 'unshift' : 'push'](
        <span key={contourId} className="publish-contour-info__item">
          <span title={title} className="publish-contour-info__item__text">
            {text}
          </span>
        </span>,
      );

      if (links.length >= 2) {
        break;
      }
    }
  }

  if (strategyType) {
    links['push'](strategyTypeContent);
  }
  if (republishStrategyType) {
    links['push'](republishStrategyTypeContent);
  }

  return <span className="publish-contour-info">{links}</span>;
}

PublishContourInfo.propTypes = {
  contourIds: PropTypes.arrayOf(PropTypes.number),
  strategyType: PropTypes.string,
  republishStrategyType: PropTypes.string,
};

export default PublishContourInfo;
