import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import { Button } from 'antd';
import Column from './column';
import { VzForm } from '@vezubr/elements';
import { getDBConfig, setDBConfig } from './utils/index';

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};

export default function Editor({ tableKey, onSave, exporting = false }) {
  const [config, setConfig] = useState(() => getDBConfig(tableKey));
  const [visibleSaveButton, setVisibleSaveButton] = useState(false);

  const columns = useMemo(() => {
    const columnsAll = Object.keys(config.columns)
      .map((key) => ({ ...config.columns[key], key }))
      .sort((a, b) => a.weight - b.weight)
      .filter(item => !!(item?.title || item?.key !== 'undefined' || item?.dataIndex))
    const columnsLeft = columnsAll.filter(el => el.float === 'left');
    const columnsCenter = columnsAll.filter(el => !el.float);
    const columnsRight = columnsAll.filter(el => el.float === 'right');
    return [...columnsLeft, ...columnsCenter, ...columnsRight];

    // exporting ?
    //   [...columnsLeft, ...columnsCenter, ...columnsRight].filter(el => el?.export)
    //   :
  }, [config.columns, exporting])


  const updateConfig = useCallback(
    (config) => {
      let newColumns = Object.entries(config.columns)
        .filter(([key, value]) => !!(value?.title || key !== 'undefined' || value?.dataIndex))
        .reduce((acc, [key, value]) => {
          if (!acc[key]) {
            acc[key] = value;
          }
          return acc;
        }, {});
      config.columns = newColumns
      setConfig(config);
      setVisibleSaveButton(true);
    },
    [tableKey],
  );

  const onDragEnd = useCallback(
    (result) => {
      if (!result.destination) {
        return;
      }

      if (result.destination.index === result.source.index) {
        return;
      }

      const updatedColumns = reorder(columns, result.source.index, result.destination.index);

      const newColumnsObj = updatedColumns.reduce(
        (cObj, item, index) => {
          cObj[item.key] = {
            ...cObj[item.key],
            weight: index * 10,
          };

          return cObj;
        },
        { ...config.columns },
      );

      const newConfig = {
        ...config,
        columns: newColumnsObj,
      };

      updateConfig(newConfig);
    },
    [columns, config],
  );

  const onChangeInput = useCallback((value, key, field) => {
    const newConfig = {
      ...config,
      columns: {
        ...config.columns,
        [key]: {
          ...config.columns[key],
          [field]: value,
        },
      },
    };

    updateConfig(newConfig);
  }, [config]);

  const handleSave = useCallback(() => {
    if (!exporting) {
      setDBConfig(tableKey, config);
    }
    onSave(config);
  }, [tableKey, config, onSave, exporting]);

  const handleToDefault = useCallback(() => {
    updateConfig({
      ...config,
      columns: config.defaultColumns,
    });
  }, [config]);

  const renderColumns = columns.map(({ width, defaultTitle, extra, float, title, key, export: exportInput }, index) => {
    const defaultColumn = Object.entries(config.defaultColumns).find(([defaultKey, value]) => defaultKey == key)
    return (
      <Column
        title={title}
        defaultTitle={defaultColumn ? defaultColumn?.[1]?.title : ''}
        firstInBlock={index && columns[index - 1].float !== float}
        lastInBlock={index !== columns.length - 1 && columns[index + 1] && columns[index + 1].float !== float}
        width={width}
        extra={extra}
        float={float}
        index={index}
        columnName={key}
        onChangeInput={onChangeInput}
        key={key}
        exporting={exporting}
        disabled={exporting && !exportInput}
      />
    );
  });

  return (
    <>
      <div className="table-config__row" style={{ margin: '16px 16px 0px 50px' }}>
        <div
          className="table-config__item padding-top-5"
          style={{ width: '40px', display: 'flex', alignItems: 'center' }}
        ></div>
        <div className="table-config__item padding-top-16" style={{ width: '220px' }}>
          Системное название
        </div>
        <div className="table-config__item padding-top-16" style={{ width: '220px' }}>
          Название
        </div>
        {!exporting && (
          <div className="table-config__item padding-top-16" style={{ width: '150px' }}>
            Привязка поля
          </div>
        )}
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="list">
          {(provided) => (
            <div {...provided.droppableProps} className={'table-config__table'} style={{ margin: '0 16px' }} ref={provided.innerRef}>
              {renderColumns}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {(visibleSaveButton || exporting) && (
        <VzForm.Actions style={{ backgroundColor: '#fff', position: 'sticky', margin: 0, padding: 24, bottom: 0 }}>
          {
            !exporting ? (
              <>
                <Button type={'ghost'} onClick={handleToDefault} className={'semi-wide margin-left-16'}>
                  По умолчанию
                </Button>
                <Button type="primary" onClick={handleSave} className={'semi-wide margin-left-16'}>
                  Сохранить
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" onClick={handleSave} className={'semi-wide margin-left-16'}>
                  Экспортировать
                </Button>
              </>
            )
          }
        </VzForm.Actions>
      )}
    </>
  );
}
