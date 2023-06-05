import { Ant, showAlert, showConfirm, showError } from '@vezubr/elements';
import { Orders as OrdersService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

function TakeRequest(props) {
  const { record, reload } = props;
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);

  const onOk = React.useCallback(async () => {
    setLoading(true)
    try {
      await OrdersService.takeRequest(record?.orderId, {
        employeeId: user.decoded.userId,
      });
      showAlert({title: 'Заявка взята в работу'})
      reload();
    } catch (e) {
      console.error(e);
      showError(e);
    } finally {
      setLoading(false)
    }
  }, [user, record]);

  const takeRequest = useCallback(async () => {
    setLoading(true);
    try {
      showConfirm({
        title: 'Вы уверены?',
        onOk: async () => {
          onOk();
        },
      });
    } catch (e) {}
    setLoading(false);
  }, [record]);

  const textButton = 'Взять в работу';

  return (
    <Ant.Button
      loading={loading}
      size="small"
      type={'primary'}
      onClick={takeRequest}
    >
      {textButton}
    </Ant.Button>
  );
}

TakeRequest.propTypes = {
  record: PropTypes.object.isRequired,
};

export default TakeRequest;
