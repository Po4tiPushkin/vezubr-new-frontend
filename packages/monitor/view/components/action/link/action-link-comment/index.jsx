import React from 'react';
import * as Monitor from '../../../../../';
import { Ant } from '@vezubr/elements';
import { useObserver } from 'mobx-react';
import { useHistory } from 'react-router-dom'


export default function ActionLinkComment(props) {
  const { item } = props;

  const history = useHistory()

  const onAction = React.useCallback((item) => {
    history.replace({
      pathname: `/orders/${item.data.id}/general`,
      search: `?goTo=comments`,
      state: {
        back: {
          pathname: '/monitor'
        }
      }
    })  
  }, []);

  return useObserver(() => {
    return (
      <Monitor.Element.ActionLink item={item} onAction={onAction} title={'Перейти к комментариям'}>
        <Ant.Icon type={'edit'} theme={'outlined'}/>
      </Monitor.Element.ActionLink>
    );
  });
}
