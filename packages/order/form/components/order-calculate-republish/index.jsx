import React from 'react';
import PropTypes from 'prop-types';
import { observer, useObserver } from 'mobx-react';
import { OrderContext } from "../../context";
import { getOrderDataSave, getProducersForOrder } from '../../utils'

function OrderCalculateRepublish(props) {
  const { fetch } = props;

  const { store } = React.useContext(OrderContext);
  const addresses = useObserver(() => store.getDataItem('addresses'));

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        store.setDataItem('calculation', { status: 'fetching' });

        const calcResult = await fetch();

        store.setDataItem('calculation', {
          ...calcResult,
          status: 'calculated',
        });
      } catch (e) {
        console.error(e);
        store.setDataItem('calculation', {
          status: 'error',
          error: e,
        });
      }
    }
    fetchData();
  }, [fetch]);

  React.useEffect(() => {
    const  fetchProds = async () => {
      const { orderType, vehicleType } = getOrderDataSave({...store.data, addresses})

      if (addresses.length > 0) {
        const producers = await getProducersForOrder(orderType, addresses, vehicleType)
        store.setDataItem('producers', producers);
      }
    }
    fetchProds()
  }, [addresses])

  return null;
}

OrderCalculateRepublish.propTypes = {
  fetch: PropTypes.func.isRequired
};

export default observer(OrderCalculateRepublish);
