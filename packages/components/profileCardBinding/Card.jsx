import React from 'react';
import autobind from 'autobind-decorator';
import { IconDeprecated, InputCheckbox, CustomBoxDeprecated } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import PropTypes from 'prop-types';
import Modal from '../DEPRECATED/modal/modal';

function getIconCard(type) {
  switch (type) {
    case 'VISA':
      return <IconDeprecated name={'visa'} />;
    case 'MASTERCARD':
      return <IconDeprecated name={'mastercard'} />;
    case 'MIR':
      return <IconDeprecated name={'mastercard'} />;
    case 'AMEX':
      return <IconDeprecated name={'amex'} />;
    case 'JCB':
      return <IconDeprecated name={'jcb'} />;
    default:
      return <IconDeprecated name={'bankCard'} />;
  }
}

function formatExpiration(expiration) {
  return expiration.slice(0, 4) + '/' + expiration.slice(4);
}

class Card extends React.Component {
  state = {
    modalRemoveShow: false,
  };

  async onRemove() {
    const { actions } = this.props;
    const { id } = this.props.card;
    actions.removeCard(id);
  }

  @autobind
  async onSetPrimary(e) {
    const { actions } = this.props;
    const { id, isPrimary } = this.props.card;
    if (!isPrimary && e.target.checked) {
      actions.setPrimaryCard(id);
    }
  }

  @autobind
  onConfirmModalToggle() {
    const modalRemoveShow = !this.state.modalRemoveShow;
    this.setState({ modalRemoveShow });
  }

  render() {
    const { modalRemoveShow } = this.state;
    const { showDeleteCardButton, card } = this.props;
    const { expiration, isPrimary, paymentSystem, pan } = card;

    return (
      <div className="profile-binding-cards-card area">
        <div className="card-info">
          <div className="card-icon">{getIconCard(paymentSystem)}</div>
          <div className="card-description">
            <div className="card-number">{pan}</div>
            <div className="card-expiration">{formatExpiration(expiration)}</div>
          </div>
        </div>
        <div className="card-action margin-left-8">
          <InputCheckbox theme={'primary'} checked={isPrimary} onChange={this.onSetPrimary} />
          {showDeleteCardButton && <IconDeprecated name={'xBlack'} onClick={this.onConfirmModalToggle} />}
        </div>

        <Modal
          title={{
            classnames: 'identificator',
            text: t.common('confirm'),
          }}
          options={{ showModal: modalRemoveShow }}
          size={'small'}
          onClose={this.onConfirmModalToggle}
          animation={false}
          showClose={true}
          content={
            <CustomBoxDeprecated
              content={<div>{t.buttons('removeBoundCard')}</div>}
              buttons={[
                {
                  text: t.common('cancel'),
                  theme: 'secondary',
                  event: (e) => {
                    e.preventDefault();
                    this.onConfirmModalToggle();
                  },
                },
                {
                  text: t.common('confirm'),
                  theme: 'primary',
                  event: (e) => {
                    e.preventDefault();
                    this.onConfirmModalToggle();
                    this.onRemove();
                  },
                },
              ]}
            />
          }
        />
      </div>
    );
  }
}

Card.propTypes = {
  cardId: PropTypes.number.isRequired,
  showDeleteCardButton: PropTypes.bool.isRequired,
};

Card.contextTypes = {
  routes: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default Card;
