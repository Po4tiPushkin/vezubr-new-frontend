import React from 'react';
import { OrderPaymentContext } from '../../../../../context';
import { useObserver, observer } from 'mobx-react';
import compose from '@vezubr/common/hoc/compose';
import { Ant } from '@vezubr/elements';
import './hoursEditor.scss';
import { ADDITIONAL_TIME_ARTICLES, MINIMAL_TIME_ARTICLES } from '../../../../../constants';

function HoursEditor({ article: articleInput }) {
  const { workTime } = React.useContext(OrderPaymentContext);

  const article = ADDITIONAL_TIME_ARTICLES.includes(articleInput)
    ? Object.keys(workTime.get()).find((item) => ADDITIONAL_TIME_ARTICLES.includes(parseInt(item)))
    : MINIMAL_TIME_ARTICLES.includes(articleInput)
    ? Object.keys(workTime.get()).find((item) => MINIMAL_TIME_ARTICLES.includes(parseInt(item)))
    : articleInput;

  const [hours, minutes] = React.useMemo(
    () => [Math.floor(workTime.get()[article] / 60), Math.floor(workTime.get()[article] % 60)],
    [workTime.get()[article]],
  );

  const inputStyle = {
    maxWidth: '33px',
  };

  const spanStyle = {
    margin: '0 4px',
  };

  const onChange = React.useCallback(
    (value, isHours) => {
      if (isHours) {
        workTime.set({ [article]: value * 60 + (minutes % 60) }, true);
      } else {
        if (value <= 59) {
          workTime.set({ [article]: value + hours * 60 }, true);
        }
      }
    },
    [article, hours, minutes],
  );

  return (
    <>
      <div className="order-payment-hours-editor flexbox align-center">
        <Ant.InputNumber
          size="small"
          value={hours}
          style={inputStyle}
          min={0}
          max={100}
          onChange={(value) => onChange(value, true)}
        />
        <span style={spanStyle}>ч</span>
        <Ant.InputNumber
          size="small"
          value={minutes}
          style={inputStyle}
          min={0}
          max={59}
          onChange={(value) => onChange(value, false)}
        />
        <span style={spanStyle}>м</span>
      </div>
    </>
  );
}

export default HoursEditor;
