import React from 'react';
import cn from 'classnames';
import PropTypes from 'prop-types';
import { Ant } from '@vezubr/elements';
import { reaction } from 'mobx';
import { OrderContext } from '../../context';
import usePrevious from '@vezubr/common/hooks/usePrevious';
import { Utils } from '@vezubr/common/common';
import { useDebouncedCallback } from 'use-debounce';
import Animate from 'rc-animate';

function initGroupChecked(fields, store, prevList) {
  const group = {};
  fields.forEach((field, index) => {
    let groupState = field?.defaultChecked || null;
    if (prevList) {
      for (const name of field.names) {
        const validField = prevList?.[name]?.isValid;
        if (typeof validField !== 'undefined' && validField !== null) {
          groupState = validField;
          if (!groupState) {
            break;
          }
        }
      }
    }
    group[index] = groupState;
  });
  return group;
}

function initCheckedList(fields, store, prevList) {
  const list = {};
  for (const field of fields) {
    for (const name of field.names) {
      const prevValid = prevList?.[name]?.isValid;
      const isValid = typeof prevValid !== 'undefined' ? prevValid : field?.defaultChecked || null;
      const value = store.data[name];
      list[name] = {
        value,
        isValid,
      };
    }
  }
  return list;
}

function OrderCalculateSteps(props) {
  const { fields, resultCalculation, onChange, timer } = props;

  const prevFields = usePrevious(fields);

  const { store } = React.useContext(OrderContext);

  const [affixed, setAffixed] = React.useState(false);

  const [onChangeDebounced] = useDebouncedCallback((checkedList, resultChecked) => {
    onChange(checkedList, resultChecked, store);
  }, timer || 1000);

  const groupChecked = React.useRef(initGroupChecked(fields, store));
  const checkedList = React.useRef(initCheckedList(fields, store));

  const [, setUpdated] = React.useState(Utils.uuid);

  const checkFields = React.useCallback((data, index) => {
    const newCheckedList = {
      ...checkedList.current,
    };

    const newGroupChecked = {
      ...groupChecked.current,
    };

    let isGroupValid = true;

    for (const item of data) {
      const { name, value } = item;
      const isValid = !store.checkFieldWithDependencies(name, value);

      newCheckedList[name] = {
        value,
        isValid,
      };

      if (!isValid) {
        isGroupValid = false;
      }
    }

    newGroupChecked[index] = isGroupValid;

    const resultChecked = Object.keys(newCheckedList).reduce((resultChecked, name) => {
      if (!resultChecked) {
        return false;
      }
      return newCheckedList[name].isValid;
    }, true);

    groupChecked.current = newGroupChecked;
    checkedList.current = newCheckedList;

    setUpdated(Utils.uuid);

    onChangeDebounced(newCheckedList, resultChecked);
  }, []);

  React.useEffect(() => {
    if (prevFields && fields && prevFields !== fields) {
      checkedList.current = initCheckedList(fields, store, checkedList.current);
      groupChecked.current = initGroupChecked(fields, store, checkedList.current);
    }
  }, [prevFields, fields]);

  React.useEffect(() => {
    if (!fields) {
      return;
    }

    const reactions = [];
    fields.forEach((item, index) => {
      reactions.push(
        reaction(
          () =>
            item.names.map((name) => ({
              name,
              value: store.data[name],
            })),
          (data) => checkFields(data, index),
        ),
      );
    });

    return () => {
      for (const disposer of reactions) {
        disposer();
      }
    };
  }, [checkFields, fields]);

  const renderedCalculate = React.useMemo(() => {
    const { min, max, status: calcStatus } = resultCalculation || {};

    const isFinalCalc = calcStatus === 'calculated';

    const calculationTitle = (
      <Animate transitionLeave={false} transitionName="fade" component={''}>
        <div key={isFinalCalc ? 'final' : 'wait'} className={'order-calculate-steps__item-calc__content'}>
          {isFinalCalc ? (
            max ? (
              <span>
                От <span className={'cost cost-min'}>{Utils.moneyFormat(min)}</span> до{' '}
                <strong className={'cost cost-max'}>{Utils.moneyFormat(max)}</strong>{' '}
              </span>
            ) : (
              <span className={'cost cost-min'}>{Utils.moneyFormat(min)}</span>
            )
          ) : (
            <span>Калькуляция</span>
          )}
        </div>
      </Animate>
    );

    let status = 'wait';

    switch (calcStatus) {
      case 'fetching':
        status = 'process';
        break;
      case 'error':
        status = 'error';
        break;
      case 'calculated':
        status = 'finish';
        break;
    }

    const calculationIcon = calcStatus === 'fetching' && <Ant.Icon type={'loading'} />;

    return (
      <Ant.Steps.Step
        className={'order-calculate-steps__item order-calculate-steps__item-calc'}
        status={status}
        title={calculationTitle}
        icon={calculationIcon}
      />
    );
  }, [resultCalculation]);

  return (
    <Ant.Affix className={'order-calculate-steps-affix'} offsetBottom={0} onChange={setAffixed}>
      <div className={cn('order-calculate-steps', { 'order-calculate-steps--affixed': affixed })}>
        <Ant.Steps size={'small'} current={-1} direction="horizontal">
          {fields.map(({ title, description, hidden, icon }, index) => {
            if (hidden) {
              return null;
            }

            const status =
              groupChecked?.current?.[index] === null ? 'wait' : groupChecked?.current?.[index] ? 'finish' : 'error';

            return (
              <Ant.Steps.Step
                className={'order-calculate-steps__item'}
                key={index}
                status={status}
                title={title}
                description={description}
                icon={icon}
              />
            );
          })}

          {renderedCalculate}
        </Ant.Steps>
      </div>
    </Ant.Affix>
  );
}

OrderCalculateSteps.propTypes = {
  fields: PropTypes.arrayOf(
    PropTypes.shape({
      names: PropTypes.arrayOf(PropTypes.string).isRequired,
      title: PropTypes.string,
      description: PropTypes.node,
    }),
  ),

  onChange: PropTypes.func,

  resultCalculation: PropTypes.shape({
    min: PropTypes.number,
    max: PropTypes.number,
    status: PropTypes.string.isRequired,
  }),

  timer: PropTypes.number,
};

export default OrderCalculateSteps;
