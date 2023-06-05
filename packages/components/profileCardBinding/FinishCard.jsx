import React from 'react';
import Utils from '@vezubr/common/common/utils';
import { Profile as ProfileService } from '@vezubr/services';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';

class FinishCard extends React.Component {
  async componentWillMount() {
    const { history, observer } = this.context;
    const { actions } = this.props;
    const query = Utils.queryString();
    if (query['orderId']) {
      const bankPaymentId = query['orderId'];

      delete query['orderId'];
      delete query['lang'];

      const clearUrl = () => {
        history.replace(Utils.toQueryString(query));
      };

      try {
        const response = await ProfileService.contractorBindingCreateFinish({
          bankPaymentId,
        });

        observer.emit('alert', {
          title: 'Готово',
          message: t.error('Карта успешно привязана'),
          cb: () => {
            actions.finishCard(response?.id);
            clearUrl();
          },
        });
      } catch (e) {
        console.error(e);
        observer.emit('alert', {
          title: t.error('error'),
          html: 'center',
          message: t.error('Не удалось привязать карту'),
          cb: clearUrl,
        });
      }
    }
  }

  render() {
    return null;
  }
}

FinishCard.contextTypes = {
  history: PropTypes.object,
  observer: PropTypes.object,
};

FinishCard.propTypes = {
  actions: PropTypes.object,
};

export default FinishCard;
