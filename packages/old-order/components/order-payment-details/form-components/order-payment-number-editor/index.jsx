import React, { useCallback, useContext, useMemo, useEffect, useRef, useState } from 'react';
import { observer, useObserver } from 'mobx-react';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import compose from '@vezubr/common/hoc/compose';
import cn from 'classnames';
import { isNumber } from '@vezubr/common/utils';
import {
  ADDITIONAL_TIME_ARTICLES,
  ALL_TIME_ARTICLES,
  MINIMAL_TIME_ARTICLES,
  ORDER_SERVICES_CONFIG,
} from '../../../../constants';
import { OrderPaymentContext } from '../../../../context';
import WorkTimeEditor from './elements/workTimeEditor';
import HoursEditor from './elements/hoursEditor';
const CLS = 'order-payment-number-editor';

function OrderPaymentNumberEditor(props) {
  const { article, parseValue, formatValue, setCurrentProp, getCurrentProp, getPrevProp, canEditProp, ...otherProps } =
    props;

  const config = ORDER_SERVICES_CONFIG?.[article] || {};

  const { store, workTime } = useContext(OrderPaymentContext);
  const { editable: editableStore } = store;

  const articleForWorkTime = ADDITIONAL_TIME_ARTICLES.includes(article)
    ? Object.keys(workTime.get()).find((item) => ADDITIONAL_TIME_ARTICLES.includes(parseInt(item)))
    : MINIMAL_TIME_ARTICLES.includes(article)
    ? Object.keys(workTime.get()).find((item) => MINIMAL_TIME_ARTICLES.includes(parseInt(item)))
    : article;

  const editable = useObserver(() => editableStore && (canEditProp ? store[canEditProp](article) : true));

  const [editing, setEditing] = useState(false);
  const [visiblePopover, setVisiblePopover] = useState(false);
  const numberRef = useRef(null);
  const isTimeEditableQuantity = React.useMemo(
    () => store.tariffType !==4 && ALL_TIME_ARTICLES.includes(article) && getCurrentProp === 'getQuantity' ,
    [article, getCurrentProp],
  );
  const isTimeQuantity = React.useMemo(
    () => ADDITIONAL_TIME_ARTICLES.includes(article) && getCurrentProp === 'getQuantity',
    [article, getCurrentProp],
  );

  const toggleEdit = useCallback(() => {
    if (!editable) {
      setEditing(false);
      return;
    }
    if (isTimeEditableQuantity) {
      setVisiblePopover(!visiblePopover);
      setEditing(false);
    } else {
      setEditing(!editing);
      setVisiblePopover(false);
    }
  }, [editing, editable]);

  const updated = useCallback(
    (valueInput) => {
      let value = valueInput;
      if (isNumber(value)) {
        if (config.onlyNegative && value > 0) {
          value = 0 - value;
        }
      }

      store[setCurrentProp](article, parseValue(value));
    },
    [article, parseValue, setCurrentProp, config.onlyNegative],
  );

  useEffect(() => {
    if (editing) {
      const input = numberRef?.current?.inputNumberRef?.input;
      if (input) {
        input.focus();
      }
    }
  }, [editing]);

  const itemValue = useObserver(() => store[getCurrentProp](article));
  const itemValuePrev = useObserver(() => store[getPrevProp](article));

  const itemValueFormatted = useMemo(() => formatValue(itemValue), [itemValue, formatValue]);
  const itemValuePrevFormatted = useMemo(() => formatValue(itemValuePrev), [itemValuePrev, formatValue]);
  const formattedWorkTime = React.useMemo(
    () => `${Math.floor(workTime.get()[articleForWorkTime] / 60)} ч ${workTime.get()[articleForWorkTime] % 60} м`,
    [workTime.get()[articleForWorkTime]],
  );

  const valueUpdated = useMemo(
    () => editable && isNumber(itemValuePrevFormatted) && itemValue !== itemValuePrev,
    [itemValue, itemValuePrev, editable, itemValuePrevFormatted],
  );

  const reset = useCallback(() => {
    store[setCurrentProp](article, itemValuePrev);
  }, [article, itemValuePrev]);

  const editor = React.useMemo(() => {
    if (editing && editable && !visiblePopover) {
      return (
        <Ant.InputNumber
          size="small"
          {...otherProps}
          value={itemValueFormatted}
          ref={numberRef}
          className={`${CLS}__number`}
          onPressEnter={toggleEdit}
          onBlur={toggleEdit}
          onChange={updated}
        />
      );
    } else {
      return (
        <>
          <div
            className={cn(`${CLS}__text`, {
              [`${CLS}__text--editable`]: editable,
              [`${CLS}__text--updated`]: valueUpdated,
            })}
            onClick={toggleEdit}
            title={editable ? 'Редактировать' : undefined}
          >
            {isTimeQuantity && formattedWorkTime ? formattedWorkTime : itemValueFormatted}
            {editable && <Ant.Icon type={'edit'} />}
          </div>
          <Ant.Popover
            content={isTimeQuantity ? <HoursEditor article={article} /> : <WorkTimeEditor />}
            title="Редактирование"
            trigger="click"
            destroyTooltipOnHide={true}
            visible={visiblePopover}
            onVisibleChange={setVisiblePopover}
          />
        </>
      );
    }
  }, [
    editing,
    editable,
    valueUpdated,
    numberRef,
    article,
    visiblePopover,
    itemValueFormatted,
    itemValuePrevFormatted,
    formattedWorkTime,
  ]);

  return (
    <div className={CLS}>
      {valueUpdated && (
        <div title={'Сбросить'} className={`${CLS}__prev`} onClick={reset}>
          {itemValuePrevFormatted}
        </div>
      )}

      {editor}
    </div>
  );
}

OrderPaymentNumberEditor.defaultProps = {
  formatValue: (value) => value,
  parseValue: (value) => value,
};

OrderPaymentNumberEditor.propTypes = {
  article: PropTypes.number.isRequired,
  formatValue: PropTypes.func,
  parseValue: PropTypes.func,
  getCurrentProp: PropTypes.string.isRequired,
  canEditProp: PropTypes.string,
  setCurrentProp: PropTypes.string.isRequired,
  getPrevProp: PropTypes.string.isRequired,
};

export default compose([observer])(OrderPaymentNumberEditor);
