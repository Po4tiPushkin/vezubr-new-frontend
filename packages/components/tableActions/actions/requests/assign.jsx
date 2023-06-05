import { Ant, Modal, showError, showAlert } from '@vezubr/elements';
import { Orders as OrderService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { AssignLoadersToOrderNew } from '../../..';
import AssignTransportToOrder from '../../../assign/assignTransportToOrder';

function AssignRequest(props) {
  const { record, reload } = props;
  const user = useSelector((state) => state.user);
  const vehicleTypes = useSelector(state => state.vehicleTypes)
  const [showModal, setShowModal] = useState(false);
  const onAssign = useCallback((e, err) => {
    if (!e && !err) {
      setShowModal(false);
    }
    if (e) {
      if (!err) {
        setShowModal(false);
        showAlert(
          {
            content: 'Рейс принят',
            onCancel: () => { reload() },
            onOk: () => { reload() }
          }
        )
        return;
      }
      else {
        let errMessage = typeof err === 'string' ? err : err?.message || err?.error_str;
        if (typeof errMessage !== 'string') {
          errMessage = 'Не удалось назначить ТС на рейс';
        }
        showError(errMessage);
      }
    }
  }, []);

  const appointLoaders = useCallback(async (loaders = []) => {
    try {
      const loadersIds = loaders.map(el => String(el.id));
      const brigadier = loadersIds?.[0];
      await OrderService.appointLoaders(record?.orderId, { brigadier, loaders: loadersIds.filter(el => el !== brigadier) });
      setShowModal(false);
      reload();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [record])

  const textButton = 'Назначить ТС';

  const renderAssign = useMemo(() => {
    return (
      <>
        {showModal &&
          (
            record.orderType === 2
              ?
              <AssignLoadersToOrderNew
                showModal={true}
                assignedLoaders={[]}
                isAppointment={true}
                onSelect={appointLoaders}
                onClose={() => setShowModal(false)}
                minLoaders={1}
                requiredLoaderSpecialities={{}}
              />
              :
              <AssignTransportToOrder
                order={
                  {
                    ...record,
                    id: record.orderId,
                    startAtLocal: record.toStartAt,
                    type: record.orderType
                  }
                }
                showModal={true}
                closeModal={() => setShowModal(false)}
                userId={user.id}
                isAppointment={true}
                vehicleTypes={vehicleTypes}
                showPhone={true}
                onClose={(e, err) => onAssign(e, err)}
              />
          )
        }
      </>
    )
  }, [reload, record?.orderId, showModal])

  return (
    <>
      <Ant.Button size="small" type={'outlined'} onClick={() => setShowModal(true)}>
        {textButton}
      </Ant.Button>
      {renderAssign}
    </>
  );
}

export default AssignRequest;
