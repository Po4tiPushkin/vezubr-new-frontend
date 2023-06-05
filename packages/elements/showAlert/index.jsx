import * as Ant from '../antd';

export default function (props) {
  const { title = 'OK' } = props;
  return Ant.Modal.info({
    className: 'vz-show-alert-modal',
    title,
    width: 400,
    style: {
      maxWidth: '100%',
    },
    ...props,
  });
}
