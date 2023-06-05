import { Ant, VzForm } from '@vezubr/elements';
import React from 'react';

function ExistingAddressModal(props) {
  const { existingAddresses, onSubmit, modalVisible, currentAddress, setModalVisible, modalText, confirmText } = props;
  const [chosen, setChosen] = React.useState(currentAddress);
  const existingOptions = React.useMemo(() => {
    return existingAddresses.map((address) => {
      const { id, externalId, addressString } = address;
      const addressData = [id, externalId, addressString];
      return (
        <Ant.Select.Option key={id} value={id}>
          {addressData.join(' / ')}
        </Ant.Select.Option>
      );
    });
  }, [existingAddresses]);

  const onChoose = React.useCallback(() => {
    if (onSubmit) {
      onSubmit(existingAddresses.find((item) => item.id == chosen));
    }
  }, [onSubmit, chosen]);

  return (
    <Ant.Modal
      title={'Существующий адрес'}
      visible={modalVisible}
      onCancel={() => setModalVisible(false)}
      bodyStyle={{ backgroundColor: '#fff' }}
      footer={
        <>
          <Ant.Button type={'default'} onClick={() => setModalVisible(false)}>
            Отмена
          </Ant.Button>
          <Ant.Button
            type={'primary'}
            onClick={() => {
              onChoose();
            }}
          >
            {confirmText}
          </Ant.Button>
        </>
      }
    >
      <span>{modalText}</span>
      <VzForm.Row>
        <VzForm.Col span={24}>
          <VzForm.Item label={'Выбор адреса'}>
            <Ant.Select
              filterOption={(input, opt) => {
                return opt.props.children.toLowerCase().includes(input.toLowerCase());
              }}
              showSearch
              value={chosen}
              style={{ width: '100%' }}
              onSelect={(value) => setChosen(value)}
            >
              {existingOptions}
            </Ant.Select>
          </VzForm.Item>
        </VzForm.Col>
      </VzForm.Row>
    </Ant.Modal>
  );
}

export default ExistingAddressModal;
