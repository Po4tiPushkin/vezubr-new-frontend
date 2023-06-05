import * as Ant from '../antd';

export default function (props) {
  Ant.Modal.confirm({
    className: 'vz-show-confirm-modal',
    title: 'Подтвердить действие',
    width: 400,
    okText: 'Да',
    cancelText: 'Нет',
    style: {
      maxWidth: '100%',
    },
    ...props,
  });
}