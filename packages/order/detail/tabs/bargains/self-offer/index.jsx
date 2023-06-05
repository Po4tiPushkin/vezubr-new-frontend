import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Ant } from '@vezubr/elements';
import useColumns from './hooks/useColumns';
import { showConfirm, BargainStatus } from '@vezubr/elements';
import cn from 'classnames';
import moment from 'moment'
import { useSelector } from 'react-redux';
const currencyFormat = new Intl.NumberFormat('ru-RU', {
  style: 'currency',
  currency: 'RUB'
});
const SelfOffer = (props) => {
  const { offer, deleteOffer, addOffer, clientRate, bargainStatus, bargainStatuses } = props;
  const { bargainEndAt, offer: offerItem, bidStep, minSum, client, bargainType, costVatRate: vatRate } = offer;
  const user = useSelector(state => state.user);
  const dictionaries = useSelector((state) => state.dictionaries);
  const { costWithVat } = user;

  const [offerSum, setOfferSum] = useState(offerItem?.sum || '');
  const [showEdit, setShowEdit] = useState(!offerItem);
  const [sumWithVat, setSumWithVat] = useState((offerItem?.sum + (offerItem?.sum * vatRate / 100)) || '')

  const onChangeSums = (type, value) => {
    let newSumWithVat;
    let newSumWithoutVat;
    if (value) {
      switch (type) {
        case 'vat':
          newSumWithVat = parseFloat(parseFloat(value).toFixed(2))
          newSumWithoutVat = (newSumWithVat / ((100 + vatRate) / 100)).toFixed(2)
          setOfferSum(newSumWithoutVat)
          setSumWithVat(newSumWithVat)
          return null;
        default:
          newSumWithoutVat = parseFloat(parseFloat(value).toFixed(2))
          newSumWithVat = (newSumWithoutVat + (newSumWithoutVat * vatRate / 100)).toFixed(2)
          setOfferSum(newSumWithoutVat)
          setSumWithVat(newSumWithVat)
          return null;
      }
    } else {
      setOfferSum('')
      setSumWithVat('')
    }
  }

  useEffect(() => {
    setShowEdit(!offerItem);
    const newOfferSum = offerItem?.sum / 100
    setOfferSum(newOfferSum || '');
    setSumWithVat((newOfferSum + (newOfferSum * vatRate / 100)) || '');
  }, [offerItem]);

  const onCancel = () => {
    showConfirm({
      onOk: () => deleteOffer(offerItem.id),
    });
  }

  const getBargainsTimeLeft = useCallback((endAt) => {

    const momentEndAt = moment(endAt)
    const daysLeft =
      momentEndAt.diff(moment(), 'days') ?
        momentEndAt.diff(moment(), 'days')
        + '\u00A0'
        + 'д'
        : ''
    const hoursLeft =
      (momentEndAt.diff(moment(), 'hours') % 24) ?
        (momentEndAt.diff(moment(), 'hours') % 24)
        + '\u00A0'
        + 'ч'
        : ''
    const minutesLeft =
      (momentEndAt.diff(moment(), 'minutes') % 60) ?
        (momentEndAt.diff(moment(), 'minutes') % 60)
        + '\u00A0'
        + 'м'
        : ''

    return `${daysLeft} ${hoursLeft} ${minutesLeft}`

  }, [])

  const isDisabledButtons = useMemo(() => {
    if (offerItem?.status === 'accepted' || offerItem?.status === 'declined') {
      return true;
    }

    return false;
  }, [offerItem]);

  const actionButtons = useCallback(() => {
    if (offerItem) {
      if (showEdit) {
        return (
          <>
            <Ant.Button
              className={cn({ 'disabled': isDisabledButtons })}
              onClick={() => addOffer(user.costWithVat ? sumWithVat : offerSum)}
            >Отправить</Ant.Button>
            <Ant.Button
              className={cn({ 'disabled': isDisabledButtons })}
              style={{ marginTop: '10px' }}
              onClick={() => { setOfferSum(offerItem.sum / 100); setShowEdit(false) }}
            >Отмена</Ant.Button>
          </>
        )
      }

      return (
        <>
          <Ant.Button
            className={cn({ 'disabled': isDisabledButtons })}
            onClick={() => setShowEdit(true)}
          >Редактировать</Ant.Button>
          <Ant.Button
            className={cn({ 'disabled': isDisabledButtons })}
            style={{ marginTop: '10px' }} onClick={() => onCancel()}
          >Отозвать</Ant.Button>
        </>
      )
    }

    return (
      <Ant.Button disabled={(!offerSum || Number.isNaN(+offerSum) || +offerSum <= 0)} onClick={() => addOffer(user.costWithVat ? sumWithVat : offerSum)}>Отправить</Ant.Button>
    )
  }, [offerItem, showEdit, offerSum, isDisabledButtons]);

  const columns = useColumns({
    showEdit,
    offerSum,
    setOfferSum,
    actionButtons,
    currencyFormat,
    sumWithVat,
    onChangeSums,
    dictionaries,
    vatRateVisible: user?.costWithVat
  });

  const getCost = useCallback((cost) => {
    if (!cost) {
      return '-'
    }
    const unformatted = costWithVat && vatRate ? cost + cost * (vatRate / 100) : cost
    return currencyFormat.format(unformatted / 100);
  }, [offer, user])

  const dataSource = [
    {
      id: '0',
      date: offerItem?.updatedAt || offerItem?.createdAt || null,
      status: offerItem?.status,
      client: client,
      sum: offerItem?.sum,
    }
  ]

  return (
    <>
      <div style={{ 'marginBottom': '20px' }} className="flexbox bargain-row size-1">
        <BargainStatus br={true} text={'Статус Торгов: '} classNames={'bargain-title'} bargainStatus={bargainStatus} bargainStatuses={bargainStatuses} />
        <span className="bargain-title">{'До окончания торгов: '}<br />{(bargainEndAt && moment().isBefore(moment(bargainEndAt)) ? getBargainsTimeLeft(bargainEndAt) : '-')}</span>
        <span className="bargain-title">{`Желаемая стоимость (${costWithVat ? 'С НДС' : 'Без НДС'}): `}<br />{getCost(clientRate)}</span>
        <span className="bargain-title">{`Шаг торгов (${costWithVat ? 'С НДС' : 'Без НДС'}): `}<br />{getCost(bidStep)}</span>
        <span className="bargain-title">{'Тип торгов: '}<br />{(bargainType == 'open' ? 'Открытый' : 'Закрытый')}</span>
        <span className="bargain-title">{`Мин. предложение ГВ (${costWithVat ? 'С НДС' : 'Без НДС'}): `}<br />{getCost(minSum)}</span>
      </div>
      <div className="offer-table">
        <Ant.Table
          columns={columns}
          dataSource={dataSource}
          width={columns.reduce((width, item) => width += item.width, 0)}
          bordered={true}
          pagination={false}
          rowKey={'id'}
          scroll={{
            x: user?.costWithVat ? 1000 : 800,
            y: null
          }}
        />
      </div>
    </>
  )

}

export default SelfOffer;