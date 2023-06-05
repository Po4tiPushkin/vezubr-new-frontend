import React, { useEffect, useState, useMemo, useCallback } from 'react';
import useColumns from './hooks/useColumns';
import { Ant, VzForm, BargainStatus } from '@vezubr/elements';
import _ from 'lodash';
import cn from "classnames";
import moment from 'moment';
import { minBy } from 'lodash'

const currencyFormat = new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' });

const OffersList = (props) => {
  const {
    list: dataSource,
    onAccept,
    producer,
    onSavedBasicOffers,
    selectingStrategy,
    bargainStatus,
    bargainStatuses,
    user = {},
    strategyType,
    desiredCost
  } = props;
  const isDisabledButtons = useMemo(() => {
    const acceptedOffers = dataSource?.offers.filter(item => item.status === 'accepted');
    if (acceptedOffers.length > 0) {
      return true;
    }

    return false;
  }, [dataSource]);

  const columns = useColumns({
    onAcceptOffer: onAccept,
    accepted: APP === 'dispatcher' ? producer && producer !== user?.id : !!producer,
    producer,
    isDisabledButtons,
    vatRateVisible: user?.costWithVat,
    isDisabledAccept: strategyType === 'bargain' && APP === 'dispatcher'
  });
  const [defaultBasicOffers, setDefaultBasicOffers] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);

  const { costWithVat, vatRate } = user;

  useEffect(() => {
    const filteredList = dataSource?.offers.filter(item => item?.basic);
    setSelectedRows(filteredList);
    setDefaultBasicOffers(filteredList.map(item => item.id));
  }, [dataSource]);

  const onChangeSelectedRows = (selectedRowKeys, newSelectedRows) => {
    setSelectedRows(newSelectedRows);
  }

  const handleSaveBasedOffers = async () => {
    if (onSavedBasicOffers) {
      const selectedRowsIds = selectedRows.map(item => item.id);
      const unselectedRowsIds = _.difference(defaultBasicOffers, selectedRowsIds);
      const concatRows = new Set([...selectedRowsIds, ...unselectedRowsIds]);

      const listForSaved = dataSource?.offers.filter((item) => concatRows.has(item.id));

      onSavedBasicOffers(listForSaved.map(item => {
        if (selectedRowsIds.includes(item.id)) {
          return {
            offer: String(item.id),
            isBasic: true,
          }
        } else if (unselectedRowsIds.includes(item.id)) {
          return {
            offer: String(item.id),
            isBasic: false,
          }
        }
      }));
    }
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

  const rowSelection = useMemo(() => {
    if (!isDisabledButtons) {
      return {
        type: 'checkbox',
        selectedRowKeys: selectedRows.map(item => item.id),
        onChange: onChangeSelectedRows,
        hideDefaultSelections: true,
      }
    }

    return null;
  }, [selectedRows, isDisabledButtons]);

  const disabledSaveButton = React.useMemo(() => {
    const selectedRowsIds = selectedRows.map(item => item.id)
    return !(_.xor(defaultBasicOffers, selectedRowsIds).length > 0);
  }, [defaultBasicOffers, selectedRows])

  const getCost = useCallback((cost) => {
    if (!cost) {
      return '-'
    }
    const unformatted = costWithVat ? cost + cost * (parseInt(vatRate) / 100) : cost
    return currencyFormat.format(unformatted / 100);
  }, [dataSource, user])

  return (
    <>
      <div style={{ 'marginBottom': '20px' }} className="flexbox bargain-row size-1">
        <BargainStatus br={true} text={'Статус Торгов: '} classNames={'bargain-title'} bargainStatus={bargainStatus} bargainStatuses={bargainStatuses} />
        <span className="bargain-title">{'До окончания торгов: '}<br />{(dataSource?.bargainEndAt && moment().isBefore(moment(dataSource?.bargainEndAt)) ? getBargainsTimeLeft(dataSource?.bargainEndAt) : '-')}</span>
        <span className="bargain-title">{`Желаемая стоимость (${costWithVat ? 'С НДС' : 'Без НДС'}): `}<br />{getCost(desiredCost)}</span>
        <span className="bargain-title">{`Шаг торгов (${costWithVat ? 'С НДС' : 'Без НДС'}): `}<br />{getCost(dataSource?.bidStep)}</span>
        <span className="bargain-title">{'Тип торгов: '}<br />{(selectingStrategy == 2 ? 'Открытый' : 'Закрытый')}</span>
        <span className="bargain-title">{`Мин. предложение ГВ (${costWithVat ? 'С НДС' : 'Без НДС'}): `}<br />{getCost(minBy(dataSource?.offers, 'sum')?.sum)}</span>
      </div>
      <Ant.Table
        className={'order-cargo-place-viewer__table'}
        bordered={true}
        dataSource={dataSource?.offers}
        columns={columns}
        rowKey={'id'}
        pagination={false}
        width={columns.reduce((width, item) => width += item.width, 0)}
        rowSelection={APP === 'dispatcher' && rowSelection}
        scroll={{
          x: 800,
          y: null
        }}
      />
      {APP === 'dispatcher' && (
        <VzForm.Actions>
          <>
            <Ant.Button
              type="primary"
              onClick={handleSaveBasedOffers}
              className={cn('semi-wide margin-left-16', { 'disabled': isDisabledButtons || disabledSaveButton })}
            >
              Сохранить базовые предложения
            </Ant.Button>
          </>
        </VzForm.Actions>
      )}
    </>
  )
}

export default OffersList;
