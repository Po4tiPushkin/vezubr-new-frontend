import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Orders as OrdersService, Vehicle as VehicleService } from '@vezubr/services';
import { showError, Modal, Loader, Ant, showConfirm, Page } from '@vezubr/elements';
import useTabs from './hooks/useTabs';
import t from '@vezubr/common/localization';
import { Search, Content, Tabs } from './elements';
import _compact from 'lodash/compact';
import _isEmpty from 'lodash/isEmpty';
import _uniqBy from 'lodash/uniqBy';
import Utils from '@vezubr/common/common/utils';
import { useSelector } from 'react-redux'
import TRANSPORT_ORDER
  from '@vezubr/common/assets/agreements/Общие условия перевозки груза автомобильным транспортом.pdf';
import AssignTransportToOrderPage from './components/page';
const AssignTransportToOrder = (props) => {
  const { showModal, data, order = {}, onClose, isAppointment, vehicleTypes, showPhone, closeModal } = props;
  const [activeTab, setActiveTab] = useState(0);
  const tabs = useMemo(() => [
    {
      title: 'Подходящие ТС',
      active: !activeTab,
    },
    {
      title: 'Не подходящие ТС',
      active: activeTab,
    }
  ], [activeTab]);

  const renderTabs = useMemo(() => {
    const t = tabs.map((val, key) => (
      <a className={`vz-tab ${val.active ? 'active' : ''}`} key={key} onClick={(e) => { e.preventDefault(); setActiveTab(key) }}>
        {val.title}
      </a>
    ));
    return <div className={'vz-tabs'}>{t}</div>;
  }, [tabs])
  const assign = React.useCallback(async (transport, payload) => {
    if (isAppointment) {
      await OrdersService.appoint(data?.id, payload);
    } else {
      if (APP === 'operator') {
        payload = {
          ...payload,
          producerId: transport?.vehicleData?.producerId,
        };
        await OrdersService.requestReplacement(payload);
      }
      else {
        await OrdersService.requestReplacement({ id: data?.id, data: payload })
      }
    }
    const title = t.common(`Рейс № ${data?.orderNr}`);
    const description = t.common('Принят к исполнению');
    onClose({
      showSuccessMessage: true,
      title,
      sTitle: false,
      description,
    });
  }, [])
  const selectTransport = useCallback(async (transport, driver, tractor) => {
    try {
      let payload = {
        driver: driver?.driver?.id,
        vehicle: transport?.vehicleData?.id,
        isLiftingValidationRequired: true,
        isAgreeWithAdditionalRequirements: false,
      };
      if (tractor?.id) {
        payload = {
          ...payload,
          tractor: tractor.id
        }
      }
      try {
        await assign(transport, payload)
      } catch (e) {
        console.error(e)
        if (e.data?.errors?.[0]?.message?.includes('Грузоподъемность')) {
          await showConfirm({
            title: e.data?.errors?.[0]?.message + '. Продолжить?',
            onOk: async () => {
              payload = {
                ...payload,
                isLiftingValidationRequired: false
              }
              try {
                await assign(transport, payload)
              }
              catch (e) {
                showError(e);
              }
            },
            width: 500
          })
        }
        else
        if (Array.isArray(e.data?.errors) && e.data.errors.find(el => el.propertyName === 'isAgreeWithAdditionalRequirements')) {
          showConfirm(
            {
              title: (e.data.errors.length > 1 ?
                e.data.errors.reduce((el, currentEl) => el.message + ' ' + currentEl.message)
                :
                e.data.errors[0]?.message)
                + '\nПродолжить?',
              onOk: async () => {
                payload = {
                  ...payload,
                  isAgreeWithAdditionalRequirements: true
                }
                try {
                  await assign(transport, payload)
                }
                catch (e) {
                  showError(e);
                }
              },
              width: 500,
            },
          )
        }
        else {
          showError(e);
        }
      }
    } catch (e) {
      console.error(e);
      showError(e);
    } finally {
    }
  }, [isAppointment, data?.id, onClose])

  useEffect(() => {

    return () => {
      onClose();
    }
  }, []);

  return (
    <Modal
      visible={showModal}
      width={900}
      bodyStyle={{ 'padding': '0' }}
      footer={
        <div className={'text-center'}>
          <span className={'text-middle'}>
            {`Назначая на  рейс ТС и водителя, вы соглашаетесь с `}
            <span className={'download-document'} onClick={() => window.open(TRANSPORT_ORDER)} >
              Общими условиями перевозки груза
            </span>
            .
          </span>
        </div>
      }
      onCancel={() => closeModal()}
    >
      <div className='assignModal'>
        <div className='assignModal__title'>
          {!isAppointment ?
            'Замена водителя и ТС'
            :
            `${t.order(data?.type === 2 ? 'assignLoaderToTransport' : 'assignOrderToTransport')}`
          }
          {` № ${data?.orderNr} на ${Utils.formatDate(data?.toStartAtLocal, 'DD MMMM YYYY, HH:mm')}`}
        </div>
        <div className="assignModal__pages">
          {renderTabs}
        </div>
        <AssignTransportToOrderPage
          data={data}
          order={order}
          vehicleTypes={vehicleTypes}
          showPhone={showPhone}
          isStrict={!activeTab}
          selectTransport={selectTransport}
        />
      </div>
    </Modal>
  )
}

export default AssignTransportToOrder;