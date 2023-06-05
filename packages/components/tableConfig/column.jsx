import React, { useCallback } from 'react';
import cn from 'classnames';
import { Ant } from '@vezubr/elements';
import { Draggable } from 'react-beautiful-dnd';

export default function Column(props) {
  const {
    title,
    defaultTitle,
    width,
    extra,
    float,
    columnName,
    index,
    onChangeInput,
    firstInBlock,
    lastInBlock,
    exporting,
    disabled
  } = props;

  return (
    <Draggable draggableId={columnName} index={index}>
      {(provided) => (
        <div
          className={cn('table-config__row', { ['margin-top-10']: firstInBlock, ['margin-bottom-10']: lastInBlock })}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <div className={cn('vz-form-field-addresses__item__navigation')}>
            <Ant.Icon
              className={
                'vz-form-field-addresses__item__navigation__action vz-form-field-addresses__item__navigation__action--drag'
              }
              type={'drag'}
            />
          </div>

          <div className="table-config__item padding-top-18">
            <Ant.Checkbox
              onChange={(e) => onChangeInput(!e.target.checked, columnName, 'extra')}
              checked={disabled ? false : !extra}
              disabled={disabled}
              style={{ width: '20px' }}
            />
          </div>

          <div className="table-config__item" style={{ width: 220, display: 'flex', alignItems: 'center' }}>
            <span>
              {defaultTitle}
            </span>
          </div>

          <div className="table-config__item">
            <Ant.Input
              onChange={(e) => onChangeInput(e.target.value, columnName, 'title')}
              value={title}
              style={{ width: '200px' }}
              placeholder={'Введите название поля'}
              disabled={disabled}
            />
          </div>

          {!exporting && (
            <div className="table-config__item">
              <Ant.Select
                showSearch={true}
                onChange={(e) => onChangeInput(e, columnName, 'float')}
                value={float}
                style={{ width: '130px' }}
              >
                <Ant.Select.Option columnName={0} value={null}>
                  без привязки
                </Ant.Select.Option>
                <Ant.Select.Option columnName={1} value={'left'}>
                  влево
                </Ant.Select.Option>
                <Ant.Select.Option columnName={2} value={'right'}>
                  вправо
                </Ant.Select.Option>
              </Ant.Select>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}