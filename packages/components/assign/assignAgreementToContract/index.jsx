import React from 'react';
import PropTypes from 'prop-types';
import { Ant, Modal, showError, showAlert } from '@vezubr/elements';
import { Contracts as ContractsService } from '@vezubr/services';
import AssignAgreementToContractForm from './form'

function AssignAgreementToContract(props) {
  const { agreementId, contractorId, setReload, ...otherProps } = props;

  const [visible, setVisible] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);
  const [dataSource, setDataSource] = React.useState(agreementId || []);
  const [saving, setSaving] = React.useState(false);

  const toggleModal = React.useCallback(() => {
    setVisible(!visible);
  }, [visible]);

  const assignToContract = React.useCallback(async (value) => {
    const reqData = {
      contract: value
    }
    try {
      await ContractsService.assignAgreementToContract(agreementId, reqData)
      showAlert({
        title: 'ДУ было успешно привязано'
      })
      setVisible(false);
      if (setReload) {
        setReload();
      }
    } catch (e) {
      console.error(e)
      showError(e)
    }
  }, [])

  const textButton = 'Прикрепить';
  const titleModal = 'Прикрепление ДУ к договору';
  return (
    <>
      <Ant.Button size="small" type={'default'} onClick={toggleModal} {...otherProps}>
        {textButton}
      </Ant.Button>

      <Modal
        title={titleModal}
        visible={visible}
        bodyNoPadding={true}
        centered={true}
        onCancel={toggleModal}
        destroyOnClose={true}
        footer={null}
      >
        <AssignAgreementToContractForm agreementId={agreementId} contractorId={contractorId} assignToContract={assignToContract}/>
      </Modal>
    </>
  );
}

AssignAgreementToContract.propTypes = {
  agreementId: PropTypes.number,
  contractorId: PropTypes.string,
};

export default AssignAgreementToContract;
