import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { Ant, VzForm, showError } from '@vezubr/elements';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import cn from 'classnames';
import { Profile as ProfileServices } from '@vezubr/services';
import IdentifierPreview from '../elements/preview';
const SEPARATOR = [
  {
    value: '/',
    id: 0,
  },
  {
    value: '-',
    id: 1,
  },
];

const VAR = [
  {
    value: 'source',
    name: 'Источник заказа',
    id: 0,
  },
  {
    value: 'y',
    name: 'Год в формате ГГ',
    id: 1,
  },
  {
    value: 'm',
    name: 'Месяц в формате ММ',
    id: 2,
  },
  {
    value: 'client',
    name: 'ID контрагента',
    id: 3,
  },
  {
    value: 'order_type',
    name: 'Тип рейса',
    id: 4,
  },
  {
    value: 'request_nr',
    name: 'Номер заявки',
    id: 5,
    excludeType: 'request',
  },
  {
    value: 'contractor_territory',
    name: 'Территория контрагента',
    id: 6,
  },
  {
    value: 'contract_attribute',
    name: 'Признак договора ',
    id: 7,
  },
  {
    value: 'employee_unit',
    name: 'Подразделение',
    id: 8,
  },
];

const SEQUENCE_TYPES = [
  {
    name: 'Порядковый номер',
    value: 'sequence_number',
    id: 0,
    type: 'input',
  },
  {
    name: 'Префикс',
    value: 'string',
    id: 1,
    type: 'input',
  },
  {
    name: 'Разделитель',
    value: 'separator',
    id: 2,
    type: 'separator',
  },
  {
    name: 'Переменная',
    value: 'var',
    id: 3,
    type: 'var',
  },
];

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const IdentifierForm = (props) => {
  const { type = 'request', dataSource, onDataChange, onSave, ...otherProps } = props;
  const [columns, setColumns] = useState([
    {
      value: null,
      type: null,
    },
  ]);
  const [inputs, setInputs] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = React.useCallback(async () => {
    if (onSave) {
      await onSave();
    }
    setModalVisible(false);
  }, [onSave]);

  const setInitialData = useCallback(
    (data) => {
      const newInputs = [];
      const newColumns = [];
      if (data?.[type]?.sequence && Array.isArray(data?.[type]?.sequence)) {
        data?.[type]?.sequence.forEach((el, index) => {
          newColumns[index] = {
            value: el.type,
            type: SEQUENCE_TYPES.find((item) => item.value === el.type)?.type,
          };
          newInputs[index] = el.value;
        });
        newColumns.push({
          value: null,
          type: null,
        });
      } else {
        return;
      }

      setColumns(newColumns);
      setInputs(newInputs);
    },
    [type],
  );

  useEffect(() => {
    setInitialData(dataSource);
  }, [dataSource, type]);

  useEffect(() => {
    const sendColumns = [...columns];
    if (sendColumns.length) {
      sendColumns.length = sendColumns.length - 1;
    }
    onDataChange({ columns: sendColumns, inputs }, type);
  }, [type, columns, inputs]);

  const separatorTypes = useMemo(
    () =>
      SEPARATOR.map((el) => (
        <Ant.Select.Option key={el.id} value={el.value}>
          {el.value}
        </Ant.Select.Option>
      )),
    [SEPARATOR],
  );

  const varTypes = useMemo(
    () =>
      VAR.filter((item) => item.excludeType !== type).map((el) => (
        <Ant.Select.Option key={el.id} value={el.value}>
          {el.name}
        </Ant.Select.Option>
      )),
    [VAR, type],
  );

  const sequienceTypes = useMemo(
    () =>
      SEQUENCE_TYPES.map((el) => (
        <Ant.Select.Option key={el.id} value={el.value}>
          {el.name}
        </Ant.Select.Option>
      )),
    [SEQUENCE_TYPES],
  );

  const onChangeInput = useCallback(
    (value, id) => {
      const newInputs = [...inputs];
      newInputs[id] = value;
      setInputs(newInputs);
    },
    [inputs, columns],
  );

  const onSelectSequence = useCallback(
    (value, id) => {
      let newCols = [...columns];
      let newInputs = [...inputs];

      if (!value && value !== 0) {
        newCols = newCols.filter((el, index) => index !== id);
        newInputs = newInputs.filter((el, index) => index !== id);
      } else {
        newCols = newCols.map((el, index) => {
          if (index === id) {
            el.value = value;
            el.type = SEQUENCE_TYPES.find((el) => value === el.value)?.type;
          }
          return el;
        });
        if (newInputs[id] || newInputs[id] === 0) {
          newInputs[id] = null;
        }
      }

      if (!newCols.length || newCols[newCols.length - 1]?.value || newCols[newCols.length - 1]?.value === 0) {
        newCols.push({
          value: null,
          type: null,
        });
      }
      setColumns(newCols);
      setInputs(newInputs);
    },
    [inputs, columns],
  );

  const renderColumns = useMemo(() => {
    const columnRenderer = columns.map((el, index) => {
      return (
        <Ant.Select
          allowClear={true}
          style={{ width: '100%' }}
          key={index}
          value={el.value}
          onChange={(e) => onSelectSequence(e, index)}
        >
          {sequienceTypes}
        </Ant.Select>
      );
    });
    return columnRenderer;
  }, [columns, sequienceTypes, inputs]);

  const renderInputs = useMemo(() => {
    if (!columns.length) {
      return [];
    }
    return columns.map((el, index) => {
      switch (el.type) {
        case 'input':
          return (
            <Ant.Input
              key={index}
              style={{ width: '100%' }}
              onChange={(e) => onChangeInput(e.target.value, index)}
              value={inputs?.[index]}
            />
          );
        case 'var':
          return (
            <Ant.Select
              key={index}
              style={{ width: '100%' }}
              onChange={(e) => onChangeInput(e, index)}
              value={inputs?.[index]}
            >
              {varTypes}
            </Ant.Select>
          );
        case 'separator':
          return (
            <Ant.Select
              key={index}
              style={{ width: '100%' }}
              onChange={(e) => onChangeInput(e, index)}
              value={inputs?.[index]}
            >
              {separatorTypes}
            </Ant.Select>
          );
      }
    });
  }, [columns, inputs]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }
      const { destination, source } = result;

      let newColumns = [...columns];
      let newInputs = [...inputs];

      if (!newColumns[source.index]?.value || destination.index === newColumns.length - 1) {
        return;
      }

      const updatedColumns = reorder(columns, result.source.index, result.destination.index);
      const updatedInputs = reorder(inputs, result.source.index, result.destination.index);

      setColumns(updatedColumns);
      setInputs(updatedInputs);
    },
    [inputs, columns],
  );

  const renderDraggableColumn = useMemo(() => {
    return renderColumns.map((el, index) => {
      return (
        <Draggable key={index} draggableId={String(index)} index={index}>
          {(provided) => (
            <div
              className="table-config__row"
              {...provided.draggableProps}
              {...provided.dragHandleProps}
              ref={provided.innerRef}
            >
              <div className={cn('vz-form-field-addresses__item__navigation')}>
                <Ant.Icon
                  className={
                    'vz-form-field-addresses__item__navigation__action vz-form-field-addresses__item__navigation__action--drag'
                  }
                  type={'drag'}
                />
              </div>
              <div style={{ width: '200px' }} className="table-config__item">
                {el}
              </div>
              <div style={{ width: '200px' }} className="table-config__item">
                {renderInputs?.[index]}
              </div>
            </div>
          )}
        </Draggable>
      );
    });
  }, [renderColumns, renderInputs]);

  const onCloseModal = React.useCallback(() => {
    setInitialData(dataSource);
    setModalVisible(false);
  }, [dataSource]);

  return (
    <div className="identifier__item" style={{ width: '50%' }}>
      <span className={'settings-form__group__subtitle'} style={{ fontWeight: 'bold' }}>
        {' '}
        Нумерация {type === 'request' ? 'заявки' : 'рейса'}{' '}
      </span>
      <IdentifierPreview onClick={() => setModalVisible(true)} columns={columns} inputs={inputs} {...otherProps} />
      <Ant.Modal
        title={`Настройка нумерации ${type === 'request' ? 'заявок' : 'рейсов'}`}
        visible={modalVisible}
        width={500}
        bodyStyle={{backgroundColor: '#fff'}}
        bodyNoPadding={true}
        centered={false}
        destroyOnClose={true}
        onCancel={onCloseModal}
        footer={
          <div className="flexbox justify-right">
            <Ant.Button onClick={onCloseModal}>Отмена</Ant.Button>
            <Ant.Button disabled={!columns?.find(el => el.value === 'sequence_number')} type={'primary'} onClick={handleSave}>
              Сохранить
            </Ant.Button>
          </div>
        }
      >
        <IdentifierPreview
          runtimeUpdate={true}
          onClick={() => setModalVisible(true)}
          columns={columns}
          inputs={inputs}
          inModalPreview={true}
          {...otherProps}
        />
        <div className="table-config__row">
          <div className="table-config__item" style={{ width: '200px' }}>
            Название
          </div>
          <div className="table-config__item" style={{ width: '200px' }}>
            Значение
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="list">
            {(provided) => (
              <div {...provided.droppableProps} className={'table-config__table'} ref={provided.innerRef}>
                {renderDraggableColumn}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Ant.Modal>
    </div>
    // <div style={{ width: '100%' }} className='flexbox'>
    //   <div style={{ 'width': '50%' }}>
    //     {renderColumns}
    //   </div>
    //   <div style={{ 'width': '50%' }}>
    //     {renderInputs}
    //   </div>

    // </div>
  );
};

export default IdentifierForm;
