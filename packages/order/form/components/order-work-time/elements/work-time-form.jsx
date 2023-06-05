import AddressItem from '@vezubr/address/elements/address-item';
import { Ant, IconDeprecated, Modal, showError, VzForm } from '@vezubr/elements';
import _compact from 'lodash/compact';
import moment from 'moment-timezone';
import React, { useCallback, useMemo, useState } from 'react';
import { getAddressId, getDateInUtc } from '..';
import WorkTimeModal from './work-time-modal';

const getDefaultFormatOfDates = (address) => ({
  id: getAddressId(address),
  position: address?.position,
  error: null,
  start: address?.workStartedAt || null,
  end: address?.completedAt || null,
  tz: address?.timeZoneId || 'Europe/Moscow',
  skipped: address?.skipped,
  disabled: !!(address?.workStartedAt && address?.completedAt),
  diff: (moment().tz(address?.timeZoneId || address?.timezone).utcOffset() - moment().utcOffset()) / 60,
});

const WorkTimeForm = (props) => {
  const { order, onSave, loading } = props;

  const [errors, setErrors] = useState({});
  const [showModal, setShowModal] = useState(false);
  const addresses = useMemo(() => order?.points, [order?.points]);

  const [dates, setDates] = useState(addresses?.map(getDefaultFormatOfDates));

  React.useEffect(() => {
    setDates(addresses?.map(getDefaultFormatOfDates));
  }, [addresses]);

  const fillDates = React.useCallback(() => {
    const firstAddr = dates[0]
    const lastAddr = dates[dates.length - 1]
    let newDates = [...dates]
    if (firstAddr.start && lastAddr.end) {
      for (let i = 0; i < newDates.length; i++) {
        if (newDates[i].disabled) {
          continue;
        }
        if (i > 0) {
          newDates[i].start = moment
            .tz(newDates[i - 1].end, 'YYYY-MM-DD HH:mm:ss', newDates[i - 1].tz)
            .tz(newDates[i].tz)
            .add(1, 'second')
            .format('YYYY-MM-DD HH:mm:ss');
        }
        if (i !== newDates.length - 1) {
          newDates[i].end = moment(newDates[i].start).add(1, 'second').format('YYYY-MM-DD HH:mm:ss');
        }
      }
      setDates([...newDates])
    }
  }, [dates])

  const disabledDate = (date) => {
    // любая введённая дата должна быть в пределах от -40 до +1 от текущего дня
    const currentDate = moment(date);
    const nextDay = moment().startOf('day').add(2, 'day');
    return (
      currentDate.isAfter(nextDay) ||
      currentDate.isBefore(moment(order?.startAtLocal).subtract(1, 'day')) ||
      false
    );
  };

  const canFinish = useMemo(() => {
    return !dates.filter(
      (el) => el.start === null || el.start === 'Invalid date' || el.end === null || el.end === 'Invalid date',
    ).length;
  }, [dates, order]);

  const datesSorted = useMemo(
    () =>
      [...dates]
        .sort((a, b) => {
          if (a.skipped || b.skipped) {
            if (a.start && b.start) {
              return getDateInUtc(a.start, a.tz) - getDateInUtc(b.start, b.tz);
            } else if (a.start && !b.skipped) {
              return -1;
            } else if (b.start && !a.skipped) {
              return 1;
            } else {
              return 0;
            }
          } else {
            return 0;
          }
        })
        .map((item, index) => ({ ...item, newPosition: index + 1 })),
    [dates],
  );

  const handleSave = React.useCallback(async () => {
    if (onSave) {
      await onSave(addresses, datesSorted);
    }
    setShowModal(false);
  }, [addresses, datesSorted]);

  const onChange = useCallback(
    (start, date, index) => {
      const newDates = dates?.map((item, indexDate) => {
        if (item.id == index) {
          return {
            ...item,
            [start ? 'start' : 'end']: date ? moment(date, 'DD.MM.YYYY HH:mm').add(start ? indexDate * 2 : (indexDate * 2) + 1, 'seconds').format('YYYY-MM-DD HH:mm:ss') : null,
          };
        }
        return item;
      });

      const errors = {};
      newDates.forEach((item, index, arr) => {
        const { start, end, id, tz, skipped } = item;
        if (!skipped) {
          const prevItem = arr[index - 1];
          if (prevItem && prevItem.disabled) {
            const { end: prevEnd, tz: prevTz } = prevItem;
            if (getDateInUtc(prevEnd, prevTz) > getDateInUtc(start, tz)) {
              errors[id] = {
                field: 'start',
                text: 'Время начала работы на точке не может быть меньше времени завершения работы на предыдущей точке',
              };
            }
          }
          if (getDateInUtc(end, tz) < getDateInUtc(start, tz)) {
            errors[id] = {
              field: 'end',
              text: 'Время окончания не может быть меньше времени начала',
            };
          }

          /**
           * Проверка на пересечение периодов
           */

          const intersectedStart = arr?.find((value) => {
            return (
              value.id !== id &&
              getDateInUtc(start, tz) >= getDateInUtc(value.start, value.tz) &&
              getDateInUtc(start, tz) <= getDateInUtc(value.end, value.tz)
            );
          });
          const intersectedEnd = arr?.find((value) => {
            return (
              value.id !== id &&
              getDateInUtc(value.start, value.tz) >= getDateInUtc(start, tz) &&
              getDateInUtc(value.start, value.tz) <= getDateInUtc(end, tz)
            );
          });
          if (intersectedStart) {
            errors[id] = {
              field: 'start',
              text: `Промежутки времени не могут пересекаться ${intersectedStart.tz !== tz ? ' (проблема с часовыми поясами)' : ''
                }`,
            };
          } else if (intersectedEnd) {
            errors[id] = {
              field: 'end',
              text: `Промежутки времени не могут пересекаться ${intersectedEnd.tz !== tz ? ' (проблема с часовыми поясами)' : ''
                }`,
            };
          }
        }
      });

      setErrors(errors);
      setDates(newDates);
    },
    [dates],
  );

  const renderDates = useMemo(
    () => (
      <div className="order-work-time-rows">
        {addresses?.map((address, index) => {
          const addressDate = dates?.find((date) => date.id == getAddressId(address));
          const label =
            index === 0 ? 'Адрес подачи' : index === addresses?.length - 1 ? 'Адрес доставки' : 'Промежуточный адрес';
          if (addressDate) {
            const { id, position, start, end, diff } = addressDate;
            return (
              <div className="order-work-time-row" key={index}>
                <div className="order-work-time-address">
                  <AddressItem
                    address={address}
                    addresses={addresses}
                    index={id}
                    label={label}
                    useFavorite={false}
                    disabled={!!address?.skipped}
                    isDisableMove={true}
                    canChange={true}
                    key={address.guid}
                  >
                    {_compact([address?.id, address?.externalId, address?.addressString || address?.address]).join(
                      '/ ',
                    )}
                  </AddressItem>
                </div>
                <div className="order-work-time-diff">
                  <Ant.Input
                    disabled={true}
                    className={'disabled'}
                    defaultValue={diff > 0 ? `+${diff}` : diff}
                    style={{
                      fontWeight: diff !== 0 ? 'bold' : 'regular',
                    }}
                  />
                </div>
                <div className="order-work-time-dates">
                  <div className="order-work-time-date" key={`start-${id}`}>
                    <Ant.DatePicker
                      id={index === 0 ? 'order-worktime-first' : ''}
                      className={`${address?.workStartedAt || address?.skipped ? 'disabled' : ''} ${errors[id]?.field == 'start' ? 'with-error' : ''
                        }`}
                      style={
                        errors[id]?.field == 'start'
                          ? {
                            border: '1px solid red',
                            borderRadius: '4px',
                          }
                          : {}
                      }
                      disabled={!!(address?.workStartedAt || address?.skipped)}
                      defaultValue={start ? moment(start) : null}
                      value={start ? moment(start) : null}
                      disabledDate={(date) => disabledDate(date)}
                      onChange={(e, date) => onChange(true, date, id)}
                      showTime
                      allowClear={false}
                      placeholder={'дд.мм.гггг чч:мм'}
                      format={['DD.MM.YYYY HH:mm', 'YYYY-MM-DD HH:mm']}
                    />
                    {errors[id]?.field == 'start' ? (
                      <div className={'date-error'} title={errors[id]?.text}>
                        <IconDeprecated name={'danger'} />
                      </div>
                    ) : null}
                  </div>
                  <div className="order-work-time-date" key={`end-${id}`}>
                    <Ant.DatePicker
                      id={index === addresses?.length - 1 ? 'order-worktime-last' : ''}
                      className={`${address?.completedAt || address?.skipped ? 'disabled' : ''} ${errors[id]?.field == 'end' ? 'with-error' : ''
                        }`}
                      style={
                        errors[id]?.field == 'end'
                          ? {
                            border: '1px solid red',
                            borderRadius: '4px',
                          }
                          : {}
                      }
                      disabled={!!(address?.completedAt || address?.skipped)}
                      defaultValue={end ? moment(end) : null}
                      value={end ? moment(end) : null}
                      placeholder={'дд.мм.гггг чч:мм'}
                      format={['DD.MM.YYYY HH:mm', 'YYYY-MM-DD HH:mm']}
                      showTime
                      allowClear={false}
                      disabledDate={(date) => disabledDate(date)}
                      onChange={(e, date) => onChange(false, date, id)}
                    />
                    {errors[id]?.field == 'end' ? (
                      <div className={'date-error'} title={errors[id]?.text}>
                        <IconDeprecated name={'danger'} />
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    ),
    [order, dates, errors, addresses],
  );

  const validateAndOpenModal = useCallback(() => {
    if (Object.values(errors).find((item) => item !== null)) {
      showError('Исправьте ошибки в форме');
      return;
    }
    setShowModal(true);
  }, [dates, setShowModal, errors]);

  const onCloseModal = useCallback(() => {
    setShowModal(false);
  }, [setShowModal]);

  const canFill = React.useMemo(() => {
    return dates[0].start && dates[dates.length - 1].end
  }, [dates, canFinish])

  return (
    <div className="order-work-time">
      {addresses && (
        <>
          {renderDates}
          <Modal
            title={'Предупреждение'}
            visible={showModal}
            centered={true}
            destroyOnClose={true}
            footer={
              <div className="order-work-modal-actions flexbox">
                <Ant.Button id={'order-worktime-cancel'} style={{ marginRight: '15px' }} loading={loading} onClick={onCloseModal}>
                  Назад
                </Ant.Button>
                <Ant.Button id={'order-worktime-accept'} type={'primary'} loading={loading} onClick={handleSave}>
                  {canFinish ? 'Подтвердить и завершить рейс' : 'Подтвердить'}
                </Ant.Button>
              </div>
            }
            width={600}
            onCancel={onCloseModal}
          >
            <WorkTimeModal addresses={addresses} dates={datesSorted} />
          </Modal>
          <div className="actions flexbox" style={{ marginTop: '20px', marginLeft: '', alignItems: 'center' }}>
            {!canFinish ? (
              <Ant.Button
                type={'default'}
                onClick={fillDates}
                disabled={!canFill}
                title={canFill ? '' : 'Чтобы заполнить точки необходимо заполнить даты начала и конца'}
                id={'order-worktime-fill'}
              >
                {'Заполнить автоматически'}
              </Ant.Button>
            ) : (
              null
            )}
            {order?.orderUiState?.state < 400 ? (
              <Ant.Button
                type={'primary'}
                style={{ marginTop: '20px', marginLeft: 'auto', alignItems: 'center' }}
                onClick={validateAndOpenModal}
                disabled={!dates.find((date) => date?.start || date?.end) || Object.entries(errors).length}
                id={'order-worktime-save'}
              >
                {canFinish ? 'Завершить рейс' : 'Сохранить изменения'}
              </Ant.Button>
            ) : (
              <></>
            )}
          </div>

        </>
      )}
    </div>
  );
};

export default WorkTimeForm;
