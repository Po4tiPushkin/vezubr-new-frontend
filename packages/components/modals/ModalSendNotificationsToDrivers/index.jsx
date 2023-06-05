import React from 'react';
import PropTypes from 'prop-types';
import ModalDeprecated from '../../DEPRECATED/modal/modal';
import { ButtonDeprecated } from '@vezubr/elements';
import autobind from 'autobind-decorator';
import t from '@vezubr/common/localization';
import { Orders as OrdersService } from '@vezubr/services';

import Table from './table';

class ModalSendNotificationsToDrivers extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      arrIdCartulary: [],
    };
  }

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.orders !== this.props.orders) {
      this.setState({ arrIdCartulary: [] });
    }
  }

  @autobind
  async sendNotification() {
    const { arrIdCartulary } = this.state;
    const { onClose } = this.props;
    const { observer } = this.context;
    const data = {
      type: 'sms',
      orderIds: arrIdCartulary,
      text: 'VEZUBR. Вам доступен новый рейс. Его принятие поднимет Ваш рейтинг.',
    };
    try {
      await OrdersService.sendNotification(data);
      observer.emit('alert', {
        title: 'Готово',
        message: 'Уведомления успешно отправлены',
      });
    } catch (e) {
      observer.emit('alert', {
        title: 'Ошибка',
        message: 'Невозможно отправить уведомления',
      });
    }

    onClose();
  }

  renderStatuses() {
    const { orders, loading, onClose, renderBitmapIconTruck } = this.props;
    const { arrIdCartulary } = this.state;
    return (
      <div className={'bg-grey_0'} style={{ borderRadius: '8px', overflow: 'hidden' }}>
        <Table
          renderBitmapIconTruck={renderBitmapIconTruck}
          orders={orders?.filter((o) => o?.orderUiState === 102)}
          handleChange={(arrId) => this.setState({ arrIdCartulary: arrId })}
        />
        <div className={'flexbox padding-20'}>
          <div className={'flexbox align-left justify-left full-width'} />
          <div className={'flexbox margin-top-8'}>
            <ButtonDeprecated theme={'secondary'} onClick={onClose} className={'mid light'}>
              {t.buttons('cancel')}
            </ButtonDeprecated>
            <ButtonDeprecated
              className={'mid margin-left-15'}
              theme={'primary'}
              disabled={!arrIdCartulary?.length}
              onClick={() => this.sendNotification()}
            >
              {t.buttons('Уведомить')}
            </ButtonDeprecated>
          </div>
        </div>
      </div>
    );
  }

  handleChangeId = (id) => {
    const { arrIdCartulary } = this.state;
    const index = arrIdCartulary.indexOf(id);

    if (index !== -1) {
      arrIdCartulary.splice(index, 1);
      this.setState({ arrIdCartulary: arrIdCartulary });
      return;
    }

    this.setState({ arrIdCartulary: arrIdCartulary.concat(id) });
  };

  render() {
    const { open, onClose } = this.props;

    const options = {
      showModal: open,
      showClose: true,
      modalClassnames: 'no-padding no-background',
      bodyClassnames: 'no-padding-right no-padding-left no-padding-top no-background',
    };

    return <ModalDeprecated options={options} size={'large'} onClose={onClose} content={this.renderStatuses()} />;
  }
}

ModalSendNotificationsToDrivers.contextTypes = {
  observer: PropTypes.object,
};

ModalSendNotificationsToDrivers.propTypes = {
  orders: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool,
  loading: PropTypes.bool,
  renderBitmapIconTruck: PropTypes.func.isRequired,
};

export default ModalSendNotificationsToDrivers;
