import React, { useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { reaction } from 'mobx';
import { TariffTableConfigProps } from '../../form-components/tarif-table';
import t from '@vezubr/common/localization';
import { ButtonDeprecated, VzForm, Loader } from '@vezubr/elements';
import TariffRegion from '../../form-components/tariff-region';
import TariffTitle from '../../form-components/tariff-title';
import withTariffLoadersStore from '../../hoc/withTariffLoadersStore';
import compose from '@vezubr/common/hoc/compose';
import { TARIFF_LOADERS_DEFAULT_SERVICE, TARIFF_LOADERS_DEFAULT_MOSCOW_SERVICE } from '../../constants';
import TariffLoadersTable from './tariff-loaders-table';
import TariffFieldHourRange from '../../form-components/tariff-field-hour-range';
import { useSelector } from 'react-redux'
function TariffLoadersForm(props) {
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
  } = props;
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
        /моск/gi.test(territories[territoryId]) ? TARIFF_LOADERS_DEFAULT_MOSCOW_SERVICE : TARIFF_LOADERS_DEFAULT_SERVICE,
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
      { client &&
        <VzForm.Group title={'Грузовладелец'}>
        <VzForm.Row>
          <VzForm.Col className={'ant-col ant-col-8 vz-form-col'} span={8}>
            <div className={'vz-form-item'} style={{height:"100%",width:"100%"}}>
              <div className={'vz-form-item__label'}>Грузовладелец</div>    
              <div className={'ant-input'}>{client?.title}</div>
            </div>
          </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
      }
      <VzForm.Group title={`Тарифная сетка (Стоимости ${costWithVat ? 'с' : 'без'} НДС)`}>
        <TariffLoadersTable tableConfig={tableConfig} />
      </VzForm.Group>

      <VzForm.Actions>
        {onCancel && (
          <ButtonDeprecated className={'semi-wide'} theme={'secondary'} onClick={onCancel} loading={canceling}>
            {t.order('cancel')}
          </ButtonDeprecated>
        )}

        {(onDelete && user?.id === store.contractorId) &&(
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
          <ButtonDeprecated onClick={handlePublish} className={'semi-wide margin-left-16'} theme={'primary'} loading={loading || saving || deleting || canceling}>
            Сохранить
          </ButtonDeprecated>
        )}
        {(onClone && !showAddProducers && isAuthor) && 
        (<ButtonDeprecated onClick={()=> onClone()} className={'semi-wide margin-left-16'} theme={'primary'}>Клонировать</ButtonDeprecated>
        )}
         {(showAddProducers && isAuthor) &&
        (<ButtonDeprecated onClick={()=> showAddProducers()} className={'semi-wide margin-left-16'} theme={'primary'}>Назначить Тариф Подрядчикам</ButtonDeprecated>
        )}       
      </VzForm.Actions>

      {(loading || saving || deleting || canceling) && <Loader />}
    </div>
  );
}

export default compose([withTariffLoadersStore, observer])(TariffLoadersForm);
