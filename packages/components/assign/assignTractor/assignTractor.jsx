import React from 'react';
import { IconDeprecated, Tractor } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import PropTypes from 'prop-types';
import ModalDeprecated from '../../DEPRECATED/modal/modal';
import { Tractor as TractorServiceProducer } from '@vezubr/services/index.producer';
import { Tractor as TractorServiceOperator } from '@vezubr/services/index.operator';

class AssignTractor extends React.Component {
  state = {
    showModal: false,
    error: false,
    tractors: [],
  };

  componentWillMount() {
    const { showActionButton } = this.props;
    this.setState({ showActionButton });
  }

  async componentDidMount() {
    let { tractors } = this.props;
    if (!tractors || !tractors.length) {
      if (APP === 'operator') {
        const response = await TractorServiceOperator.vehicleTractorList();
        tractors = response.data.tractors;
      } else {
        const response = await TractorServiceProducer.vehicleTractorList();
        tractors = response.data.tractors;
      }
    }
    this.setState({ tractors });
  }

  componentWillReceiveProps(nextProp) {
    const { showActionButton, openTrigger } = nextProp;
    this.setState({ showActionButton: showActionButton });
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

  selectTractor(tractor) {
    const { onSelect } = this.props;
    this.setState({ showModal: false, error: false });
    onSelect(tractor);
  }

  render() {
    const { className, onClose } = this.props;
    const { showActionButton = true, error } = this.state;
    let classNames = (className || '').split(' ');
    classNames.push('assign-driver doc-upload flexbox file-input-wrapper input-doc');
    if (error) {
      classNames.push('error');
    }
    classNames = classNames.join(' ');

    const { showModal, tractors } = this.state;
    const list = tractors.map((d, key) => (
      <Tractor key={key} indx={key} onSelect={(tractor) => this.selectTractor(tractor)} data={d} />
    ));

    return (
      <div className={classNames}>
        {showActionButton ? (
          <div className={'flexbox'}>
            <div className={'empty-attach-input'} onClick={() => this.open()}>
              <IconDeprecated name={'plusOrange'} />
            </div>
            <div className={'flexbox column align-left justify-center margin-left-16'}>
              <a onClick={() => this.open()}>{t.order('addTractor')}</a>
              <div className={'support-format'}> {t.order('selectFromList')}</div>
            </div>
          </div>
        ) : null}

        <ModalDeprecated
          title={{
            classnames: 'identificator',
            text: t.order('selectTractor'),
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
              {tractors.length ? (
                <div className={'flexbox full-width'}>
                  <div className={'selection-left size-1'}>{list}</div>
                </div>
              ) : (
                <div className={'flexbox center align-center no-info'}>
                  Вы сможете выбрать тягач после их создания/регистрации в системе.
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

AssignTractor.propTypes = {
  onSelect: PropTypes.func.isRequired,
  assignedDrivers: PropTypes.array,
  drivers: PropTypes.array,
  showActionButton: PropTypes.bool,
};

export default AssignTractor;
