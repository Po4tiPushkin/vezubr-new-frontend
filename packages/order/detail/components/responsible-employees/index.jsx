import React, { useState, useMemo, useCallback, useContext, useEffect } from "react";
import { ResponsibleEmployees } from '@vezubr/components';
import { showError, Ant } from "@vezubr/elements";
import { Orders as OrderService } from '@vezubr/services';
import OrderViewContext from '../.././context';
const OrderViewResponsibleEmployees = (props) => {
  const { order, employees } = useContext(OrderViewContext);
  const [responsibleEmployees, setResponsibleEmployees] = useState((order.responsibleEmployees || []).map(el => el.id));
  useEffect(() => {
    setResponsibleEmployees((order.responsibleEmployees || []).map(el => el.id));
  }, [order?.responsibleEmployees])
  const onSaveEmployees = useCallback(async (values) => {
    const prevEmployees = [...responsibleEmployees];
    try {
      setResponsibleEmployees(values.responsibleEmployees);
      await OrderService.responsibleEmployees({ id: order.id, data: { responsibleEmployees: values.responsibleEmployees } })
    } catch (e) {
      console.error(e);
      showError(e);
      setResponsibleEmployees(prevEmployees);
    }

  }, [order.id, responsibleEmployees])

  const renderEmployees = useMemo(() => {
    if (!employees) {
      return <></>
    }
    return (
      <Ant.Collapse style={{ margin: 5 }}>
        <Ant.Collapse.Panel header='Ответственные за рейс'>
          <ResponsibleEmployees
            values={{ responsibleEmployees }}
            titleText={'Ответственный за рейс'}
            data={employees}
            onChange={onSaveEmployees}
            align={'left'}
            colSpan={24}
          />
        </Ant.Collapse.Panel>
      </Ant.Collapse>
    )
  }, [employees, onSaveEmployees, responsibleEmployees]);

  return (
    renderEmployees
  )
}

export default OrderViewResponsibleEmployees;