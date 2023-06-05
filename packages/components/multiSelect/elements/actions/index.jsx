import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { Ant, VzForm, showAlert } from '@vezubr/elements';
import cn from 'classnames';

function MultiSelectActions(props) {
  const { onChange, setVisibleModal, selectedRows = [], otherActions } = props;
  const disabledClass = { 'disabled': !selectedRows.length };

  const onChangeVisibleSelectedList = (e) => {
    onChange(e);
  };

  const showChangeModal = () => {
    if (selectedRows.length !== 0) {
      setVisibleModal(true);
    } else {
      showAlert({
        title: `Выберите одну или несколько строк`,
        onOk: () => { },
      });
    }
  };

  const countSelectedRows = useMemo(() => selectedRows.length, [selectedRows]);

  return (
    <div className="multiselect">
      <div className="multiselect__wrapper">
        <div className="multiselect__total">
          <div className="multiselect__text">Выбранных строк:</div>
          <span className="multiselect__number">{countSelectedRows}</span>
        </div>

        <Ant.Checkbox className="multiselect__checkbox" onChange={onChangeVisibleSelectedList}>
          <div className="multiselect__checkbox-text">Показать выбранные</div>
        </Ant.Checkbox>
      </div>

      <VzForm.Actions>
        <Ant.Button onClick={showChangeModal} type={'primary'} className={cn('rounded box-shadow primary', disabledClass)}>
          Редактировать
        </Ant.Button>
        {Array.isArray(otherActions) && (
          otherActions.map((el) => (
            <Ant.Button
              onClick={() => el.onAction()}
              type={'primary'}
              className={cn('rounded box-shadow primary', disabledClass)}
            >
              {el.title}
            </Ant.Button>
          ))
        )}
      </VzForm.Actions>
    </div>
  );
}

export default MultiSelectActions;