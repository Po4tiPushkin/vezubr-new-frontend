import React from 'react';
import { Modal, showAlert, showError, Ant } from '@vezubr/elements';
import ActionEditSharingContent from '../content';
import { Common as CommonService, Orders as OrderService, Contractor as ContractorService } from '@vezubr/services';
import * as Utils from '../../../utils';
import _concat from 'lodash/concat';
import _uniq from 'lodash/uniq';
import { getProducersForOrder } from '../../../utils';

const getCalculationHash = (tariffsDynamicsOrderCalculationsData) => {
  const producers = {};
  tariffsDynamicsOrderCalculationsData.sort((a, b) => a.cost - b.cost);
  for (const calcItem of tariffsDynamicsOrderCalculationsData) {
    const { cost, appoints = [], tariff } = calcItem;

    for (const appoint of appoints) {
      const { producerId, contourId, tariffId, contractId } = appoint;

      if (!producerId || !contractId) {
        continue;
      }
      if (producers[producerId]) {
        producers[producerId] = _concat(producers[producerId], { cost, tariff: { ...tariff, contractId } });
      } else {
        producers[producerId] = [{ cost, tariff: { ...tariff, contractId } }];
      }
    }
  }

  return producers;
};

function ActionEditSharingTariff(props) {
  const { order, showModal, closeModal, history } = props;

  const [dataAllParties, setDataAllParties] = React.useState(null); // all producers, for working with checkbox
  const [defaultTariffs, setDefaultTarrifs] = React.useState(null); // only true producers
  const [checkedValues, setCheckedValues] = React.useState(null);
  const [calculations, setCalculations] = React.useState(null);
  const [reason, setReason] = React.useState('');
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const allProds = await getProducersForOrder(
          order?.orderType || order?.type,
          order?.data?.points || order?.points,
          order?.data?.vehicleType || order?.vehicleType,
        );
        const prodsInSharing = await CommonService.getSharingListProducer({ id: order.id });
        const calculation = await OrderService.previewCalculate(order.id);

        const calculationHash = getCalculationHash(Utils.fixCalculate(calculation));

        setCalculations(calculationHash);

        if (!prodsInSharing.length) {
          return history.push(`/republish-order/${order.id}`);
        }

        const producersWithTariffs = prodsInSharing.filter((el) => el.tariffs?.length >= 1) || [];
        const defaultData = producersWithTariffs.map(
          (el) => `${el?.id}:${el?.tariffs[0]?.id}:${el?.tariffs[0]?.contractId}`,
        );

        setDefaultTarrifs(defaultData);
        setCheckedValues(defaultData);
        setDataAllParties(allProds);
      } catch (e) {
        console.error(e);
      }
    };

    fetchData();
  }, []);

  const getTreeData = React.useMemo(() => {
    if (!Array.isArray(dataAllParties)) {
      return [];
    }

    const treeData = [{ title: 'Все подрядчики', disabled: true, children: [], value: 0, key: 0 }];

    dataAllParties.forEach((el, index) => {
      console.log(el);
      const children = calculations[el.id]
        ? calculations[el.id].map((item, count) => {
            return {
              value: `${el.id}:${item.tariff.id}:${item.tariff.contractId}`,
              key: `${el.id}:${item.tariff.id}:${item.tariff.contractId}`,
              title: `${el.title || el.inn}:${item.tariff.title}:${item.tariff.id}:${item.cost / 100}руб.`,
              disabled: !!checkedValues?.find((value) => {
                const val = value.value || value;
                if (typeof value?.value !== 'number') {
                  return (
                    +val.split(':')[0] === el.id &&
                    (+val.split(':')[1] !== item.tariff.id ||
                      (+val.split(':')[1] === item.tariff.id && +val.split(':')[2] !== item.tariff.contractId))
                  );
                }
              }),
            };
          })
        : [];

      const treeElement = {
        value: el.id,
        key: el.id,
        title: el.title || el.inn,
        disabled: el.contours[0].status == 1 || !calculations[el.id] || !el.activeContract,
        children,
      };
      treeData[0].children.push(treeElement);
    });
    return treeData;
  }, [checkedValues, dataAllParties, calculations, defaultTariffs]);

  const apply = async () => {
    try {
      const deletingArr = [];

      if (defaultTariffs.length) {
        defaultTariffs.forEach((item) => {
          if (!checkedValues.find((value) => +value.split(':')[0] === +item.split(':')[0])) {
            deletingArr.push(+item.split(':')[0]);
          }
        });
      }

      if (deletingArr.length) {
        await CommonService.deleteContractorSharing(order.id, { producerIds: deletingArr, reason });
      }
      if (checkedValues.length) {
        const data = checkedValues.map((el) => {
          const values = el.split(':');
          return {
            producer: +values[0],
            tariff: +values[1],
            contract: +values[2],
          };
        });
        const reqData = {
          appoints: data,
          strategyType: 'tariff',
        };
        await CommonService.createManualSharingForEdit(order.id, reqData);
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

  const changedValues = (value) => {
    const selectedTariffs = Utils.deleteDuplicatedTariffs(value);
    let values = [];
    let producers = [];
    if (selectedTariffs.length) {
      producers = _uniq(selectedTariffs.map((el) => el.split(':')[0]));
      values = producers.map((item) => selectedTariffs.find((el) => +el.split(':')[0] === +item));
    }
    setCheckedValues(values);
  };

  const isDeleting = React.useMemo(() => {
    if (!defaultTariffs?.length || !checkedValues) {
      return false;
    }
    return defaultTariffs.some((item) => {
      if (!checkedValues.find((value) => +value.split(':')[0] === +item.split(':')[0])) {
        return true;
      }
    });
  }, [defaultTariffs, checkedValues]);

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
          onChange={changedValues}
          checkedValues={checkedValues}
          treeData={getTreeData}
          expandAll={false}
          defaultValue={defaultTariffs}
          isDeleting={isDeleting}
          reason={reason}
          setReason={setReason}
        />
      </Modal>
    </>
  );
}

export default ActionEditSharingTariff;
