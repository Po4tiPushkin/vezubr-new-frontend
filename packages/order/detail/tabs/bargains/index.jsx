import React, { useEffect, useState, useContext, useMemo, useCallback } from 'react';
import { Bargains as BargainsService, Offers as OffersService } from '@vezubr/services';
import { Ant, VzEmpty, WhiteBox, showError } from '@vezubr/elements';
import SelfOffer from './self-offer';
import OffersList from './offers-list';
import { useSelector } from 'react-redux';
import OrderViewContext from '../../context';
const currencyFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB',
})
function OrderViewTabBargain(props) {
  // const { order, reload: reloadOrder, clientContractor } = useContext(OrderContextView);
  const { order = {}, reload: reloadOrder } = useContext(OrderViewContext);
  const { id: orderId, bargainStatus, selectingStrategy, desiredCost, producer } = order;
  const { costWithVat } = useSelector((state) => state.user);
  const { bargainStatuses } = useSelector((state) => state.dictionaries);
  const [offer, setOffer] = useState(null);
  const [offersData, setOffersData] = useState(null);

  const loadBargains = useCallback(async () => {
    try {
      if (
        (order?.republishStrategyType === 'bargain' && APP === 'dispatcher') ||
        (order?.strategyType === 'bargain' && APP === 'client')
      ) {
        const response = await BargainsService.list(orderId);
        setOffersData(response);
      }

      if (order?.strategyType === 'bargain' && APP !== 'client') {
        const responseSelf = await BargainsService.self(orderId);
        setOffer(responseSelf);
      }
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [orderId])

  useEffect(() => {
    loadBargains();
  }, []);

  const onDeleteOffer = React.useCallback(
    async (offerId) => {
      await BargainsService.delete({ orderId, offerId });
      await loadBargains();

      Ant.message.success('Ваша ставка удалена');
    }, [order, orderId]);

  const onAddOffer = React.useCallback(
    async (sum) => {
      try {
        await BargainsService.add({
          orderId,
          data: +(sum * 100).toFixed(2).replace(/0+$/, ''),
        });
        Ant.message.success('Предложение отправлено');
      } catch (e) {
        showError(e);
      } finally {
        await loadBargains();
      }
    }, [order, orderId]);

  const onAcceptOffer = React.useCallback(
    async (offerId) => {
      try {
        await BargainsService.accept({
          id: orderId,
          data: offerId,
        });
        await loadBargains();
        await reloadOrder();
      } catch (e) {
        showError(e);
        console.error(e);
      }
    }, [orderId]);

  const onSavedBasicOffers = React.useCallback(async (basedOffersList) => {
    const body = {
      id: orderId,
      data: {
        offers: basedOffersList,
      },
    };

    try {
      await BargainsService.updateBasicOffers(body);

      await loadBargains();

      Ant.message.success('Базовые предложения обновлены');
    } catch (e) {
      console.error(e);
      Ant.message.error('Не смогли обновить базовые предложения');
    }
  });

  const getCost = useCallback(
    (cost) => {
      if (!cost) {
        return '-';
      }
      const unformatted =
        costWithVat && offersData?.offers?.[0]?.costVatRate
          ? cost + cost * (offersData?.offers?.[0]?.costVatRate / 100)
          : cost;
      return currencyFormat.format(unformatted / 100);
    },
    [offersData, costWithVat],
  );

  if (!offer && !offersData) {
    return (
      <div className={'white-container connected-order flexbox column order-view-tab-bargain order-view__tab'}>
        <VzEmpty vzImageName={'auctionOrange'} title={'Торги'} />
      </div>
    );
  }

  return (
    <div
      style={{ paddingLeft: '16px', paddingRight: '16px' }}
      className={'white-container connected-order flexbox column order-view-tab-bargain order-view__tab'}
    >
      {offer && (
        <>
          <div className="order-view-tab-bargain__title-wrp">
            <WhiteBox.Header type={'h2'} hr={false}>
              Предложение Заказчику
            </WhiteBox.Header>
            {APP === 'dispatcher' && (
              <div className="order-view-tab-bargain__mean">
                Маржинальность: {offer.margin ? `${getCost(offer.margin)}  / ${offer.marginality}%` : '-'}
              </div>
            )}
          </div>
          <SelfOffer
            offer={offer}
            bargainStatus={bargainStatus}
            bargainStatuses={bargainStatuses}
            addOffer={onAddOffer}
            deleteOffer={onDeleteOffer}
            clientRate={order?.clientRate}
          />
        </>
      )}
      {offersData && (
        <>
          <div className="order-view-tab-bargain__title-wrp">
            <WhiteBox.Header type={'h2'} hr={false}>
              Предложения от Подрядчиков
            </WhiteBox.Header>
            {APP === 'dispatcher' && (
              <div className="order-view-tab-bargain__mean">
                {`Среднее базовое значение:`} {getCost(offer?.calculatedValue) || ''}
              </div>
            )}
          </div>
          <OffersList
            list={offersData || {}}
            bargainStatus={bargainStatus}
            bargainStatuses={bargainStatuses}
            onAccept={onAcceptOffer}
            onSavedBasicOffers={onSavedBasicOffers}
            selectingStrategy={selectingStrategy}
            clientRate={order?.clientRate}
            strategyType={order?.strategyType}
            desiredCost={desiredCost}
            producer={producer?.id}
          />
        </>
      )}
    </div>
  );
}

export default OrderViewTabBargain;
