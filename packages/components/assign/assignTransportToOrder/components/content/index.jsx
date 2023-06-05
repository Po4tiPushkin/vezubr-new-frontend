import React from 'react';
import Transport from '../transport';
const Content = (props) => {
  const { transports = [], loading, showPhone, selectTransport, data, tractors = [] } = props;
  return (
    <div className='assignModal__list'>
      {transports.sort((t1, t2) => t1.distance - t2.distance).map((el, key) => {
        return (
          <Transport
            driver={el.driver}
            loading={loading}
            drivers={el.linkedDrivers}
            key={key}
            showPhone={showPhone}
            onSelect={(transport, driver, curTractor) => selectTransport(transport, driver, curTractor, key)}
            data={
              {
                vehicleData: el.vehicle,
                orderData: data,
                tractorsData: tractors.filter((tractor) => tractor?.producer?.id == el.vehicle?.producer?.id),
                plateNumber: el.vehicle?.plateNumber,
                markAndModel: el.vehicle?.vehicleTypeTitle,
                tractorId: el.vehicle?.tractorId?.id,
              }
            }
            indx={key}
          />
        )
      })}
    </div>
  )
}

export default Content;