import React, { Component, Fragment } from 'react';
import { ButtonDeprecated, IconDeprecated, Carrier, Loader } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import ModalDeprecated from '../../DEPRECATED/modal/modal';
import PropTypes from 'prop-types';
import { Orders as OrdersService } from '@vezubr/services/index.producer';
import { Loaders as LoaderService } from '@vezubr/services/index.producer';
import LOADER_ORDER from '@vezubr/common/assets/agreements/Общие условия выполненя ПРР.pdf';

class AssignLoadersToOrder extends Component {
  state = {
    showModal: this.props.showModal || false,
    loading: true,
    loadersOrigin: [],
    loaders: [],
    selected: [],
  };

  componentDidMount() {
    if (this.state.showModal) {
      this.getCompatibleLoaderList();
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showModal !== this.state.showModal) {
      this.setState({ showModal: nextProps.showModal });
      if (nextProps.showModal) this.getCompatibleLoaderList();
    }
  }

  async getCompatibleLoaderList() {
    const { data, assignedLoaders } = this.props;
    try {
      const loaders = (
        await LoaderService.listForAppointment({
          orderId: data.id,
        })
      ).data.loaders;

      this.setState({
        loaders,
        loadersOrigin: loaders.slice(0),
        loading: false,
      });
      if (assignedLoaders.length) {
        for (const [index, loader] of loaders.entries()) {
          const assigned = assignedLoaders.find((d) => d.id === loader.id);
          if (assigned) {
            this.selectLoader(loader, index);
          }
        }
      }
    } catch (e) {
      this.setState({ loading: false });
    }
  }

  open() {
    const { assignedLoaders = [] } = this.props;
    const { selected, loaders } = this.state;
    if (!selected.length && assignedLoaders.length) {
      for (const [index, loader] of loaders.entries()) {
        const assigned = assignedLoaders.find((d) => d.id === loader.id);
        if (assigned) {
          this.selectLoader(loader, index);
        }
      }
    } else if (assignedLoaders.length) {
      for (const [index, selectedLoader] of selected.entries()) {
        const assigned = assignedLoaders.find((d) => d.id === selectedLoader.id);
        if (!assigned) {
          this.removeLoader(selectedLoader, index);
        }
      }
    }
    this.setState({
      showModal: true,
    });
  }

  openFile(file) {
    const link = document.createElement('a');
    link.target = '_blank';
    link.href = file;
    link.click();
  }

  async submit() {
    const { selected } = this.state;
    const { data, isAppointment } = this.props;
    const brigadier = selected.find((el) => el.isBrigadier);
    if (!brigadier) {
      this.showAlert('Необходимо назначить бригадира');
      return;
    } else if ((data.orderedLoadersCount || data.loadersCount) !== selected.length) {
      this.showAlert('Выбранное количество специалистов не соответствует запросу рейса');
      return;
    }
    this.setState({ loading: true });
    try {
      if (isAppointment) {
        await OrdersService.appointLoaders({
          orderId: data.id,
          brigadierLoaderId: brigadier.id,
          loadersIds: selected.map((el) => el.id),
        });
      } else {
        await OrdersService.requestLoadersReplacement({
          orderId: data.id,
          brigadierLoaderId: brigadier.id,
          loadersIds: selected.map((el) => el.id),
        });
      }
      const title = t.common(`Рейс № ${this.props.data.id}`);
      const description = t.common('Принят к исполнению');
      this.props.onClose({ showSuccessMessage: true, title, sTitle: false, description });
    } catch (e) {
      const title = t.error('error');
      const description = t.error(`Не смог назначить специалистов на рейс № ${this.props.data.id}`);
      this.props.onClose({ showSuccessMessage: false, title, sTitle: false, description }, e);
    }

    this.setState({ loading: false, showModal: false });
  }

  selectLoader(loader, index) {
    const { selected, loaders } = this.state;
    loaders.splice(index, 1);
    selected.push(loader);
    this.setState({ loaders, selected });
  }

  removeLoader(loader, index) {
    const { selected, loaders } = this.state;
    selected.splice(index, 1);
    loaders.push(loader);
    this.setState({ loaders, selected });
  }

  assignBrigadier(loader, index) {
    const { selected, loaders } = this.state;
    selected.forEach((el) => (el.isBrigadier = false));
    selected[index].isBrigadier = true;
    this.setState({ loaders, selected });
  }

  filter(val) {
    val = val.toLowerCase();
    const { loadersOrigin } = this.state;
    const filtered = loadersOrigin.filter((loader) => {
      return (
        loader.name.toLowerCase().includes(val) ||
        loader.surname.toLowerCase().includes(val) ||
        loader.patronymic.toLowerCase().includes(val)
      );
    });
    this.setState({ loaders: val ? filtered : loadersOrigin });
  }

  showAlert(message) {
    const { observer } = this.context;
    this.setState({ showModal: false });
    observer.emit('alert', {
      title: 'Ошибка',
      message: message,
      cb: (e) => {
        this.setState({ showModal: true });
      },
    });
  }

  render() {
    const { className, showActionButton = true, onClose, isAppointment } = this.props;
    const { store } = this.context;
    const dictionaries = store.getState().dictionaries;
    let classNames = (className || '').split(' ');
    classNames.push('assign-driver doc-upload flexbox file-input-wrapper input-doc');
    classNames = classNames.join(' ');
    const agreementTxt = this.props.data === 2 ? 'специалистов' : 'ТС';

    const { showModal, loaders, selected, loadersOrigin, loading } = this.state;
    const list = loaders.map((d, key) => (
      <Carrier
        key={key}
        indx={key}
        uiState={dictionaries?.unitUiStates}
        onSelect={(loader) => this.selectLoader(loader, key)}
        data={d}
      />
    ));

    const selectedList = selected.map((d, key) => (
      <Carrier
        key={key}
        uiState={dictionaries?.unitUiStates}
        indx={key}
        assignBrigadier={(loader) => this.assignBrigadier(loader, key)}
        onRemove={(loader) => this.removeLoader(loader, key)}
        data={d}
      />
    ));
    return (
      <div className={classNames}>
        {showActionButton ? (
          <div className={'flexbox'}>
            <div className={'empty-attach-input'} onClick={() => this.open()}>
              <IconDeprecated name={'plusOrange'} />
            </div>
            <div className={'flexbox column align-left justify-center margin-left-16'}>
              <a onClick={() => this.open()}>{t.order('addLoader')}</a>
              <div className={'support-format'}> {t.order('selectFromList')}</div>
            </div>
          </div>
        ) : null}

        <ModalDeprecated
          title={{
            classnames: 'identificator',
            text: t.order(isAppointment ? 'addingLoaders' : 'replaceLoaders'),
            leftText: `Требуется специалистов: ${this.props.data.orderedLoadersCount || this.props.data.loadersCount}`,
          }}
          options={{ showModal }}
          size={'lg'}
          onClose={() => {
            onClose ? onClose() : null;
            this.setState({ showModal: false });
          }}
          animation={false}
          showClose={true}
          footer={
            <div className={'flexbox space-between align-center'}>
              {loadersOrigin.length ? (
                <ButtonDeprecated theme={'primary'} className={`mid`} onClick={(e) => this.submit(e)}>
                  {t.order('addSelected')}
                </ButtonDeprecated>
              ) : null}
              <div className={''}>
                <span className={'text-middle'} style={{ wordBreak: 'break-word' }}>
                  {`Назначая на  рейс специалистов, вы соглашаетесь с`}
                  <span className={'download-document'} onClick={() => this.openFile(LOADER_ORDER)}>
                    &nbsp;Общими условиями выполнения ПРР
                  </span>
                  .
                </span>
              </div>
            </div>
          }
          bodyStyle={{
            backgroundColor: '#DEE3E8',
            borderRadius: 0,
            margin: 0,
            padding: 0,
          }}
          content={
            <div className={'alert-box flexbox align-left padding-5'}>
              {loading ? (
                <Loader />
              ) : loadersOrigin.length ? (
                <div className={'flexbox full-width'}>
                  <div className={'selection-left size-0_5'}>
                    <div className={'driver-search'}>
                      <input
                        onChange={async (e) => {
                          this.filter(e.target.value);
                        }}
                        placeholder={'Поиск по ФИО'}
                      />
                      <IconDeprecated style={{ position: 'absolute', right: '0', top: '-3px' }} name={'searchBlue'} />
                    </div>
                    <div className={'drivers-list'}>{list}</div>
                  </div>
                  <div className={'selection-right size-0_5'}>
                    <div className={'drivers-list'}>{selectedList}</div>
                  </div>
                </div>
              ) : (
                <div className={'flexbox center align-center no-info'}>
                  Вы сможете выбрать специалистов после их создания/регистрации в системе.
                </div>
              )}
            </div>
          }
        />
      </div>
    );
  }
}

AssignLoadersToOrder.contextTypes = {
  store: PropTypes.object,
  observer: PropTypes.object,
};

AssignLoadersToOrder.propTypes = {
  //onSelect: PropTypes.func.isRequired,
  assignedLoaders: PropTypes.array,
  loaders: PropTypes.array,
  showActionButton: PropTypes.bool,
};

export default AssignLoadersToOrder;
