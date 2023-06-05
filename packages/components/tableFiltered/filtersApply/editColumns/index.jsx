import React, { useCallback, useState, useRef } from 'react';
import { Ant, VzForm, VzTable, IconDeprecated } from '@vezubr/elements';
import PropTypes from 'prop-types';

function ElementEditor(props) {
  const { onRemove, onUpdate, uuid, name, onDefault, isDefault = false } = props;

  const [mode, setMode] = useState('view');

  const initialNameValue = name;

  const nameRef = useRef(initialNameValue);

  const handleOnChange = useCallback((e) => (nameRef.current = e.target.value), []);

  const handleEdit = useCallback(() => {
    setMode('edit');
  }, []);

  const handleSaveNameValue = useCallback(() => {
    if (mode === 'edit') {
      setMode('view');
      onUpdate(uuid, { name: nameRef.current });
      return;
    }
    setMode('edit');
  }, [mode, onUpdate, uuid]);

  const handleDelete = useCallback(() => {
    onRemove(uuid);
  }, [onRemove]);

  const handleDefault = useCallback(() => {
    onDefault(uuid);
  }, [onDefault])

  return (
    <div className="filters-apply__wrapper">
      <span className="filters-apply__item-wrp">
        {mode === 'view' ? (
          <div className="filters-apply__wrp">
            <span className={'filters-apply__text'}>{initialNameValue}</span>
            <span className={'filters-apply__icons'}>
              <IconDeprecated
                className={'pointer'}
                name={'editBlack'}
                onClick={handleEdit}
                title={'Редактировать'}
              />
              <IconDeprecated
                className={'pointer'}
                name={'trashBinOrange'}
                onClick={handleDelete}
                title={'Удалить'}
              />
              <IconDeprecated
                className={'pointer'}
                name={isDefault ? 'favoriteOrangeEnabled' : 'favoriteOrange'}
                onClick={handleDefault}
                title={'Установить по умолчанию'}
              />
            </span>
          </div>
        ) : (
          <>
            <Ant.Input
              size="small"
              defaultValue={initialNameValue}
              className="filters-apply__edit-input"
              onPressEnter={handleSaveNameValue}
              onBlur={handleSaveNameValue}
              onChange={handleOnChange}
            />
            <Ant.Button onClick={handleSaveNameValue} className="filters-apply__save-button ant-btn">
              Сохранить
            </Ant.Button>
          </>
        )}
      </span>
    </div>
  );
}

export default ElementEditor;
