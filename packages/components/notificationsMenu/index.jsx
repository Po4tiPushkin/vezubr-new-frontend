import useParamsState from '@vezubr/common/hooks/useParamsState';
import { Ant, IconDeprecated, showError } from '@vezubr/elements';
import React from 'react';
import { TableFiltered }  from '../tableFiltered';
import { useSelector } from 'react-redux';
import { Contractor as ContractorService } from '../../services';
import useColumns from './hooks/useColumns';

const paramKeys = {
  page: 'page',
};

export default function NotificationsMenu() {
  const [notifications, setNotifications] = React.useState([])
  const [notificationsCount, setNotificationsCount] = React.useState(null)
  const [total, setTotal] = React.useState()
  const [params, pushParams] = useParamsState({paramsDefault: {
    itemsPerPage: 10,
    page: 1
  }})

  const [modalVisible, setModalVisible] = React.useState(false);

  const fetchNotifications = React.useCallback(async () => {
    try {
      const req = await ContractorService.notificationsList(params)
      setNotifications(req.sentMessage)
      setTotal(req.itemsCount)
    } catch (e) {
      showError(e)
    }
  }, [params])

  React.useEffect(() => {
    const fetchCount = async () => {
      try {
        const count = await ContractorService.notificationsCount()
        setNotificationsCount(count.unnoticedMessageCount)
      } catch (e) {
        showError(e)
      }
    }
    if (!modalVisible) {
      fetchCount();
    }
  }, [modalVisible])

  React.useEffect(() => {
    fetchNotifications()
  }, [params])

  const toggleModal = React.useCallback(async (e) => {
    e.stopPropagation()
    if (!modalVisible) {
      await fetchNotifications()
    }
    setModalVisible(!modalVisible);
  }, [modalVisible]);

  const columns = useColumns();

  return (
      <div className="notifications">
        <div className="notifications__button" title={`Непрочитанных уведомлений ${notificationsCount ? ': ' + notificationsCount : 'нет'}`} onClick={toggleModal}>
          <IconDeprecated name={'notifications'} className={'notifications__icon'} />
          {notificationsCount > 0 && (
            <span className="notifications__circle"></span>
          )}
        </div>
        <Ant.Modal
          title={'Уведомления'}
          visible={modalVisible}
          width={"85vw"}
          bodyNoPadding={true}
          centered={false}
          destroyOnClose={true}
          onCancel={toggleModal}
          footer={null}
        >
          <TableFiltered 
            params={params}
            paramKeys={paramKeys}
            pushParams={pushParams}
            columns={columns} 
            dataSource={notifications} 
            rowKey={"id"}
            paginatorConfig={{
              total: total,
              itemsPerPage: 10,
            }} 
            responsive={false}
          />
        </Ant.Modal>
      </div>
  );
}
