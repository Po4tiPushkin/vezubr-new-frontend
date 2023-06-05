import { Ant, showError } from '@vezubr/elements';
import { Profile as ProfileServices } from '@vezubr/services';
import React, { useCallback, useEffect, useState } from 'react';
import TemplatesForm from './form';
const MESSAGE_KEY = 'identifier-saving';
const Templates = () => {
  const [fields, setFields] = useState([]);

  const fetchData = useCallback(async () => {
    try {
      const response = await ProfileServices.getOrderReportOptions();
      setFields(response || []);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const onSave = useCallback(async (data, type) => {
    try {
      const newData = await ProfileServices.setOrderReportOptions({
        ...fields,
        [type == 'report' ? 'orderReportData' : 'orderContractReportData']: data.filter(item => item.title)
      });
      setFields(newData);
      Ant.message.success({
        content: 'Изменения сохранены',
        key: MESSAGE_KEY,
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [fields]);

  return (
    <div className="templates">
      <div className=" templates__form flexbox">
        {fields ? (
          <>
            <TemplatesForm onSave={onSave} type="report" fields={fields.orderReportData || []} />
            <TemplatesForm onSave={onSave} type="contractReport" fields={fields.orderContractReportData || []} />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Templates;
