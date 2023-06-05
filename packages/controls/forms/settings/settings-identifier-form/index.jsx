import React, { useState, useCallback, useMemo, useEffect } from 'react';
import IdentifierForm from './form';
import { Profile as ProfileServices } from '@vezubr/services';
import { Ant, VzForm, showError } from '@vezubr/elements';
import t from '@vezubr/common/localization';
const MESSAGE_KEY = 'identifier-saving';
const Identifier = (props) => {
  const { numerationType } = props;
  const [dataSource, setDataSource] = useState(null);
  const [data, setData] = useState({});
  const [requestPreview, setRequestPreview] = useState('');
  const fetchData = useCallback(async () => {
    try {
      const response = await ProfileServices.getNumeratorTemplate();
      setDataSource(response);
    } catch (e) {
      console.error(e);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const onDataChange = useCallback(
    (newData, type) => {
      setData((prev) => {
        return { ...prev, [type]: { ...newData } };
      });
    },
    [data],
  );

  const onSave = useCallback(async () => {
    const requestSequence = data.request?.columns.map((el, index) => {
      return {
        type: el.value,
        value: data?.request?.inputs[index],
      };
    });
    const orderSequence = data.order?.columns.map((el, index) => {
      return {
        type: el.value,
        value: data?.order?.inputs[index],
      };
    });
    const dataForSend = {
      request: {
        sequence: requestSequence,
      },
      order: {
        sequence: orderSequence,
      },
    };
    try {
      const newData = await ProfileServices.setNumeratorTemplate(dataForSend);
      setDataSource(newData);
      Ant.message.success({
        content: 'Изменения сохранены',
        key: MESSAGE_KEY,
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, [dataSource, data]);

  return (
    <div className="identifier">

      <div className=" identifier__form flexbox">
        {dataSource ? (
          <>
            <IdentifierForm
              type="request"
              onSave={onSave}
              setRequestPreview={setRequestPreview}
              onDataChange={onDataChange}
              dataSource={dataSource}
              disabled={numerationType === 'numeration_client'}
            />
            <IdentifierForm
              type="order"
              onSave={onSave}
              requestPreview={requestPreview}
              onDataChange={onDataChange}
              dataSource={dataSource}
              disabled={numerationType === 'numeration_client'}
            />
          </>
        ) : null}
      </div>
    </div>
  );
};

export default Identifier;
