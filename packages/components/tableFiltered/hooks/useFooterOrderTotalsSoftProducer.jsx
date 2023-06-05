import React, { useCallback } from 'react';

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

function useFooterOrderTotalsSoftProducer(dataSource, { costOrderKey, costSoftKey }) {
  return useCallback(() => {
    const amount = dataSource.reduce(
      (accumulator, currentValue) => {
        const orderSum = parseInt(currentValue[costOrderKey], 10) || 0;
        const orderSoftwareSum = parseInt(currentValue[costSoftKey], 10) || 0;
        return {
          orderAmount: accumulator.orderAmount + orderSum,
          softwareAmount: accumulator.softwareAmount + orderSoftwareSum,
          producerAmount: accumulator.producerAmount + (orderSum - orderSoftwareSum),
        };
      },
      {
        orderAmount: 0,
        softwareAmount: 0,
        producerAmount: 0,
      },
    );
    return (
      <div className="footer-totals">
        <div>
          Сумма рейсов: <span>{currencyFormat.format(amount.orderAmount / 100)}</span>.
        </div>
        <div>
          Сумма за ПО: <span>{currencyFormat.format(amount.softwareAmount / 100)}</span>.
        </div>
        <div>
          Сумма исполнителю: <span>{currencyFormat.format(amount.producerAmount / 100)}</span>.
        </div>
      </div>
    );
  }, [dataSource]);
}

export default useFooterOrderTotalsSoftProducer;
