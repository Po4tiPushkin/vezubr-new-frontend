import React, { useCallback, useMemo, useState } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import cn from 'classnames';
import { Utils } from '@vezubr/common/common';

const reorder = (list, startIndex, endIndex) => {
  const result = [...list];
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

const TemplatesForm = (props) => {
  const { onSave, fields: fieldsInput, type } = props;
  const [fields, setFields] = useState([
    ...fieldsInput,
    {
      title: null,
      value: null
    }
  ])

  React.useEffect(() => {
    let newFields = [...fieldsInput]
    if (newFields.length < 5) {
      newFields.push({
        title: null,
        value: null
      })  
    }
    setFields(newFields)
  }, [fieldsInput])
  
  const [modalVisible, setModalVisible] = useState(false);

  const handleSave = React.useCallback(async () => {
    if (onSave) {
      await onSave(fields.filter((item) => item.value !== null), type);
    }
    setModalVisible(false);
  }, [onSave, fields]);

  const onInputChange = React.useCallback((type, index) => {
    return (el) => {
      let newFields = [...fields];
      newFields[index][type] = el.target.value
      newFields = newFields.filter(item => {
        return !!item.title || !!item.value
      })
      const itemsCount = newFields.length
      if (
        newFields.length !== 5 &&
        newFields[itemsCount - 1].title &&
        newFields[itemsCount - 1].value
      ) {
        newFields.push({
          title: null,
          value: null,
        });
      }
      setFields(newFields)
    }
  }, [fields])

  const renderFields = useMemo(() => {
    const fieldsRenderer = fields.map((el, index) => {
      return (
        <>
          <div style={{ width: '300px' }} className="table-config__item">
            <Ant.Input
              allowClear={true}
              style={{ width: '100%' }}
              key={index + el.value}
              value={el.title}
              onChange={onInputChange('title', index)}
              maxLength={100}
            />
          </div>
          {
            el.title || el.value ? (
              <div style={{ width: '300px' }} className="table-config__item">
                <Ant.Input.TextArea
                  allowClear={true}
                  autoSize
                  style={{ width: '100%' }}
                  key={index}
                  value={el.value}
                  onChange={onInputChange('value', index)}
                  maxLength={2000}
                />
              </div>
            ) : (
              null
            )
          }
          
        </>
      )
    });
    return fieldsRenderer;
  }, [fields]);

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }
      const { destination, source } = result;

      let newFields = [...fields];

      if (!newFields[source.index]?.value || destination.index === newFields.length - 1) {
        return;
      }

      const updatedFields = reorder(fields, result.source.index, result.destination.index);

      setFields(updatedFields);
    },
    [fields],
  );

  const renderDraggableColumn = useMemo(() => {
    return renderFields.map((el, index) => {
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
              {el}
            </div>
          )}
        </Draggable>
      );
    });
  }, [renderFields]);

  const onCloseModal = React.useCallback(() => {
    setFields([
      ...fieldsInput,
      {
        title: null,
        value: null
      }
    ])
    setModalVisible(false);
  }, [fieldsInput]);

  const onPreviewClick = React.useCallback(() => {
    const formattedFields = JSON.stringify(fields).replaceAll('%', '"percent"')
    localStorage.setItem('templatePreviewFields', formattedFields)
    window.open(`/template-preview`, '_blank')
  }, [fields]);

  return (
    <div className="templates__item" style={{ width: '50%' }}>
      <span className={'settings-form__group__subtitle'} style={{ fontWeight: 'bold' }}>
        Дополнительные поля {`${type == 'report' ? 'заявки' : 'договора-заявки'}`}
      </span>
      <VzForm.Item label="Доп. поля">
        <Ant.Input
          {...{
            readOnly: true,
            value: `Добавлено ${fields.filter((item) => item.value !== null).length} полей`,
            addonAfter: (
              <Ant.Button size={'small'} onClick={() => setModalVisible(true)}>
                Редактировать
              </Ant.Button>
            ),
          }}
        />
      </VzForm.Item>
      <Ant.Modal
        title={`Настройка дополнительных полей ${type == 'report' ? 'заявки' : 'договора-заявки'}`}
        visible={modalVisible}
        width={700}
        bodyStyle={{ backgroundColor: '#fff' }}
        bodyNoPadding={true}
        className={'templates__modal'}
        centered={false}
        destroyOnClose={true}
        onCancel={onCloseModal}
        footer={
          <div className="flexbox justify-right">
            <Ant.Button onClick={onPreviewClick}>Предпросмотр</Ant.Button>
            <Ant.Button onClick={onCloseModal}>Отмена</Ant.Button>
            <Ant.Button type={'primary'} onClick={handleSave}>
              Сохранить
            </Ant.Button>
          </div>
        }
      >
        <div className="table-config__row">
          <div className="table-config__item" style={{ width: '300px' }}>
            Заголовок
          </div>
          <div className="table-config__item" style={{ width: '300px' }}>
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
  );
};

export default TemplatesForm;
