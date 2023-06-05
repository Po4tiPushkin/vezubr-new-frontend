import { Ant } from '@vezubr/elements';
import React from 'react';
import { useSelector } from 'react-redux';
import Actions from './actions';

export default function TableActions({ type, className, record, countersHash, dictionaries, reload, extra = {} }) {
  const user = useSelector((state) => state.user)
  const options = Actions[type]({record, countersHash, dictionaries, reload, user, extra});
  return (
    <div className={className}>
      {options.length > 1 ? (
        <Ant.Dropdown
          overlay={
            <Ant.Menu>
              {options.map((item, index) => (
                <Ant.Menu.Item key={index}>{item}</Ant.Menu.Item>
              ))}
            </Ant.Menu>
          }
        >
          <Ant.Button size={'small'} type={'primary'} onClick={(e) => e.preventDefault()}>
            Действия <Ant.Icon type={'down'} />
          </Ant.Button>
        </Ant.Dropdown>
      ) : options.length ? (
        options[0]
      ) : null}
    </div>
  );
}
