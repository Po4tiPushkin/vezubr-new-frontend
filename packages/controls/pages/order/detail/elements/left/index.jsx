import React, { useMemo } from "react";
import { OrderSidebarInfos, ResponsibleEmployees } from '@vezubr/components';
import t from '@vezubr/common/localization';
import { Ant } from '@vezubr/elements'

const OrderViewLeft = (props) => {

  const { topInfo, data, loading, priceInfo, employees, onSaveEmployees, responsibleEmployees } = props;

  const renderEmployees = useMemo(() => {
    if (!employees) {
      return <></>
    }
    return (
      <Ant.Collapse style={{margin: 5}}>
        <Ant.Collapse.Panel header='Ответственные за рейс'>
          <ResponsibleEmployees
            values={{ responsibleEmployees }}
            titleText={'Ответственный за рейс'}
            data={employees}
            onChange={onSaveEmployees}
            align={'left'}
          />
        </Ant.Collapse.Panel>
      </Ant.Collapse>
    )
  }, [employees, onSaveEmployees, responsibleEmployees])

  return (
    <>
      <div className="flexbox size-0_35 margin-right-15 column">
        <div className="connected-order order-view__left order-view__container-shadow padding-top-25">
          <OrderSidebarInfos data={topInfo} />
          <div className={'info-title'}>{t.order('calc')}</div>
          <OrderSidebarInfos data={priceInfo} />
          <div className="info-title">Пользователи</div>
          <OrderSidebarInfos data={[{ title: "В работе у", value: data?.implementerEmployee?.fullName || '-' }]} />
          {renderEmployees}
        </div>
      </div>
    </>
  )
}

export default OrderViewLeft;