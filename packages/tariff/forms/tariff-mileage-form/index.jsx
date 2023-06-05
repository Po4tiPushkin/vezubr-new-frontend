import React, { useCallback, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import { TariffTableConfigProps } from '../../form-components/tarif-table';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, VzForm, Loader, Ant, showAlert } from '@vezubr/elements';
import TariffRegion from '../../form-components/tariff-region';
import TariffTitle from '../../form-components/tariff-title';
import withTariffMileageStore from '../../hoc/withTariffMileageStore';
import compose from '@vezubr/common/hoc/compose';
import { TARIFF_HOURLY_DEFAULT_SERVICE, TARIFF_HOURLY_DEFAULT_MOSCOW_SERVICE } from '../../constants';
import TariffMileageTable from './tariff-mileage-table';
import TariffFieldHourRange from '../../form-components/tariff-field-hour-range';
import { useSelector } from 'react-redux';
import TariffTimeRound from '../../form-components/tariff-time-round';
import { Common as CommonService } from '@vezubr/services';
function TariffMileageForm(props) {
  const {
    territories,
    saving,
    tableConfig,
    store,
    loading,
    canceling,
    deleting,
    onSave,
    onCancel,
    onDelete,
    onClone,
    showAddProducers,
    client,
    isAuthor = true,
    costWithVat,
    clientFormOpen
  } = props;
  const { isClone } = store;
  const [marginFilled, setMarginFilled] = React.useState(false);
  const user = useSelector((state) => state.user);

  const handlePublish = useCallback(
    (e) => {
      e.preventDefault();
      if (props.onSave) {
        props.onSave(store);
      }
    },
    [onSave],
  );

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
  }, [marginFilled]);

  const renderButtons = useMemo(() => {
    const buttons = [];
    if (onCancel) {
      buttons.push(
        <Ant.Button className={'semi-wide'} onClick={onCancel} loading={loading}>
          {t.order('cancel')}
        </Ant.Button>
      )
      if (isClone) {
        if (client) {
          buttons.push(
            <Ant.Button
              onClick={onFillMargin}
              className={'semi-wide margin-left-16'}
              type={!marginFilled ? 'primary' : 'default'}
            >
              {!marginFilled ? 'Автозаполнение с учетом маржинальности' : 'Вернуть значения'}
            </Ant.Button>
          )
          buttons.push(
            <Ant.Button onClick={handlePublish} className={'semi-wide margin-left-16'} type={'primary'}>
              Сохранить и выбрать ПВ
            </Ant.Button>
          )
        } else {
          buttons.push(
            <Ant.Button onClick={handlePublish} className={'semi-wide margin-left-16'} type={'primary'} loading={loading}>
              Сохранить
            </Ant.Button>
          )
        }
      }
      else {
        if (onSave) {
          buttons.push(<Ant.Button
            onClick={handlePublish}
            className={'semi-wide margin-left-16'}
            type={'primary'}
            loading={loading}
          >
            Сохранить
          </Ant.Button>)
        }
        if (onDelete) {
          buttons.push(<Ant.Button
            onClick={onDelete}
            className={'semi-wide margin-left-16'}
            type={'primary'}
            loading={loading}
          >
            Удалить
          </Ant.Button>)
        }
        if (onClone && !showAddProducers && isAuthor) {
          buttons.push(
            <Ant.Button onClick={() => onClone()} className={'semi-wide margin-left-16'} type={'primary'}>
              Клонировать
            </Ant.Button>
          )
        }
        if (showAddProducers && isAuthor) {
          buttons.push(
            <Ant.Button onClick={() => showAddProducers()} className={'semi-wide margin-left-16'} type={'primary'}>
              Назначить Тариф Подрядчикам
            </Ant.Button>
          )
        }
      }
    }
    return buttons;
  }, [loading, isClone, onCancel, onSave, onDelete, client, marginFilled, showAddProducers, isAuthor])


  useEffect(() => reaction(() => ({ territoryId: store.territoryId, editable: store.editable }), replaceServices), []);

  useEffect(() => {
    if (store.editable && !store.territoryId) {
      const defaultTerritoryId = Object.keys(territories).find((territoryId) =>
        /моск/gi.test(territories[territoryId]),
      );
      store.setTerritoryId(~~defaultTerritoryId);
    }
  }, []);

  return (
    <div className={'tariff-hourly-editor-form'}>
      <VzForm.Group title={'Информация по тарифу'}>
        <VzForm.Row>
          <VzForm.Col span={8}>
            <TariffTitle />
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
        </VzForm.Row>
      </VzForm.Group>
      {isClone && (
        <VzForm.Row>
          <VzForm.Col className={'ant-col ant-col-8 vz-form-col margin-left-12'} span={8}>
            <button className={'vz-form-item'} onClick={() => clientFormOpen()} style={{ height: "100%", width: "100%" }}>
              <div className={'vz-form-item__label'}>Привязанный к тарифу Заказчик</div>
              <div className={'ant-input'} style={{ 'height': '100%' }}>{client?.title}</div>
            </button>
          </VzForm.Col>
        </VzForm.Row>
      )}
      {client && !isClone &&
        <VzForm.Group title={'Грузовладелец'}>
          <VzForm.Row>
            <VzForm.Col className={'ant-col ant-col-8 vz-form-col'} span={8}>
              <div className={'vz-form-item'} style={{ height: "100%", width: "100%" }}>
                <div className={'vz-form-item__label'}>Грузовладелец</div>
                <div className={'ant-input'}>{client?.title}</div>
              </div>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      }
      <VzForm.Group title={`Тарифная сетка (Стоимости ${costWithVat ? 'с' : 'без'} НДС)`}>
        <TariffMileageTable client={client} tableConfig={tableConfig} />
      </VzForm.Group>

      <VzForm.Actions>
      {renderButtons}
      </VzForm.Actions>

      {(loading || saving || deleting || canceling) && <Loader />}
    </div>
  );
}

export default compose([withTariffMileageStore, observer])(TariffMileageForm);
