import React, { useCallback, useState, useMemo, useEffect } from 'react';

import { Ant, VzForm } from '@vezubr/elements';
import MarginForm from "../../../forms/contract-margin-form";
import _isEqual from 'lodash/isEqual';
const MESSAGE_KEY = '__SettingsCargoPlace__';

function Margin(props) {
  const { onMarginSave, values, notActive = false } = props;
  const { margin } = values;
  const [bargain, setBargain] = useState(null);
  const [rate, setRate] = useState(null);
  const [tariff, setTariff] = useState(null);

  useEffect(() => {
    if (margin) {
      const marginValues = {
        bargain: { ...margin.bargain},
        rate: { ...margin.rate },
        tariff: { ...margin.tariff }
      }
      Object.keys(marginValues).forEach(el => {
          Object.keys(marginValues[el]).forEach(item => {
            if (marginValues[el][item]?.type === 'amount') {
              marginValues[el][item].value /= 100;
            }
          })
      });
      setBargain(marginValues.bargain);
      setRate(marginValues.rate);
      setTariff(marginValues.tariff);
    }
  }, [margin]);

  const onSubmit = async () => {
    onMarginSave({bargain, rate, tariff});
  };

  return (
    <>
      <MarginForm
        title={'Торги'}
        values={bargain}
        onSave={setBargain}
        notActive={notActive}
        
      />
      <MarginForm
        title={'Ставка'}
        values={rate}
        onSave={setRate}
        notActive={notActive}
      />
      <MarginForm
        title={'Тариф'}
        values={tariff}
        onSave={setTariff}
        notActive={notActive}
      />
      <VzForm.Actions>
        {onMarginSave && <Ant.Button
          type="primary"
          onClick={onSubmit}
          disabled={notActive}
        >
          Сохранить маржинальность
        </Ant.Button>}
      </VzForm.Actions>
    </>
  );
}

export default Margin;
