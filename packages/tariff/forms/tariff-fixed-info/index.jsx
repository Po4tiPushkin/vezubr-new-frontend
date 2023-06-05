import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import { TariffTableConfigProps } from '../../form-components/tarif-table';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, Loader, VzForm } from '@vezubr/elements';
import TariffTitle from '../../form-components/tariff-title';
import compose from '@vezubr/common/hoc/compose';
import TariffFixedTable from './tariff-fixed-table';
import withTariffFixedStore from '../../hoc/withTariffFixedStore';
import TariffCities from '../../form-components/tariff-cities';
import TariffFieldHourRange from '../../form-components/tariff-field-hour-range';
import TariffAddresses from '../../form-components/tariff-addresses';
import TariffFieldNumber from '../../form-components/tariff-field-number';
import TariffRegion from '../../form-components/tariff-region';
import TariffAddressesView from '../../form-components/tarif-addresses-view';
import TariffFieldSelect from '../../form-components/tariff-field-select';
import { ROUTE_TYPES_ARRAY } from '../../constants';
import { useSelector } from 'react-redux';

function TariffFixedForm(props) {
  const {
    saving,
    tableConfig,
    store,
    loading,
    canceling,
    deleting,
    onSave,
    onCancel,
    onDelete,
    dictionaries,
    onClone,
    showAddProducers,
    client,
    costWithVat,
    territories
  } = props;

  const { loadingTypes } = dictionaries;
  const user = useSelector((state) => state.user);

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
              <TariffFieldNumber label='Количество Рейсов' disabled={true} setterProp={'setCountTimeLimit'} propField={'countTimeLimit'} />
            </VzForm.Col>
            <VzForm.Col span={12}>
              <TariffFieldSelect
                list={{
                  array: ROUTE_TYPES_ARRAY,
                  labelKey: 'label',
                  valueKey: 'value'
                }}
                disabled={true}
                label='Варианты маршрута'
                setterProp='setRouteType'
                propField='routeType' 
                />
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>

        <VzForm.Group title={'Маршрут'}>
          {!store.routeType ? <TariffAddressesView /> : <TariffCities />}
        </VzForm.Group>

        <VzForm.Group title={`Тарифная сетка (Стоимости ${costWithVat ? 'с' : 'без'} НДС)`}>
          <TariffFixedTable tableConfig={tableConfig} />
        </VzForm.Group>

        <VzForm.Actions>
          {onCancel && (
            <ButtonDeprecated className={'semi-wide'} theme={'secondary'} onClick={onCancel} loading={canceling}>
              {t.order('cancel')}
            </ButtonDeprecated>
          )}

          {onDelete && user.id === store.contractorId && (
            <ButtonDeprecated
              onClick={onDelete}
              className={'semi-wide margin-left-16'}
              theme={'primary'}
              loading={deleting}
            >
              Удалить
            </ButtonDeprecated>
          )}

          {onSave && (
            <ButtonDeprecated
              onClick={handlePublish}
              className={'semi-wide margin-left-16'}
              theme={'primary'}
              loading={saving}
            >
              Сохранить
            </ButtonDeprecated>
          )}
          {(onClone && !showAddProducers && store.routeType === 1) &&
            (
              <ButtonDeprecated
                onClick={() => onClone()}
                className={'semi-wide margin-left-16'}
                theme={'primary'}
              >
                Клонировать
              </ButtonDeprecated>
            )}
          {showAddProducers &&
            (<ButtonDeprecated onClick={() => showAddProducers()} className={'semi-wide margin-left-16'} theme={'primary'}>Назначить Тариф Подрядчикам</ButtonDeprecated>
            )}
        </VzForm.Actions>

        {(loading || saving || deleting || canceling) && <Loader />}
      </div>
    </>
  );
}

TariffFixedForm.propTypes = {
  tableConfig: TariffTableConfigProps,
  saving: PropTypes.bool,
  deleting: PropTypes.bool,
  canceling: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  dictionaries: PropTypes.object.isRequired,
};

export default compose([withTariffFixedStore, observer])(TariffFixedForm);
