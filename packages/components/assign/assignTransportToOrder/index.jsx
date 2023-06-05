import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization';
import { Modal, showConfirm, showError } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import React, { useCallback, useMemo, useState } from 'react';
import AssignTransportToOrderPage from './components/page';
import Tabs from './components/tabs';
const getErrorType = (e) => {
  if (e.data?.errors?.[0]?.message?.includes('Грузоподъемность')) {
    return 'liftingValidation';
  }
  if (
    Array.isArray(e.data?.errors) &&
    e.data.errors.find((el) => el.propertyName === 'isAgreeWithAdditionalRequirements')
  ) {
    return 'additionalRequirements';
  }
  if (e?.message && e?.message.includes('busy')) {
    return 'busy';
  }
  return null;
};

const BUSY_TYPES = {
  driver: 'Водитель',
  transport: 'ТС',
  tractor: 'Тягач',
};

const AssignTransportToOrder = (props) => {
  const { order = {}, onClose, isAppointment, showPhone, closeModal } = props;
  const [activeTab, setActiveTab] = useState(0);
  const tabs = useMemo(
    () => [
      {
        title: 'Подходящие ТС',
        active: !activeTab,
      },
      {
        title: 'Не подходящие ТС',
        active: activeTab,
      },
    ],
    [activeTab],
  );

  const assign = useCallback(async ({ transport, payload }) => {
    if (isAppointment) {
      await OrdersService.appoint(order?.id, payload);
    } else {
      if (APP === 'operator') {
        payload = {
          ...payload,
          producerId: transport?.vehicle?.producerId,
        };
        await OrdersService.requestReplacement(payload);
      } else {
        await OrdersService.requestReplacement({ id: order?.id, data: payload });
      }
    }
    onClose({
      showSuccessMessage: true,
    });
  }, []);

  const errorHandler = useCallback(async ({ e, payload, transport }) => {
    const errorType = getErrorType(e);
    switch (errorType) {
      case 'liftingValidation':
        showConfirm({
          title: e.data?.errors?.[0]?.message + '. Продолжить?',
          onOk: async () => {
            payload = {
              ...payload,
              isLiftingValidationRequired: false,
            };
            try {
              await assign({ transport, payload });
            } catch (e) {
              errorHandler({ e, payload, transport });
            }
          },
          width: 500,
        });
        break;
      case 'additionalRequirements':
        showConfirm({
          title:
            (e.data.errors.length > 1
              ? e.data.errors.reduce((el, currentEl) => el.message + ' ' + currentEl.message)
              : e.data.errors[0]?.message) + '\nПродолжить?',
          onOk: async () => {
            payload = {
              ...payload,
              isAgreeWithAdditionalRequirements: true,
            };
            try {
              await assign({ transport, payload });
            } catch (e) {
              errorHandler({ e, payload, transport });
            }
          },
          width: 500,
        });
        break;
      case 'busy':
        let busyTypes = '';
        e.message.split(':').forEach((el) => {
          if (BUSY_TYPES[el]) {
            busyTypes += `${BUSY_TYPES[el]}, `;
          }
        });
        busyTypes.slice(0, -1);
        showConfirm({
          title: `Время выполнения данного Рейса пересекается со временем выполнения Рейса,
              на который уже назначены выбранный/ые ${busyTypes}.
              Подтвердите Выбор нажав кнопку Да или Нет.
              Для уточнения информации о назначенных Рейсах - перейдите в График Занятости ${busyTypes}`,
          onOk: async () => {
            try {
              await assign({ transport, payload });
            } catch (e) {
              errorHandler({ e, payload, transport });
            }
          },
          width: 500,
        });
        break;
      default:
        showError(e);
    }
  }, []);

  const selectTransport = useCallback(async ({ transport, driver, tractor }) => {
    try {
      const payload = {
        driver: driver?.driver?.id,
        vehicle: transport?.vehicleData?.id,
        isLiftingValidationRequired: true,
        isAgreeWithAdditionalRequirements: false,
      };
      if (tractor?.id) {
        payload.tractor = tractor.id;
      }
      try {
        if (
          driver?.driver?.employmentStatus === 'busy' ||
          transport?.employmentStatus === 'busy' ||
          tractor?.employmentStatus === 'busy'
        ) {
          let errorString = '';
          [
            { ...driver?.driver, type: 'driver' },
            { ...transport, type: 'transport' },
            { ...tractor, type: 'tractor' },
          ].forEach((el) => {
            if (el?.employmentStatus === 'busy') {
              errorString += `:${el.type}`;
            }
          });
          throw new Error(`busy:${errorString}`);
        }
        await assign({ transport, payload });
      } catch (e) {
        errorHandler({ e, payload, transport });
      }
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, []);

  return (
    <Modal visible={true} width={900} bodyStyle={{ padding: '0' }} footer={null} onCancel={() => closeModal()}>
      <div className="assignModal">
        <div className="assignModal__title">
          {!isAppointment ? 'Замена водителя и ТС' : `${t.order('assignOrderToTransport')}`}
          {` № ${order?.requestNr} на ${Utils.formatDate(order?.toStartAtLocal, 'DD MMMM YYYY, HH:mm')}`}
        </div>
        <div className="assignModal__pages">{<Tabs tabs={tabs} setActiveTab={setActiveTab} />}</div>
        <AssignTransportToOrderPage
          order={order}
          showPhone={showPhone}
          isStrict={!activeTab}
          selectTransport={selectTransport}
        />
      </div>
    </Modal>
  );
};

export default AssignTransportToOrder;
