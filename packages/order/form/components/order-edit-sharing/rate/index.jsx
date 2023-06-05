import React, { useEffect, useState, useMemo } from 'react';
import { Modal, showError, showAlert, Ant } from '@vezubr/elements';
import PropTypes from 'prop-types';
import ActionEditSharingContent from '../content';
import { Common as CommonService, Contractor as ContractorService } from '@vezubr/services';
import { getProducersForOrder } from '../../../utils';
const createTreeData = (list) => {
  if (!Array.isArray(list)) {
    return [];
  }
  const treeData = [{ title: 'Все подрядчики', children: [], value: 0, key: 0 }];
  list.forEach((el) => {
    const treeElement = {
      value: el.id,
      key: el.id,
      title: el.title || `ИНН: ${el.inn}` || `ID: ${el.id}`,
      disabled: el.contours[0].status == 1 || !el.activeContract,
    };
    treeData[0].children.push(treeElement);
  });
  return treeData;
};

function ActionEditSharingRate(props) {
  const { order, showModal, closeModal, history } = props;

  const [dataAllParties, setDataAllParties] = useState(null); // all producers, for working with checkbox
  const [sharingProducers, setSharingProducers] = useState(null); // only true producers
  const [checkedValues, setCheckedValues] = useState([]);
  const [rate, setRate] = useState(0);
  const [reason, setReason] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const allProds = await getProducersForOrder(
          order?.orderType || order?.type,
          order?.data?.points || order?.points,
          order?.data?.vehicleType || order?.vehicleType,
        );
        const prodsInSharing = await CommonService.getSharingListProducer({ id: order.id });

        if (!prodsInSharing.length) {
          return history.push(`/republish-order/${order.id}`);
        }
        setSharingProducers(
          prodsInSharing.map((el) => {
            return el.id;
          }),
        );
        setCheckedValues(
          prodsInSharing.map((el) => {
            return el.id;
          }),
        );
        setRate(prodsInSharing[0].rate);

        setDataAllParties(allProds);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const apply = async () => {
    try {
      const deletingArr = [];
      if (Array.isArray(sharingProducers)) {
        sharingProducers.forEach((el) => {
          if (!checkedValues.find((item) => item === el)) {
            deletingArr.push(el);
          }
        });
      }
      if (deletingArr.length) {
        await CommonService.deleteContractorSharing(order.id, { producerIds: deletingArr, reason });
      }

      const appoints = checkedValues.map((el) => {
        return {
          producer: el,
          rate: rate,
        };
      });

      if (checkedValues.length) {
        await CommonService.createManualSharingForEdit(order.id, { strategyType: 'rate', appoints });
      }
      closeModal(true);
      showAlert({
        content: 'Изменения шаринга сохранены',
      });
    } catch (e) {
      console.error(e);
      closeModal();
      showError({
        message: e.data?.errors[0]?.message || '',
      });
    }
  };

  const onChange = (value) => {
    setCheckedValues(value);
  };

  const isDeleting = useMemo(() => {
    if (!sharingProducers || !checkedValues) {
      return false;
    }
    return sharingProducers.some((el) => {
      if (!checkedValues.find((item) => item === el)) {
        return true;
      }
    });
  }, [sharingProducers, checkedValues]);

  return (
    <>
      <Modal
        title={`Редактирование Шаринга для Подрядчиков на ${
          order?.data?.orderNr || order?.orderNr ? 'рейсе' : 'заявке'
        } № ${order?.data?.orderNr || order?.orderNr || order?.data?.requestNr || order?.requestNr || ''}`}
        width={700}
        maskClosable={true}
        visible={showModal}
        centered={false}
        onCancel={closeModal}
        destroyOnClose={true}
        footer={[
          <Ant.Button onClick={closeModal}>Отмена</Ant.Button>,
          <Ant.Button onClick={apply} type={'primary'} disabled={isDeleting && !reason}>
            OK
          </Ant.Button>,
        ]}
      >
        <ActionEditSharingContent
          onChange={onChange}
          treeData={createTreeData(dataAllParties)}
          expandAll={true}
          checkedValues={checkedValues}
          isDeleting={isDeleting}
          reason={reason}
          setReason={setReason}
        />
      </Modal>
    </>
  );
}

ActionEditSharingRate.propTypes = {
  order: PropTypes.object.isRequired,
  children: PropTypes.func.isRequired,
};
export default ActionEditSharingRate;
