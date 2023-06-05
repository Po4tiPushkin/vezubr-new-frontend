import { Ant, Modal, showAlert, showConfirm, showError, VzForm } from '@vezubr/elements';
import { Requests as RequestsService } from '@vezubr/services';
import PropTypes from 'prop-types';
import React, { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';

function SelectCancellationReason(props) {
  const { record, reload, extra } = props;
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [reason, setReason] = useState('')
  const [showModal, setShowModal] = useState(false);


  const onOk = React.useCallback(async () => {
    setLoading(true)
    try {
      await RequestsService.setSharingCustomProperties(record?.orderId, {
        customProperties: [
          {
            latinName: 'innerDeclineReason',
            values: [
              reason
            ]
          }
        ],
      });
      showAlert({title: 'Причина была сохранена'})
      setShowModal(false);
      reload();
    } catch (e) {
      console.error(e);
      showError(e);
    } finally {
      setLoading(false)
    }
  }, [user, record, reason]);

  const selectCancellationReason = useCallback(async () => {
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
  }, [record, reason]);

  const reasonsOptions = React.useMemo(() => {
    return extra?.reasonsList?.map(({id, reason}) => {
      return <Ant.Select.Option value={reason} key={id}>
        {reason}
      </Ant.Select.Option>
    })
  }, [extra.reasonsList])

  const textButton = 'Указать причину отмены';
  return (
    <>
      <Ant.Button
        loading={loading}
        size="small"
        type={'default'}
        onClick={() => setShowModal(true)}
      >
        {textButton}
      </Ant.Button>
      <Modal
        onCancel={() => setShowModal(false)}
        visible={showModal}
        footer={null}
        title={'Указать причину отмены рейса'}
        width={400}
        centered={true}
        destroyOnClose={true}
      >
        <div>
          <VzForm.Row>
            <VzForm.Col span={24}>
              <VzForm.Item label={'Причина отмены Заявки/Рейса'}>
                <Ant.Select  value={reason} onSelect={(value) => setReason(value)}>
                  {reasonsOptions}
                </Ant.Select>
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
          <div className='flexbox'>
            <Ant.Button
              type='primary'
              className='margin-top-35 margin-left-auto'
              loading={loading}
              disabled={!reason}
              onClick={selectCancellationReason}
            >
              Сохранить
            </Ant.Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

SelectCancellationReason.propTypes = {
  record: PropTypes.object.isRequired,
};

export default SelectCancellationReason;
