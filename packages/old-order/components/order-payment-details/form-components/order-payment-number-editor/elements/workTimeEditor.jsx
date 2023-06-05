import React from 'react';
import { OrderPaymentContext } from '../../../../../context';
import moment from 'moment-timezone';
import { Ant, IconDeprecated } from '@vezubr/elements';
import { ADDITIONAL_TIME_ARTICLES } from '../../../../../constants';

export default function WorkTimeEditor() {
  const {
    store,
    workTime: { get: getWorkTime, set: setWorkTime },
  } = React.useContext(OrderPaymentContext);

  const [errors, setErrors] = React.useState({});

  const disabledDate = (date) => {
    const currentDate = moment(date);
    const nextDay = moment().startOf('day').add(2, 'day');
    const prev40Days = moment().startOf('day').subtract(40, 'days');
    return currentDate.isAfter(nextDay) || currentDate.isBefore(prev40Days) || false;
  };

  const handleChange = React.useCallback(
    (date, start) => {
      if (start) {
        store.setStartedAt(date);
      } else {
        store.setCompletedAt(date);
      }

      let allTime = moment(store.completedAt, 'DD.MM.YYYY HH:mm').diff(moment(store.startedAt, 'DD.MM.YYYY HH:mm'), 'minutes');
      const workTime = getWorkTime();
      const newWorkTime = {};
      Object.entries(workTime).map(([key, value]) => {
        if (ADDITIONAL_TIME_ARTICLES.includes(parseInt(key))) {
          newWorkTime[key] = allTime;
        } else {
          newWorkTime[key] = value;
        }
        allTime -= value;
      });

      setWorkTime(newWorkTime);

      if (moment(store.startedAt, 'DD.MM.YYYY HH:mm') > moment(store.completedAt, 'DD.MM.YYYY HH:mm')) {
        setErrors({
          ...errors,
          completedAt: 'Время окончания не должно быть меньше, чем время начала',
        });
      } else {
        setErrors({});
      }
    },
    [store],
  );

  const dates = React.useMemo(() => {
    return (
      <>
        <div
          className="order-work-time-date flexbox align-center space-between margin-bottom-15"
          key={`start`}
          style={{ gap: 8 }}
        >
          <span>Время начала:</span>
          <Ant.DatePicker
            className={errors['startedAt'] ? 'with-error' : ''}
            style={{
              width: 210,
              ...(errors['startedAt']
                ? {
                    border: '1px solid red',
                    borderRadius: '4px',
                  }
                : {}),
            }}
            defaultValue={store.startedAt ? moment(store.startedAt, 'DD.MM.YYYY HH:mm') : null}
            disabledDate={(date) => disabledDate(date)}
            onChange={(e, date) => handleChange(date, true)}
            showTime
            allowClear={false}
            placeholder={'дд.мм.гггг чч:мм'}
            format={['DD.MM.YYYY HH:mm', 'YYYY-MM-DD HH:mm']}
          />
          {errors['startedAt'] ? (
            <div
              className={'date-error'}
              title={errors['startedAt']}
              style={{ position: 'absolute', right: '-2px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <IconDeprecated name={'danger'} />
            </div>
          ) : null}
        </div>
        <div className="order-work-time-date flexbox align-center space-between" key={`end`} style={{ gap: 8 }}>
          <span>Время окончания:</span>
          <Ant.DatePicker
            className={errors['completedAt'] ? 'with-error' : ''}
            style={{
              width: 210,
              ...(errors['completedAt']
                ? {
                    border: '1px solid red',
                    borderRadius: '4px',
                  }
                : {}),
            }}
            defaultValue={store.completedAt ? moment(store.completedAt, 'DD.MM.YYYY HH:mm') : null}
            placeholder={'дд.мм.гггг чч:мм'}
            format={['DD.MM.YYYY HH:mm', 'YYYY-MM-DD HH:mm']}
            showTime
            allowClear={false}
            disabledDate={(date) => disabledDate(date)}
            onChange={(e, date) => handleChange(date, false)}
          />
          {errors['completedAt'] ? (
            <div
              className={'date-error'}
              title={errors['completedAt']}
              style={{ position: 'absolute', right: '-2px', top: '50%', transform: 'translateY(-50%)' }}
            >
              <IconDeprecated name={'danger'} />
            </div>
          ) : null}
        </div>
      </>
    );
  }, [store]);

  return dates;
}
