import React from 'react';
import PropTypes from 'prop-types';
import Modal from '../../DEPRECATED/modal/modal';
import ContractTypes from '../../contractTypes/contractTypes';
import { Ant, GeoZones as Contracts } from '@vezubr/elements';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/constants';
import _groupBy from 'lodash/groupBy';

import ContractsView from './contractsView';

function getFlatContracts(contractsObject) {
  let contracts = [];
  for (const contourIdString of Object.keys(contractsObject)) {
    contracts = contracts.concat(contractsObject[contourIdString]);
  }
  return contracts;
}

function ContourContracts(props, context) {
  const { contourIds, contours, contracts: contractsInput, contractorContract, onChange } = props;
  const { store } = context;

  const [showContractSelectModal, setShowContractSelectModal] = React.useState(false);
  const [contourIdSelected, setContourIdSelected] = React.useState(null);

  const contoursHash = React.useMemo(() => {
    const contoursHash = {};
    for (const contour of contours) {
      contoursHash[contour.id] = contour;
    }
    return contoursHash;
  }, [contours]);

  const contractsObject = React.useMemo(() => {
    return _groupBy(contractsInput, (contract) => contract.contourId);
  }, [contractsInput]);

  const removeContract = React.useCallback(
    (key, contourId) => {
      const contractsObjectUpdated = { ...contractsObject };

      if (!contractsObjectUpdated[contourId]) {
        return;
      }

      contractsObjectUpdated[contourId] = [...contractsObjectUpdated[contourId]];

      contractsObjectUpdated[contourId].splice(key, 1);

      onChange(getFlatContracts(contractsObjectUpdated));
    },
    [contractsObject],
  );

  const changeContractType = React.useCallback(
    (key, e, contourId) => {
      const contractsObjectUpdated = { ...contractsObject };

      if (!contractsObjectUpdated[contourId]) {
        return;
      }

      contractsObjectUpdated[contourId] = [...contractsObjectUpdated[contourId]];

      contractsObjectUpdated[contourId][key].rate = e.target.value || 0;

      onChange(getFlatContracts(contractsObjectUpdated));
    },
    [contractsObject],
  );

  const onSelectContactType = React.useCallback(
    (data) => {
      const contractsObjectUpdated = {
        ...contractsObject,
      };

      if (!contractsObjectUpdated[data.contourId]) {
        contractsObjectUpdated[data.contourId] = [];
      }

      contractsObjectUpdated[data.contourId] = [...contractsObjectUpdated[data.contourId], data];

      onChange(getFlatContracts(contractsObjectUpdated));

      setShowContractSelectModal(false);
    },
    [contractsObject],
  );

  return (
    <div className={'contour-contracts'}>
      <>
        {contourIds && contourIds.length > 0 ? (
          <Ant.Tabs
            defaultActiveKey={CONTOUR_MAIN_ID}
            type="card"
            animated={{
              inkBar: true,
              tabPane: true,
            }}
          >
            {contourIds.map((contourId) => {
              const contracts = contractsObject?.[contourId] || [];
              return (
                <Ant.Tabs.TabPane tab={contoursHash[contourId].title} key={contourId} closable={true}>
                  <div className={'contour-contracts__tab-content'}>
                    {contracts.length > 0 && (
                      <div className={'flexbox column'}>
                        <ContractsView
                          contracts={contracts}
                          changeContractType={changeContractType}
                          removeContract={removeContract}
                          contractorContract={contractorContract}
                        />
                      </div>
                    )}
                    <div className={'margin-top-8'}>
                      <Contracts
                        className={'size-0_495'}
                        onClick={() => {
                          setContourIdSelected(contourId);
                          setShowContractSelectModal(true);
                        }}
                        //fullAddress={data.address.addressString || ''}
                        name={'address'}
                        placeholder={'Выберите тип договора'}
                        title={'Выбрать тип договора'}
                        data={{}}
                      />
                    </div>
                  </div>
                </Ant.Tabs.TabPane>
              );
            })}
          </Ant.Tabs>
        ) : (
          <p className={'margin-top-10'}>Чтобы добавить договоры, сначала добавьте контур</p>
        )}
      </>
      <Modal
        title={{ text: 'Типы Договоров' }}
        options={{
          showClose: true,
          showModal: showContractSelectModal,
        }}
        size={'small'}
        onClose={() => setShowContractSelectModal(false)}
        noPadding={true}
        animation={false}
        content={
          showContractSelectModal && (
            <ContractTypes
              onSelect={onSelectContactType}
              contourId={contourIdSelected}
              store={store}
              selectedContracts={contractsObject?.[contourIdSelected] || []}
            />
          )
        }
      />
    </div>
  );
}

ContourContracts.propTypes = {
  contourIds: PropTypes.arrayOf(PropTypes.number),
  contours: PropTypes.arrayOf(PropTypes.object),
  contracts: PropTypes.arrayOf(PropTypes.object),
  contractorContract: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
};

ContourContracts.contextTypes = {
  store: PropTypes.object,
};

export default ContourContracts;
