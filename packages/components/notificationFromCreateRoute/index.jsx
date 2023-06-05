import React, { useEffect } from 'react';
import { notification } from '@vezubr/elements/antd';
import centrifugo from '@vezubr/services/socket/centrifuge';
import { useSelector } from 'react-redux'

function NotificationFromCreateRoute() {
  const {id: userId} = useSelector((state) => state.user)
  useEffect(() => {
    const centrifugeChannel = centrifugo().joinUser(({data: { data }}) => {
      notification.open({
        message: (
          <div dangerouslySetInnerHTML={{__html: data.message}}>
          </div>
        ),
        duration: 30,
      });
    }).subscribe(`$contractor-${userId}`, (d) => {
      if (d?.data) {
        const { type, data } = d?.data;
        if (type == "dispute_send_message") {
          const messageHtml = <div>
            <p className='no-margin'>
              {`Расчет по рейсу`} <a href={`/orders/${data.orderId}/general`}>{`№${data.orderNr}`}</a> {`был отклонен по причине: "${data.message}"`}
            </p>
          </div>
          notification.open({
            message: messageHtml,
            duration: 20,
          });
        }
      }
    })
    return () => {
      centrifugeChannel.leave();
    };
  }, []);

  return (
    <></>
  )
}

export default NotificationFromCreateRoute;