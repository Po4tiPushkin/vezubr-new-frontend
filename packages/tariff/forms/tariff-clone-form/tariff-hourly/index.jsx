import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import { TariffTableConfigProps } from '../../../form-components/tarif-table';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, VzForm, Loader, showAlert } from '@vezubr/elements';
import TariffRegion from '../../../form-components/tariff-region';
import TariffTitle from '../../../form-components/tariff-title';
import withTariffHourlyStore from '../../../hoc/withTariffHourlyStore';
import compose from '@vezubr/common/hoc/compose';
import { TARIFF_HOURLY_DEFAULT_SERVICE, TARIFF_HOURLY_DEFAULT_MOSCOW_SERVICE } from '../../../constants';
import TariffHourlyTable from './tariff-hourly-table';
import TariffFieldHourRange from '../../../form-components/tariff-field-hour-range';
import { Common as CommonService } from '@vezubr/services';
import { TariffContext } from '../../../context';
import TariffTimeRound from '../../../form-components/tariff-time-round';

function compareArray(arr1, arr2) {
  if (arr1.length != arr2.length)
    return false;

  for (var i = 0, l = arr1.length; i < l; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

const getPlaceholder = (placeholders, vehicle, item, type) => {
  let temp = null;
  if (type === 'services') {
    temp = placeholders.serviceCosts?.find(
      el => el.vehicleTypeId === vehicle.vehicleTypeId && el.article === item.article && compareArray(el.bodyTypes, vehicle.bodyTypes)
    );
    if (temp) temp.cost = temp.costPerService;
  }
  if (type === 'baseWorks') {
    temp = placeholders?.baseWorkCosts?.find(el =>
      el.vehicleTypeId === vehicle.vehicleTypeId
      && el.hoursWork === item.hoursWork
      && el.hoursInnings === item.hoursInnings
      && compareArray(el.bodyTypes, vehicle.bodyTypes)
    );
  }
  return temp?.cost;
}

function TariffHourlyForm(props) {
  const {
    territories,
    saving,
    tableConfig,
    loading,
    canceling,
    deleting,
    onSave,
    onCancel,
    clientFormOpen,
    client,
    placeholders,
    costWithVat
  } = props;

  const { store } = React.useContext(TariffContext);

  const handlePublish = useCallback(
    (e) => {
      e.preventDefault();
      if (props.onSave) {
        props.onSave(store);
      }
    },
    [onSave],
  );

  const [marginFilled, setMarginFilled] = React.useState(false);

  const replaceServices = useCallback(
    ({ territoryId, editable }) => {
      if (!editable) {
        return;
      }

      //FIXME временно, информация для доступных сервисов по региону должна браться с бека
      store.setUseServices(
        /моск/gi.test(territories[territoryId]) ? TARIFF_HOURLY_DEFAULT_MOSCOW_SERVICE : TARIFF_HOURLY_DEFAULT_SERVICE,
      );
    },
    [territories],
  );

  useEffect(() => reaction(() => ({ territoryId: store.territoryId, editable: store.editable }), replaceServices), []);

  useEffect(() => {
    if (store.editable && !store.territoryId) {
      const defaultTerritoryId = Object.keys(territories).find((territoryId) =>
        /моск/gi.test(territories[territoryId]),
      );
      store.setTerritoryId(~~defaultTerritoryId);
    }
  }, []);

  const onFillMargin = useCallback(async () => {
    const response = await CommonService.getSharingSettings();
    const margin = response?.tariff?.margin?.transport;
    store.onFillMargin(margin, marginFilled);
    setMarginFilled(prev => !prev);
    if (!marginFilled) {
      showAlert({
        content: t.tariff("marginFill.description"),
        title: t.tariff("marginFill.title"),
      })
    }
    else {
      showAlert({
        content: t.tariff("marginReset.description"),
        title: t.tariff("marginReset.title"),
      })
    }
  }, [marginFilled])
  return (
    <div className={'tariff-hourly-editor-form'}>
      <VzForm.Group title={'Информация по тарифу'}>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <TariffTitle title={placeholders?.title} />
          </VzForm.Col>
          <VzForm.Col span={8}>
            <TariffRegion
              territories={territories}
              shortInfo={{
                type: 'tooltip',
                content: 'Для добавления региона свяжитесь с тех поддержкой',
              }}
            />
          </VzForm.Col>
          <VzForm.Col span={8}>
            <TariffFieldHourRange
              label={'Время действия'}
              fromPropField={'dayHourFrom'}
              fromSetterProp={'setDayHourFrom'}
              toPropField={'dayHourTill'}
              toSetterProp={'setDayHourTill'}
            />
          </VzForm.Col>
          <VzForm.Col span={8}>
            <TariffTimeRound />
          </VzForm.Col>
        </VzForm.Row>
        <VzForm.Row>
          <VzForm.Col className={'ant-col ant-col-8 vz-form-col'} span={8}>
            <button className={'vz-form-item'} onClick={() => clientFormOpen()} style={{ height: "100%", width: "100%" }}>
              <div className={'vz-form-item__label'}>Привязанный к тарифу Заказчик</div>
              <div className={'ant-input'} style={{ 'height': '100%' }}>{client?.title}</div>
            </button>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      <VzForm.Group title={`Тарифная сетка (Стоимости ${costWithVat ? 'с' : 'без'} НДС)`}>
        <TariffHourlyTable tableConfig={tableConfig} client={client} />
      </VzForm.Group>

      <VzForm.Actions>
        {onCancel && (
          <ButtonDeprecated className={'semi-wide'} theme={'secondary'} onClick={onCancel} loading={canceling}>
            {t.order('cancel')}
          </ButtonDeprecated>
        )}

        {client
          ?
          <>
            <ButtonDeprecated onClick={onFillMargin} className={'semi-wide margin-left-16'} theme={!marginFilled ? 'primary' : 'secondary'}>
              {!marginFilled ? 'Автозаполнение с учетом маржинальности' : 'Вернуть значения'}
            </ButtonDeprecated>
            <ButtonDeprecated onClick={handlePublish} className={'semi-wide margin-left-16'} theme={'primary'}>
              Сохранить и выбрать ПВ
            </ButtonDeprecated>
          </>
          :
          <ButtonDeprecated onClick={handlePublish} className={'semi-wide margin-left-16'} theme={'primary'} loading={loading || saving || deleting || canceling} >
            Сохранить
          </ButtonDeprecated>
        }
      </VzForm.Actions>

      {(loading || saving || deleting || canceling) && <Loader />}
    </div>
  );
}

TariffHourlyForm.propTypes = {
  tableConfig: TariffTableConfigProps,
  saving: PropTypes.bool,
  deleting: PropTypes.bool,
  canceling: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  territories: PropTypes.object.isRequired,
};

export default compose([withTariffHourlyStore, observer])(TariffHourlyForm);
