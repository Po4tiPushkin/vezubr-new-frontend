import React, { useMemo } from 'react';
import { getAddressId } from '..';
import moment from 'moment';

const WorkTimeModal = (props) => {
  const { dates = [], addresses = [] } = props;

  const workDoneTable = useMemo(() => {
    return addresses.map((el, index) => {
      const addressDate = dates.find((date) => date.id == getAddressId(el));
      if (addressDate) {
        const { id, position, start, end } = addressDate;
        return (
          (start || end) && (
            <div key={`${id}`}>
              {index !== 0 && <hr />}
              <p>{`${index + 1}) ${el?.addressString}`}</p>

              {start ? (
                <>
                  <p>
                    {`Прибыл на адрес: `}
                    <span className={`${el?.workStartedAt !== start ? 'bold' : ''}`}>
                      {moment(start).format('DD.MM.YYYY HH:mm')}
                    </span>
                  </p>
                </>
              ) : (
                <></>
              )}

              {end ? (
                <>
                  <p>
                    {`Завершил работу на адресе: `}
                    <span className={`${el?.completedAt !== end ? 'bold' : ''}`}>
                      {moment(end).format('DD.MM.YYYY HH:mm')}
                    </span>
                  </p>
                </>
              ) : (
                <></>
              )}
            </div>
          )
        );
      }
    });
  }, [dates, addresses]);

  return (
    <div className="order-work-modal">
      <p className="bold">
        Рейс перейдет в следующий статус и редактирование времени будет невозможно. Перед сохранением проверьте
        введенные значения еще раз:
      </p>
      <hr />
      <div
        className="order-work-modal-addresses"
        style={
          dates?.filter((item) => item.start || item.end)?.length > 2
            ? {
                overflowY: 'scroll',
              }
            : {}
        }
      >
        {workDoneTable}
      </div>
      {dates.find((date) => date.newPosition !== date.position) ? (
        <>
          <hr />
          <p className="bold">Порядок адресов изменится в соответствии с проставленным временем</p>
        </>
      ) : null}
    </div>
  );
};

export default WorkTimeModal;
