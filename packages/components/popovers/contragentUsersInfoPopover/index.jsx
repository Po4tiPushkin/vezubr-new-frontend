import React from 'react';
import PropTypes from 'prop-types';
import { Contragents } from '@vezubr/services/index.operator';
import { Table, Spin, Icon as IconAnt, Popover } from '@vezubr/elements/antd';

const loader = new (class {
  static hash = {};

  load(contractorId) {
    const hash = this.constructor.hash;

    if (hash[contractorId]) {
      hash[contractorId].count++;
      return hash[contractorId].loader;
    }

    const loader = Contragents.getUsersList({ contractorId });

    hash[contractorId] = {
      loader,
      count: 1,
    };

    return loader;
  }

  unload(contractorId) {
    const hash = this.constructor.hash;
    if (hash[contractorId]) {
      hash[contractorId].count--;

      if (hash[contractorId].count < 1) {
        delete hash[contractorId];
      }
    }
  }
})();

const columns = [
  {
    title: 'Пользователь',
    width: 150,
    key: 'user',
    render: (text, record, index) => {
      const { surname, name, patronymic } = record;
      return [surname, name, patronymic].join(' ');
    },
  },
  {
    title: 'Телефон',
    dataIndex: 'phone',
  },
];

class ContragentUsersInfoPopover extends React.Component {
  state = {
    users: [],
    loading: true,
  };

  async componentDidMount() {
    const { producerId } = this.props;
    const response = await loader.load(producerId);
    const users = response?.data?.users;
    this.setState({ users, loading: false });
  }

  componentWillUnmount() {
    const { producerId } = this.props;
    loader.unload(producerId);
  }

  renderContent() {
    const { users, loading } = this.state;
    if (loading) {
      return (
        <div className="loader">
          <Spin />
        </div>
      );
    }
    return <Table rowKey="id" dataSource={users} columns={columns} pagination={false} scroll={{ y: 100 }} />;
  }

  render() {
    const { title, getPopupContainer, placement, children } = this.props;
    return (
      <Popover
        overlayClassName="popover-vehicle-info"
        placement="bottomRight"
        title={title || 'Компания неизвестна'}
        content={this.renderContent()}
        getPopupContainer={getPopupContainer}
        trigger="click"
      >
        {children}
      </Popover>
    );
  }
}

ContragentUsersInfoPopover.propTypes = {
  producerId: PropTypes.number.isRequired,
  children: PropTypes.node.isRequired,
  title: PropTypes.string,
  placement: PropTypes.oneOf([
    'top',
    'left',
    'right',
    'bottom',
    'topLeft',
    'topRight',
    'bottomLeft',
    'bottomRight',
    'leftTop',
    'leftBottom',
    'rightTop',
    'rightBottom',
  ]),
  getPopupContainer: PropTypes.func,
};

export default ContragentUsersInfoPopover;
