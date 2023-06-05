import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { VzForm, Ant, VzTable, Loader } from '@vezubr/elements';
import cn from 'classnames';
import {
  NOTIFICATIONS_GROUP,
  NOTIFICATIONS_GROUP_STATUSES,
  NOTIFICATIONS_STATUSES,
  NOTIFICATIONS_TIMEOUT,
  NOTIFICATIONS_TIMEOUT_TYPE,
  NOTIFICATIONS_ONOFF,
  NOTIFICATIONS_TWO_HOURS,
  NOTIFICATIONS_EVERY_HOUR,
} from './constant';
import t from '@vezubr/common/localization';
import { useSelector } from 'react-redux';
import { FormContext } from './context';
import { NotificationsStore } from './store';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import Select from './components/Select';
import RangeTimeHour from './components/RangeTimeHour';

const CLS = 'settings-form';

function getFieldOptions(notificationsStatuses, status) {
  switch (notificationsStatuses[status].type) {
    case 'timeout': {
      return {
        defaultValue: NOTIFICATIONS_TIMEOUT[0].value,
        fieldList: NOTIFICATIONS_TIMEOUT,
      };
    }

    case 'twoHours': {
      return {
        defaultValue: NOTIFICATIONS_TWO_HOURS[0].value,
        fieldList: NOTIFICATIONS_TWO_HOURS,
      };
    }

    case 'everyHour': {
      return {
        defaultValue: NOTIFICATIONS_EVERY_HOUR[0].value,
        fieldList: NOTIFICATIONS_EVERY_HOUR,
      };
    }

    case 'onOff': {
      return {
        defaultValue: NOTIFICATIONS_ONOFF[0].value,
        fieldList: NOTIFICATIONS_ONOFF,
      };
    }

    default:
      throw new Error('Has no notification field type');
  }
}


const SEND_NOTIFICATIONS_OPTIONS = [
  {
    id: 'all',
    title: 'По всем Рейсам'
  },
  {
    id: 'responsible',
    title: 'Только по рейсам, где я ответственный'
  }
]

const NOTIFICATIONS_DATES = [
  {
    id: 0,
    title: 'temp'
  },
  {
    id: 1,
    title: 'temp1'
  },
  {
    id: 2,
    title: 'temp2'
  },
  {
    id: 3,
    title: 'temp3'
  },
]

function SettingsNotificationForm(props) {
  const { onSubmit, onInit, onDestroy, className } = props;
  const dictionaries = useSelector(state => state.dictionaries);
  const notificationsStatuses = NOTIFICATIONS_STATUSES;
  const notificationsGroup = NOTIFICATIONS_GROUP;
  const notificationsTimeoutType = {
    ...NOTIFICATIONS_TIMEOUT_TYPE,
    smsTimeoutInSec:
      <Ant.Tooltip placement="right" title={'Внимание! Услуга смс-оповещения платная'}>
        <div className={`${CLS}__icon-red`}>
          {'Оповещать по СМС'} <Ant.Icon type={'info-circle'} />
        </div>
      </Ant.Tooltip>,
  };
  const notificationsGroupStatuses = NOTIFICATIONS_GROUP_STATUSES;

  const formRef = useRef(null);
  const [store] = useState(() => new NotificationsStore());
  const storePrev = usePrevious(store);

  const columns = useMemo(() => {
    const width = (1 / (Object.keys(notificationsTimeoutType).length + 1)) * 100 + '%';
    const cols = [
      {
        title: 'Статус',
        width,
        dataIndex: 'status',
        key: 'status',
        render: (status) => (
          <Ant.Tooltip placement="right" title={notificationsStatuses[status].hint}>
            <div className={`${CLS}__status-title`}>
              {notificationsStatuses[status].title} <Ant.Icon type={'info-circle'} />
            </div>
          </Ant.Tooltip>
        ),
      },
    ];

    for (const timeOutType of Object.keys(notificationsTimeoutType)) {
      cols.push({
        title: notificationsTimeoutType[timeOutType],
        width,
        dataIndex: 'status',
        key: timeOutType,
        render: (status) => {
          const { fieldList, defaultValue } = getFieldOptions(notificationsStatuses, status);
          return <Select status={status} fieldList={fieldList} defaultValue={defaultValue} timeOutType={timeOutType} />;
        },
      });
    }

    return cols;
  }, [notificationsStatuses, notificationsTimeoutType]);

  const groups = useMemo(
    () =>
      Object.keys(notificationsGroup).map((groupId) => (
        <div className={`${CLS}__group`} key={groupId}>
          <h2 className={`${CLS}__group__title`}>{notificationsGroup[groupId]}</h2>
          <div className={`${CLS}__group__body`}>
            <Ant.Table
              columns={columns}
              rowKey={'status'}
              pagination={false}
              scroll={{ x: 600 }}
              dataSource={notificationsGroupStatuses[groupId].map((status) => ({ status }))}
            />
          </div>
        </div>
      )),
    [columns, notificationsGroup, notificationsGroupStatuses],
  );

  const sendNotificationsModesOptions = useMemo(
    () =>
      SEND_NOTIFICATIONS_OPTIONS.map((item) => (
        <Ant.Select.Option key={item.id} value={item.id}>
          {item.title}
        </Ant.Select.Option>
      )),
    [],
  );

  const notificationSendModeOptions = useMemo(() => (
    dictionaries.notificationSendModes.map((el) => (
      <Ant.Select.Option key={el.id} value={el.id}>
        {el.title}
      </Ant.Select.Option>
    ))
  ), [])

  const handleSubmit = React.useCallback(
    (e) => {
      e.preventDefault();
      if (onSubmit) {
        onSubmit(store);
      }
    },
    [onSubmit, store],
  );

  useEffect(() => {
    const soreUpdated = store !== storePrev;

    if (soreUpdated) {
      if (onInit) {
        onInit(store);
      }

      return () => {
        if (onDestroy) {
          onDestroy(store);
        }
      };
    }
  }, [store, onInit, onDestroy, storePrev]);

  const context = useMemo(() => ({ store }), [store]);

  return (
    <FormContext.Provider value={context}>
      <Ant.Form ref={formRef} className={cn(CLS, className)} layout="vertical" onSubmit={handleSubmit}>
        <VzForm.Group title={t.settings("notifications.sendingTime")}>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <RangeTimeHour
                label={'Время суток'}
                format={'HH:mm'}
                fieldNameFrom={'smsSendingTimeFrom'}
                fieldNameTo={'smsSendingTimeTo'}
              />
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>
        <VzForm.Group>
          <div className={`${CLS}__group__title`}>
            <div className={`settings-page__hint-title`}> {t.settings("notifications.recive")}</div>
          </div>
          <VzForm.Row>
            <VzForm.Col span={12}>
              <VzForm.Item label={t.settings("notifications.send")}>
                <Ant.Select onChange={(value) => store.setItem('mode', value)} value={store.getItem('mode')}>
                  {sendNotificationsModesOptions}
                </Ant.Select>
              </VzForm.Item>
            </VzForm.Col>
            <VzForm.Col span={12}>
              <VzForm.Item label={t.settings("notifications.sendMode")}>
                <Ant.Select onChange={(value) => store.setItem('sendMode', value)} value={store.getItem('sendMode')}>
                  {notificationSendModeOptions}
                </Ant.Select>
              </VzForm.Item>
            </VzForm.Col>
          </VzForm.Row>
        </VzForm.Group>

        {groups}

        <VzForm.Actions className={'settings-form__actions'}>
          <Ant.Button
            type="primary"
            disabled={!store.isEdited}
            onClick={handleSubmit}
            loading={store.isSending}
            className={cn('semi-wide')}
          >
            {t.common('save')}
          </Ant.Button>
        </VzForm.Actions>

        {(store.isLoading || store.isSending) && <Loader />}
      </Ant.Form>
    </FormContext.Provider>
  );
}

SettingsNotificationForm.propTypes = {
  className: PropTypes.string,
  onSubmit: PropTypes.func,
  onInit: PropTypes.func,
  onDestroy: PropTypes.func,
};

export default observer(SettingsNotificationForm);
