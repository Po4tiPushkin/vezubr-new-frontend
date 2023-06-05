import { Ant, Modal, showError } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import React, { useCallback, useState, useMemo } from 'react';
import OrderEditSharing from '@vezubr/order/form/components/order-edit-sharing';
function RepublishRequest(props) {
  const { record, reload } = props;
  const [showModal, setShowModal] = useState(false);

  const textButton = 'Перепубликовать';

  const closeModal = useCallback((e) => {
    setShowModal(false)
    if (e) {
      reload();
    }
  }, [])

  const renderModal = useMemo(() => (
    <OrderEditSharing
      order={{
        ...record,
        id: record.orderId,
        republishStrategyType: record.republishingStrategy,
        points: [record.firstPoint, record.lastPoint],
        vehicleType: record?.requiredVehicleTypeId
      }}
      showModal={true}
      closeModal={(e) => closeModal(e) }
    />
  ), [record?.orderId]);



  return (
    <>
      <Ant.Button size="small" type={'outlined'} onClick={() => setShowModal(true)}>
        {textButton}
      </Ant.Button>
      {showModal && renderModal}
    </>
  );
}

export default RepublishRequest;
