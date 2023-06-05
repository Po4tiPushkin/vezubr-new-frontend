import React from 'react';
import { IconDeprecated, Trailer } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import PropTypes from 'prop-types';
import ModalDeprecated from '../../DEPRECATED/modal/modal';
import { Trailer as TrailerServiceProducer } from '@vezubr/services/index.producer';
import { Trailer as TrailerServiceOperator } from '@vezubr/services/index.operator';

class AssignTrailer extends React.Component {
  state = {
    showModal: false,
    trailers: [],
    error: false,
  };

  async componentDidMount() {
    let { trailers } = this.props;
    if (!trailers || !trailers.length) {
      if (APP === 'operator') {
        const response = await TrailerServiceOperator.vehicleTrailerList();
        trailers = response.data.trailers;
      } else {
        const response = await TrailerServiceProducer.vehicleTrailerList();
        trailers = response.data.trailers;
      }
    }
    this.setState({ trailers });
  }

  componentWillReceiveProps(nextProp) {
    const { showActionButton, openTrigger } = nextProp;
    if (!showActionButton && openTrigger) {
      this.open();
    }
    if (nextProp.error) {
      this.setState({ error: nextProp.error });
    }
  }

  open() {
    this.setState({
      showModal: true,
    });
  }

  selectTrailer(trailer) {
    const { onSelect } = this.props;
    this.setState({ showModal: false, error: false });
    onSelect(trailer);
  }

  render() {
    const { className, showActionButton = true, onClose } = this.props;
    const { showModal, trailers, error } = this.state;
    let classNames = (className || '').split(' ');
    classNames.push('assign-driver doc-upload flexbox file-input-wrapper input-doc');
    if (error) {
      classNames.push('error');
    }
    classNames = classNames.join(' ');

    const list = trailers.map((d, key) => (
      <Trailer key={key} indx={key} onSelect={(trailer) => this.selectTrailer(trailer, key)} data={d} />
    ));

    return (
      <div className={classNames}>
        {showActionButton ? (
          <div className={'flexbox'}>
            <div className={'empty-attach-input'} onClick={() => this.open()}>
              <IconDeprecated name={'plusOrange'} />
            </div>
            <div className={'flexbox column align-left justify-center margin-left-16'}>
              <a onClick={() => this.open()}>{t.order('addTrailer')}</a>
              <div className={'support-format'}> {t.order('selectFromList')}</div>
            </div>
          </div>
        ) : null}

        <ModalDeprecated
          title={{
            classnames: 'identificator',
            text: t.order('selectTrailer'),
          }}
          options={{ showModal }}
          size={'md'}
          onClose={() => {
            onClose ? onClose() : null;
            this.setState({ showModal: false });
          }}
          animation={false}
          showClose={true}
          bodyStyle={{
            backgroundColor: '#DEE3E8',
            borderRadius: 0,
            margin: 0,
            padding: 0,
          }}
          content={
            <div className={'alert-box flexbox align-left padding-5'}>
              {trailers.length ? (
                <div className={'flexbox full-width'}>
                  <div className={'selection-left size-1'}>{list}</div>
                </div>
              ) : (
                <div className={'flexbox center align-center no-info'}>
                  Вы сможете выбрать полуприцеп после их создания/регистрации в системе.
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

AssignTrailer.propTypes = {
  onSelect: PropTypes.func.isRequired,
  assignedDrivers: PropTypes.array,
  drivers: PropTypes.array,
  showActionButton: PropTypes.bool,
};

export default AssignTrailer;
