import React from 'react';
import t from '@vezubr/common/localization';

import PropTypes from 'prop-types';
import { Loader } from '@vezubr/elements';

import AddButton from './AddButton';

class List extends React.Component {
  async componentWillMount() {
    const { actions } = this.props;
    actions.loadCards();
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { actions } = this.props;
    if (this.props.finishCard !== prevProps.finishCard) {
      actions.loadCards();
    }
  }

  renderLoader() {
    const { listLoading } = this.props;
    return (
      <div className={'profile-binding-loader' + !listLoading ? ' profile-binding-loader--fill' : ''}>
        <Loader />
      </div>
    );
  }

  renderList() {
    const { cardsOrder, showDeleteCardButton, cardComponent } = this.props;
    const Card = cardComponent;
    return cardsOrder.map((cardId) => (
      <Card key={cardId} showDeleteCardButton={showDeleteCardButton} cardId={cardId} />
    ));
  }

  render() {
    const { actions, listLoading, updateLoading, showAddCardButton, initialUrlLoading, title } = this.props;
    return (
      <div className="profile-binding">
        <h2>{title}</h2>

        <div className="profile-binding-cards">
          {!listLoading && this.renderList()}
          {(listLoading || updateLoading) && this.renderLoader()}
        </div>

        {showAddCardButton && (
          <div className={'area full-width'}>
            <div className={'flexbox align-right justify-right full-width'}>
              <AddButton initialUrlLoading={initialUrlLoading} actions={actions} />
            </div>
          </div>
        )}
      </div>
    );
  }
}

List.propTypes = {
  title: PropTypes.string,
  cardComponent: PropTypes.elementType.isRequired,
  showDeleteCardButton: PropTypes.bool,
  showAddCardButton: PropTypes.bool,
};

List.defaultProps = {
  title: t.profile('boundCards'),
  showAddCardButton: true,
  showDeleteCardButton: true,
};

List.contextTypes = {
  routes: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default List;
