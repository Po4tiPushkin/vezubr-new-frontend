import React, {useMemo} from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { Ant } from '@vezubr/elements';
import moment from "moment";
import './styles.scss';

const CLS = 'monitor-item-tim-at-arrival';

function ListItemTimeAtArrival(props) {
  const { order: { data: { activeOrderPoint = {} } } } = props;

  const requiredArriveTime = useMemo(() => {
    if (activeOrderPoint?.requiredArriveTime) {
      return moment(activeOrderPoint?.requiredArriveTime).format('DD.MM.YYYY HH:mm');
    }

    return 'Не указано';
  }, [activeOrderPoint]);

  const expectedArriveTime = useMemo(() => {
    if (activeOrderPoint?.expectedArrivalAt) {
      return moment(activeOrderPoint?.expectedArrivalAt).format('DD.MM.YYYY HH:mm');
    }

    return 'Не данных от МП';
  }, [activeOrderPoint]);

  return (
    <div className={CLS}>
      <div
        className={cn(`${CLS}__item`, `${CLS}__item__required`)}
        title={"Требуемое время прибытия"}
      >
        <Ant.Icon type="thunderbolt" />
        <span>{requiredArriveTime}</span>
      </div>
      <div
        className={cn(`${CLS}__item`, `${CLS}__item__expected`)}
        title={"Ожидаемое время прибытия"}
      >
        <Ant.Icon type="carry-out" />
        <span>{expectedArriveTime}</span>
      </div>
    </div>
  );
}

ListItemTimeAtArrival.propTypes = {
  order: PropTypes.object,
};

export default ListItemTimeAtArrival;
