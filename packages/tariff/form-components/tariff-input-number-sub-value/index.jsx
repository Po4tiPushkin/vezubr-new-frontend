import React, { useContext, useMemo } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';
import { observer } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { TariffContext } from '../../context';

const TariffInputNumberSubValue = (props) => {
  const { getValue, setValue, getError } = props;
  const value = getValue();
  const error = getError();
  const { store } = useContext(TariffContext);
  return (
    <>
      {store.editable ?
        <div
          className={cn('tariff-input-number', { 'has-error': error })}
        ><Ant.InputNumber min={0} value={value} onChange={(e) => { setValue(e) }} />
        </div>
        :
        <div
          className={'tariff-cost-wrap'}
        >
          {value || value === 0 ?
            value
            :
            ''
          }
        </div>
      }

    </>

  )

}

export default observer(TariffInputNumberSubValue);