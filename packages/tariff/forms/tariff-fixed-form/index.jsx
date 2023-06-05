import React, { useCallback, useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import { TariffTableConfigProps } from '../../form-components/tarif-table';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, Loader, VzForm, Ant } from '@vezubr/elements';
import TariffTitle from '../../form-components/tariff-title';
import compose from '@vezubr/common/hoc/compose';
import TariffFixedTable from './tariff-fixed-table';
import withTariffFixedStore from '../../hoc/withTariffFixedStore';
import TariffAddresses from '../../form-components/tariff-addresses';
import TariffFieldHourRange from '../../form-components/tariff-field-hour-range';
import TariffFieldNumber from '../../form-components/tariff-field-number';
import TariffFieldSelect from '../../form-components/tariff-field-select';
import TariffRegion from '../../form-components/tariff-region';
import { ROUTE_TYPES_ARRAY } from '../../constants';
import TariffCities from '../../form-components/tariff-cities';
import { Common as CommonService } from '@vezubr/services';
function TariffFixedForm(props) {
  const {
    tableConfig,
    store,
    loading,
    onSave,
    onCancel,
    onDelete,
    dictionaries,
    costWithVat,
    territories,
    clientFormOpen,
    client,
  } = props;

  const { loadingTypes } = dictionaries;

  const [marginFilled, setMarginFilled] = useState(false);

  const { isClone } = store;

  const handlePublish = useCallback(
    (e) => {
      e.preventDefault();

      if (onSave) {
        onSave(store);
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
  }, [marginFilled])

  useEffect(() => reaction(() => ({ territoryId: store.territoryId, editable: store.editable }), replaceServices), []);

  useEffect(() => {
    if (store.editable && !store.territoryId) {
      const defaultTerritoryId = Object.keys(territories).find((territoryId) =>
        /моск/gi.test(territories[territoryId]),
      );
      store.setTerritoryId(~~defaultTerritoryId);
    }
  }, []);

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
      }
    }
    return buttons;
  }, [loading, isClone, onCancel, onSave, onDelete, client, marginFilled])

  return (
    <>
      <div className={'tariff-fixed-editor-form'}>
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

        <VzForm.Group>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <TariffFieldNumber
                label="Количество Рейсов"
                setterProp={'setCountTimeLimit'}
                propField={'countTimeLimit'}
              />
            </VzForm.Col>
            <VzForm.Col span={12}>
              <TariffFieldSelect
                list={{
                  array: ROUTE_TYPES_ARRAY,
                  labelKey: 'label',
                  valueKey: 'value',
                }}
                label="Варианты маршрута"
                setterProp="setRouteType"
                propField="routeType"
              />
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>

        <VzForm.Group title={'Маршрут'}>
          {store.routeType === 0 ? <TariffAddresses loadingTypes={loadingTypes} /> : <TariffCities />}
        </VzForm.Group>

        {isClone && (
          <VzForm.Row>
            <VzForm.Col className={'ant-col ant-col-8 vz-form-col'} span={8}>
              <button className={'vz-form-item'} onClick={() => clientFormOpen()} style={{ height: "100%", width: "100%" }}>
                <div className={'vz-form-item__label'}>Привязанный к тарифу Заказчик</div>
                <div className={'ant-input'} style={{ 'height': '100%' }}>{client?.title}</div>
              </button>
            </VzForm.Col>
          </VzForm.Row>
        )}
        <VzForm.Group title={`Тарифная сетка (Стоимости ${costWithVat ? 'с' : 'без'} НДС)`}>
          <TariffFixedTable client={client} tableConfig={tableConfig} />
        </VzForm.Group>

        <VzForm.Actions>
          {renderButtons}
        </VzForm.Actions>

        {loading && <Loader />}
      </div>
    </>
  );
}

export default compose([withTariffFixedStore, observer])(TariffFixedForm);
