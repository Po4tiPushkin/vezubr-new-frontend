import React from 'react';
import autobind from 'autobind-decorator';
import { NotifyBadge } from '@vezubr/elements';
import InputField from '../inputField/inputField';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import t from '@vezubr/common/localization';
import { Profile as ProfileService } from '@vezubr/services';

class DelegateAction extends React.Component {
  state = {
    open: false,
    data: {
      todayDelegation: 1,
      futureDelegation: 1,
    },
  };

  componentWillMount() {
    const { user } = this.props;
    this.setState({ user: user });
  }

  async componentDidMount() {
    const data = (await ProfileService.getDelegationSettings());

    document.body.addEventListener('click', (e) => {
      const { open } = this.state;
      const item = document.getElementById('delegation-nav');
      //!e.target.parentNode.classList.contains(isTimePicker ? "timePicker" : 'vz-dd')
      if (item && !item.contains(e.target) && open) {
        this.setState({ open: false });
      }
    });
    this.setState({ data });
  }

  componentWillReceiveProps(nextProps) {
    const { user } = this.state;
    if (user !== nextProps.user) {
      this.setState({ user: nextProps.user });
    }
  }

  async handleChange(type, val) {
    const { data } = this.state;
    data[type] = val;
    this.setState({ data });
    await ProfileService.setDelegation(data);
    this.setState({ open: false });
  }

  @autobind
  async onDropdownClose() {
    const { open } = this.state;
    this.setState({ open: !open });
  }

  render() {
    const { open, data } = this.state;
    let text, badge;
    if (!data.todayDelegation && !data.futureDelegation) {
      text = t.common('Делегирование выключено');
      badge = 'danger';
    } else if (data.todayDelegation && !data.futureDelegation) {
      text = t.common('Делегирование на сегодня включено');
      badge = 'semi-warning';
    } else if (!data.todayDelegation && data.futureDelegation) {
      text = t.common('Делегирование на будущее включено');
      badge = 'semi-warning';
    } else {
      text = t.common('Делегирование включено');
      badge = 'warning';
    }

    return (
      <a className={'navs narrow light-bold delegetion flexbox'} id={'delegation-nav'}>
        <div
          className={'margin-right-9 margin-left-9 flexbox align-center justify-right'}
          onClick={this.onDropdownClose}
        >
          <span style={{ width: '70%' }} className={'nav-title no-events'}>
            {text}
          </span>
          <NotifyBadge className={'delegetion-notify'} type={badge} />
        </div>
        <div className={'relative'}>
          {open ? (
            <div className={'menu-dropdown-delegetion flexbox'} style={{ top: '40px' }} tabIndex="0">
              <ul className={'dropdown-list right-right'}>
                <h6 style={{ padding: '10px', fontSize: '14px' }} key={0}>
                  Настройка делегирования рейсов
                </h6>
                <InputField
                  title={t.order('На сегодня')}
                  checkbox={{
                    checked: data.todayDelegation,
                  }}
                  value={data.todayDelegation}
                  onChange={(e) => {
                    this.handleChange('todayDelegation', data.todayDelegation ? false : true);
                  }}
                />
                <InputField
                  title={t.order('На будущее')}
                  checkbox={{
                    checked: data.futureDelegation,
                  }}
                  value={data.futureDelegation}
                  onChange={(e) => {
                    this.handleChange('futureDelegation', data.futureDelegation ? false : true);
                  }}
                />
              </ul>
            </div>
          ) : null}
        </div>
      </a>
    );
  }
}

const mapStateToProps = (state) => {
  const { user, balance } = state;
  return { user, balance };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({}, dispatch) };
};

DelegateAction.contextTypes = {
  routes: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default connect(mapStateToProps, mapDispatchToProps)(DelegateAction);
