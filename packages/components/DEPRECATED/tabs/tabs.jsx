import React from 'react';
import { NotifyBadge } from '@vezubr/elements';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

class Tabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      activeUrl: '',
    };
  }

  componentDidMount() {
    const { history, isOrder } = this.props;
    if (isOrder) {
      let url = history.location.pathname.split('/');
      url[2] = ':id';
      url = url.join('/');
      this.setActive({ url });
    }
  }

  componentWillReceiveProps(nextProps) {
    const active = nextProps.data?.find((data) => data.url === nextProps.history.location.pathname) || [];
    if (active) {
      this.setActive(active);
    }
  }

  navigateTo(e, tab, url) {
    e.preventDefault();
    e.stopPropagation();
    const { history, location } = this.props;
    url += location?.search || '';
    history.push(url);
    this.setActive(tab);
  }

  @autobind
  setActive(active) {
    this.setState({
      activeUrl: active.url,
    });
  }

  render() {
    const { className = '', tabNotifications, routeId, activeUrl } = this.props;
    let data = this.props.data
      ? this.props.data.map((val, key) => {
          val.danger = null;
          val.warning = null;
          const notification = tabNotifications[val.id];
          if (notification) {
            val.danger = notification.danger;
            val.warning = notification.warning;
          }

          val.active = val.url === this.state.activeUrl || val.url === activeUrl ? ' active' : '';
          val.disabled = val.disabled ? 'disabled' : '';
          return val;
        })
      : [];
    const active = data.find((d) => d.active);
    if (!active && data[0]) {
      data[0].active = 'active';
    }
    const tabs = data.slice(0).map((val, key) => {
      let url = val.url;

      const name = val.name || val.title || '';

      if (routeId) {
        url = url.replace(':id', routeId);
      }
      return (
        <a
          href={url}
          className={'vz-tab ' + val.active + val.disabled}
          key={key}
          onClick={(e) => this.navigateTo(e, val, url)}
        >
          {name}
          {val.danger || val.warning ? (
            <NotifyBadge className={'margin-left-5'} type={val.danger ? 'danger' : val.warning ? 'warning' : null}>
              <span>{val.danger || val.warning}</span>
            </NotifyBadge>
          ) : null}
        </a>
      );
    });
    return <div className={'vz-tabs ' + className}>{tabs}</div>;
  }
}

Tabs.propTypes = {
  data: PropTypes.array,
  location: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = (state) => {
  const { tabNotifications } = state;
  return { tabNotifications };
};

const mapDispatchToProps = (dispatch) => {
  return { actions: bindActionCreators({}, dispatch) };
};

export default connect(mapStateToProps, mapDispatchToProps)(Tabs);
