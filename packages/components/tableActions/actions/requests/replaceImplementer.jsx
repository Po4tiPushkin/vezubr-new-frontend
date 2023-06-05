import { Ant, Modal, showAlert, showError } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import ProfileUsersSelectList from '../../../profileUsersSelectList';

function ReplaceImplementer(props) {
  const { record, reload } = props;
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const replaceImplementer = useCallback(async (newUser) => {
    setLoading(true)
    try {
      await OrdersService.takeRequest(record?.orderId, {
        employeeId: newUser,
      });
      setLoading(false);
      showAlert({title: 'Заявка успешно переназначена'})
      setShowModal(false);
      reload();
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [record]);

  const textButton = 'Переназначить';

  return (
    <>
      <Ant.Button loading={loading} size="small" type={'outlined'} onClick={() => setShowModal(true)}>
        {textButton}
      </Ant.Button>

      <Modal visible={showModal} width={'85vw'} footer={[]} onCancel={() => setShowModal(false)}>
        <ProfileUsersSelectList
          onCancel={() => setShowModal(false)}
          onSave={(e) => replaceImplementer(e[0])}
          defaultParams={{ employeeRoles: [14] }}
          submitButtonText={'Передать в работу'}
        />
      </Modal>
    </>
  );
}

ReplaceImplementer.propTypes = {
  record: PropTypes.object.isRequired,
};

export default ReplaceImplementer;
