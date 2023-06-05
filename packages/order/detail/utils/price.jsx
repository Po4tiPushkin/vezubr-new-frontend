import React from 'react';
import Utils from '@vezubr/common/common/utils';
import t from '@vezubr/common/localization'
export const getPriceInfo = (order = {}, user) => {
  const {
    finalCostOrder,
    orderCost,
    orderCostClient,
    orderCostProducer,
    clientRate,
    orderVatRate,
    marginInPercent,
    marginInRouble,
    preliminaryCostClient,
    preliminaryCostProducer,
    offer,
    margin,
    profit
  } = order;
  let infos = [];

  if (APP === 'dispatcher') {
    if (finalCostOrder) {
      infos =
        [
          {
            title:
              <span>
                Фактическая стоимость рейса с Заказчиком
                <br />
                (Без НДС)
              </span>,
            value: Utils.moneyFormat(orderCostClient?.withoutVat)
          },
          ...[
            user?.costWithVat
              ?
              {
                title:
                  <span>
                    Фактическая стоимость рейса с Заказчиком
                    <br />
                    (включая НДС)
                  </span>,
                value:
                  Utils.moneyFormat(orderCostClient?.withVat) ||
                  t.order('Невозможно рассчитать фактическую стоимость')
              }
              :
              {}
          ],
          {
            title:
              <span>
                Фактическая стоимость рейса с Подрядчиком
                <br />
                (Без НДС)

              </span>,
            value: Utils.moneyFormat(orderCostProducer?.withoutVat)
              ||
              t.order('Невозможно рассчитать фактическую стоимость')
          },
          ...[
            user?.costWithVat
              ?
              {
                title:
                  <span>
                    Фактическая стоимость рейса с Подрядчиком
                    <br />
                    (включая НДС)
                  </span>,
                value:
                  Utils.moneyFormat(orderCostProducer?.withVat) ||
                  t.order('Невозможно рассчитать фактическую стоимость')
              }
              :
              {}
          ]
        ]
    }
    else {
      infos =
        [
          {
            title:
              <span>
                Минимальная стоимость рейса с Заказчиком
                <br />
                (Без НДС)
              </span>,
            value: Utils.moneyFormat(preliminaryCostClient)
          },
          ...[
            user?.costWithVat
              ?
              {
                title:
                  <span>
                    Минимальная стоимость рейса с Заказчиком
                    <br />
                    (включая НДС)
                  </span>,
                value:
                  Utils.moneyFormat(preliminaryCostClient + (preliminaryCostClient * orderVatRate / 100)) ||
                  t.order('Невозможно рассчитать минимальную стоимость')
              }
              :
              {}
          ],
          {
            title:
              <span>
                Минимальная стоимость рейса с Подрядчиком
                <br />
                (Без НДС)

              </span>,
            value: Utils.moneyFormat(preliminaryCostProducer)
              ||
              t.order('Невозможно рассчитать минимальную стоимость')
          },
          ...[
            user?.costWithVat
              ?
              {
                title:
                  <span>
                    Минимальная стоимость рейса с Подрядчиком
                    <br />
                    (включая НДС)
                  </span>,
                value:
                  Utils.moneyFormat(preliminaryCostProducer + (preliminaryCostProducer * orderVatRate / 100)) ||
                  t.order('Невозможно рассчитать минимальную стоимость')
              }
              :
              {}
          ]
        ]
    }
    if (
      order.performers?.find((item) => item.producer.id == user.id)?.isInsuranceRequired &&
      order.performers?.find((item) => item.producer.id == user.id)?.orderInsurance
    ) {
      infos.push({
        title: 'Страховая премия',
        value: Utils.moneyFormat(
          order.performers?.find((item) => item.producer.id == user.id)?.orderInsurance.insurancePremium,
        ),
      });
    }
    infos.push(
      {
        title: t.order('orderMargin'),
        value: `${(profit ? profit + ' %' : '') || '–'} / ${Utils.moneyFormat(margin, 100) || '–'}`,
      }
    )
  }
  else {
    infos = [
      {
        title: finalCostOrder ? (
          <span>
            {t.order('preliminaryCost')}
            <br />
            (без НДС)
          </span>

        ) : (
          <span>
            Минимальная стоимость Рейса
            <br />
            (без НДС)
          </span>
        ),
        value: (APP === 'producer' && offer && !finalCostOrder) ?
          offer?.offer?.sum ?
            Utils.moneyFormat(offer.offer.sum)
            :
            'Рассчитывается на основе внесённого вами предложения'
          :
          orderCost?.withoutVat ? Utils.moneyFormat(orderCost?.withoutVat) : finalCostOrder
            ? t.order('Будет доступна после завершения рейса')
            : Utils.moneyFormat(clientRate) || t.order('Невозможно рассчитать предварительную стоимость'),
      },
      ...[
        user.costWithVat ? {
          title: finalCostOrder ? (
            <span>
              {t.order('preliminaryCost')}
              <br />
              (включая НДС)
            </span>

          ) : (
            <span>
              Минимальная стоимость Рейса
              <br />
              (включая НДС)
            </span>
          ),
          value: (APP === 'producer' && offer && !finalCostOrder) ?
            offer?.offer?.sum ? Utils.moneyFormat(offer.offer.sum + (offer.offer.sum * orderVatRate / 100))
              : 'Рассчитывается на основе внесённого вами предложения'
            :
            orderCost?.withVat ? Utils.moneyFormat(orderCost?.withVat) : finalCostOrder
              ? t.order('Будет доступна после завершения рейса')
              : Utils.moneyFormat(clientRate + (clientRate * orderVatRate / 100)) ||
              t.order('Невозможно рассчитать предварительную стоимость'),
        } : {}
      ]
    ]
    if (APP == "client" && order.performers?.[0]?.isInsuranceRequired) {
      infos.push(
        {
          title: 'Страховая премия',
          value: Utils.moneyFormat(order.performers[0].orderInsurance.insurancePremium),
        }
      )
    }
  }
  return infos.filter(el => el.value);
}
