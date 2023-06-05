import React from 'react';
import PropTypes from 'prop-types';
import { showError } from '@vezubr/elements';
import _pullAll from 'lodash/pullAll';
import { Ant, Modal } from '@vezubr/elements';
import TariffChooseTariffsForm from '../forms/tariff-choose-tariffs-form';
import { Tariff as TariffService } from '@vezubr/services';
import loaderTariffList from '../loaders/loaderTariffList';
import usePrevious from '@vezubr/common/hooks/usePrevious';

function TariffSetTariffButton(props, context) {
  const { observer } = context;

  const {
    onUpdated,
    contourId,
    clientId,
    producerId,
    dictionaries,
    textButton: textButtonInput,
    titleModal: titleModalInput,
    tariffList,
    onChangeVisibilityModal,
    tariffs,
    ...otherProps
  } = props;

  const tariffListPrev = usePrevious(tariffList);

  const [visible, setVisible] = React.useState(false);
  const [loadingData, setLoadingData] = React.useState(false);
  const [dataSource, setDataSource] = React.useState(tariffList || []);
  const [saving, setSaving] = React.useState(false);

  const appoint = React.useCallback(
    async (selectedRowKeys) => {
      setSaving(true);

      const tariffIds = [...selectedRowKeys];
      _pullAll(tariffIds, tariffs);

      try {
        await TariffService.appoint({
          contourId,
          clientId,
          producerId,
          tariffIds,
        });
        setVisible(false);
        if (onChangeVisibilityModal) {
          onChangeVisibilityModal(false);
        }
        onUpdated();
      } catch (e) {
        console.error(e);
        showError(e);
      }
      setSaving(false);
    },
    [clientId, producerId, contourId, tariffs, onChangeVisibilityModal],
  );

  const toggleModal = React.useCallback(() => {
    if (onChangeVisibilityModal) {
      onChangeVisibilityModal(!visible);
    }
    setVisible(!visible);
  }, [visible, onChangeVisibilityModal]);

  React.useEffect(() => {
    if (!tariffList) {
      const fetchData = async () => {
        setLoadingData(true);
        try {
          const response = await loaderTariffList.load();
          const dataSource = response?.tariffs || response?.data?.tariffs || [];
          setDataSource(dataSource);
        } catch (e) {
          console.error(e);
          showError(e);
        }

        setLoadingData(false);
      };

      fetchData();

      return () => {
        loaderTariffList.unload();
      };
    } else if (tariffListPrev !== tariffList) {
      setDataSource(tariffList);
    }
  }, [tariffList]);

  const textButton = textButtonInput || 'Назначить тариф';
  const titleModal = titleModalInput || 'Назначить тариф';

  return (
    <>
      <Ant.Button size="small" type={'default'} onClick={toggleModal} {...otherProps}>
        {textButton}
      </Ant.Button>

      <Modal
        title={titleModal}
        width={1200}
        visible={visible}
        bodyNoPadding={true}
        centered={true}
        onCancel={toggleModal}
        destroyOnClose={true}
        footer={null}
      >
        <TariffChooseTariffsForm
          dictionaries={dictionaries}
          tariffs={tariffs}
          dataSource={dataSource}
          loading={loadingData}
          saving={saving}
          onSave={appoint}
          onCancel={toggleModal}
          saveText={'Назначить тариф'}
        />
      </Modal>
    </>
  );
}

TariffSetTariffButton.propTypes = {
  textButton: PropTypes.node,
  tariffs: PropTypes.arrayOf(PropTypes.number),
  onUpdated: PropTypes.func.isRequired,
  contourId: PropTypes.number.isRequired,
  producerId: PropTypes.number.isRequired,
  dictionaries: PropTypes.object.isRequired,
  onChangeVisibilityModal: PropTypes.func,
};

TariffSetTariffButton.contextTypes = {
  observer: PropTypes.object,
};

export default TariffSetTariffButton;
