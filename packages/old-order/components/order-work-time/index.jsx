import { Ant, showAlert, showError, WhiteBox } from '@vezubr/elements';
import { Orders as OrderService } from '@vezubr/services';
import moment from 'moment-timezone';
import React, { useCallback } from 'react';
import WorkTimeForm from './elements/work-time-form';
import './styles.scss';

export const getDateInUtc = (date, tz) => moment.tz(date, tz).utc();
export const getAddressId = (add) => `${add?.id}-${add?.position}`;

const WorkTime = (props) => {
  const { order, reload, onActiveSave } = props;

  const [loading, setLoading] = React.useState(false)

  const onSave = useCallback(
    async (addresses, dates) => {
      try {
        let points = [];
        let alertText = ''
        let needToReloadPage = false; 

        const canFinish = !dates.filter(
          (el) =>
            !el.skipped &&
            (el.start === null || el.start === 'Invalid date' || el.end === null || el.end === 'Invalid date'),
        ).length;

        const data = {
          id: order?.id,
          points: dates.map(({ position, newPosition }) => ({ position, newPosition })),
        };
        setLoading(true)
        if (order?.type !== 2) {
          await OrderService.updatePointsPositions(data);
        }

        addresses.forEach((el, index) => {
          const addressDate = dates?.find((date) => date.id == getAddressId(el));
          if (addressDate) {
            const { newPosition, start, end } = addressDate;

            if ((start || end) && (!el.workStartedAt || !el.completedAt)) {
              const temp = {
                position: newPosition,
              };

              if (start && !el.workStartedAt) {
                temp.startedAt = moment(start).format('YYYY-MM-DD HH:mm:ss');
              }
              if (end && !el.completedAt) {
                temp.completedAt = moment(end).format('YYYY-MM-DD HH:mm:ss');
              }

              points.push(temp);
            }
          }
        });

        await OrderService.pointStatusUpdate({ id: order?.id, data: { points } });
        alertText = alertText + 'Время на точках было успешно обновлено. '
        
        if (canFinish) {
          await OrderService.executionEnd(order.id);
          await OrderService.finalize({orderId: order.id});
          needToReloadPage = true
          alertText = alertText + 'Рейс был успешно завершен. Чтобы появился расчет по рейсу обновите страницу'
        }
        
        if (!needToReloadPage) {
          showAlert({
            title: '',
            content: alertText,
            onOk: () => {
              reload();
            }
          })
        } else {
          window.location.reload();
        }
      } catch (e) {
        console.error(e);
        let mesgString = '';
        if (e.data?.errors) {
          e.data.errors.forEach((el) => {
            mesgString += `${el?.message}\n`;
          });
        }
        setLoading(false)
        showError(mesgString || e);
      }
    },
    [order, reload],
  );

  return (
    <div className="order-work" id="order-work-time">
      <WhiteBox.Header
        style={{ marginTop: 0 }}
        type={'h2'}
        hr={false}
        icon={<Ant.Icon type={'snippets'} />}
        iconStyles={{ color: '#F57B23' }}
      >
        {'Ручное заполнение информации по рейсу'}
      </WhiteBox.Header>
      <div className="order-work-headers flexbox">
        <div className="order-work-time-address item-title">Адреса</div>
        <div className="order-work-time-diff item-title">Разница с вашей ТЗ</div>
        <div className="order-work-time-dates flexbox">
          <div className="order-work-time-date item-title">Дата и время начала работы на точке</div>
          <div className="item-title order-work-time-date">Дата и время окончания работы на точке</div>
        </div>
      </div>
      <WorkTimeForm order={order} loading={loading} onSave={onSave} onActiveSave={onActiveSave} />
    </div>
  );
};

export default WorkTime;
