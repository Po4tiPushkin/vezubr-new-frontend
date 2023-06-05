import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

class DeferredOrderCard extends Component {
  onChange = () => {
    this.props.onChange();
  };

  onClick = (order) => {
    this.props.onClick(order);
  };
  renderSection() {
    const { element, dictionaries, renderBitmapIconTruck } = this.props;
    const { orders } = element;
    return orders.map((order, key) => {
      const d = moment(order.to_start_at).format(`DD.MM.YYYY HH:mm`);
      return (
        <div
          className={`canceled-separate ${order.problem ? 'red' : 'blue'} ${
            orders.length === 1 ? 'one-canceled' : 'two-canceled'
          }`}
          key={key}
          onClick={() => this.onClick(order)}
        >
          <ul className={'cancelled-element'}>
            <li>
              {order.order_id} <span className={'line'} />
            </li>
            <li>
              {renderBitmapIconTruck(order.order_type, order.problem)} <span className={'line'} />
            </li>
            <li>
              {d !== 'Invalid date' ? d : null}
              <span className={'line'} />
            </li>
            <li>
              {dictionaries?.vehicleTypes && order.vehicle_type_id
                ? dictionaries?.vehicleTypes[order.vehicle_type_id.toString()]?.name
                : null}
              <span className={'line'} />
            </li>
            <li>
              {order.first_address}
              <span className={'line'} />
            </li>
            <li>
              {order.last_address}
              <span className={'line'} />
            </li>
          </ul>
        </div>
      );
    });
  }
  render() {
    const { element, checked } = this.props;
    return (
      <div className={'cancelled-order column flexbox pointer'}>
        <div className="additional-filters" style={{ top: element.orders.length === 1 ? 0 : 20 }}>
          <div className={'flexbox additional-input'}>
            <label className="additional-container">
              <input type="checkbox" checked={checked} onChange={() => this.props.onChange(element)} />
              <span className="checkmark" />
            </label>
          </div>
        </div>
        {this.renderSection()}
      </div>
    );
  }
}

DeferredOrderCard.propTypes = {
  element: PropTypes.object,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  renderBitmapIconTruck: PropTypes.func.isRequired,
  dictionaries: PropTypes.object.isRequired,
};

export default DeferredOrderCard;
