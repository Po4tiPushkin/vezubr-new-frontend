import React, { Fragment } from 'react';
import autobind from 'autobind-decorator';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import InputField from '../inputField/inputField';
import { Contragents } from '@vezubr/services/index.operator';
import { CustomBoxDeprecated } from '@vezubr/elements';
import Modal from '../DEPRECATED/modal/modal';

class Holding extends React.Component {
  state = {
    showModal: false,
    holdingName: '',
    holdingNameError: false,
    holdings: [
      {
        id: -99,
        name: '+ Создать новый',
        status: -99,
        style: {
          color: '#1FD1D2',
        },
      },
      {
        id: null,
        name: 'Без холдинга',
        status: 0,
      },
    ],
  };

  componentDidMount() {
    this.getHoldings();
  }

  async getHoldings(selectLatest = false) {
    const { serviceInfo } = this.props;
    let { holdings } = this.state;
    let h = (await Contragents.holdings()).data;
    if (h && Array.isArray(h[0])) {
      holdings = [...holdings, ...h[0]];
    }

    this.setState({ holdings });
    if (selectLatest) {
      const lastHolding = holdings[holdings.length - 1];
      this.onChange({
        key: holdings.length - 1,
        val: lastHolding,
      });
    } else if (serviceInfo.holdingId) {
      const holdingIndex = holdings.findIndex((h) => h.id === serviceInfo.holdingId);
      if (holdingIndex > -1) {
        this.onChange({
          key: holdingIndex,
          val: holdings[holdingIndex],
        });
      }
    } else {
      this.onChange({
        key: 1,
        val: holdings[1],
      });
      this.setState({ defHolding: holdings[1] });
    }
  }

  onChange(e) {
    const { onChange } = this.props;
    if (e.val.id === -99) {
      return this.setState({ showModal: true });
    }
    onChange(e);
  }

  @autobind
  closeHoldingModal() {
    this.setState({ holdingName: '', showModal: false, holdingNameError: false, loading: false });
  }

  async createHolding() {
    const { holdingName } = this.state;
    const holdingNameError = !holdingName ? t.error('required') : false;
    this.setState({ holdingNameError, loading: true });
    if (!holdingNameError) {
      await Contragents.createHolding({ name: holdingName });
      this.closeHoldingModal();
      return await this.getHoldings(true);
    }
    this.setState({ loading: false });
  }

  setHoldingName(e) {
    this.setState({ holdingName: e.target.value });
  }

  render() {
    const { showModal, holdingName, holdingNameError, holdings, loading, defHolding } = this.state;
    const { serviceInfo, serviceInfoErrors } = this.props;
    return (
      <Fragment>
        <InputField
          title={t.common('Холдинг')}
          type={'text'}
          name={'holding'}
          value={serviceInfo?.holdingId?.val?.name || defHolding?.name}
          error={serviceInfoErrors.holdingId}
          dropDown={{
            data: holdings,
          }}
          onChange={(e) => this.onChange(e)}
        />
        <Modal
          title={{
            classnames: 'identificator',
            text: t.common('Новый холдинг'),
          }}
          options={{ showModal: showModal, showClose: true }}
          size={'small'}
          onClose={this.closeHoldingModal}
          animation={false}
          content={
            <CustomBoxDeprecated
              content={
                <div>
                  <InputField
                    title={t.common('Название холдинга')}
                    type={'text'}
                    name={'name'}
                    error={holdingNameError}
                    value={holdingName || ''}
                    onChange={(e) => this.setHoldingName(e)}
                  />
                </div>
              }
              buttons={[
                {
                  text: t.buttons('save'),
                  theme: 'primary',
                  loading,
                  event: (e) => this.createHolding(e),
                },
              ]}
            />
          }
        />
      </Fragment>
    );
  }
}

Holding.propTypes = {
  noBalance: PropTypes.bool,
  onClose: PropTypes.func,
  order: PropTypes.object,
  location: PropTypes.object,
};

export default Holding;
