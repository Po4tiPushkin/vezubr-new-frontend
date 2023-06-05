import { Ant, LoaderFullScreen, VzForm } from "@vezubr/elements";
import PropTypes from "prop-types";
import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { TYPES } from '../../../pages/settings/tabs/settings-custom-properties/constants';
import PossibleValuesModal from "./elements/possibleValuesModal";
import useColumns from "./hooks/useColumns";

const FIELDS = {
  cyrillicName: 'cyrillicName',
  latinName: 'latinName',
  type: 'type',
  entityName: 'entityName',
  isRequired: 'isRequired',
  possibleValues: 'possibleValues'
};



const validators = {
  [FIELDS.cyrillicName]: (cyrillicName) => !/^[^a-zA-Z]+$/gm.test(cyrillicName) && 'Поле должно содержать только кириллицу',
  [FIELDS.latinName]: (latinName) => !/^[^а-яА-Я]+$/gm.test(latinName) && 'Поле должно содержать только латиницу',
  [FIELDS.entityName]: (entityName) => !entityName && 'Обязательное поле',
  [FIELDS.type]: (type) => !type && 'Обязательное поле',
}

function CustomPropsForm(props) {
  const { onSave, form, disabled = false, values = {}, loading = false } = props;
  const { getFieldError, getFieldDecorator, getFieldValue } = form;
  const history = useHistory()
  const dictionaries = useSelector((state) => state.dictionaries)
  const [possibleValues, setPossibleValues] = React.useState(values.possibleValues || [])

  React.useEffect(() => {
    setPossibleValues(values.possibleValues || [])
  }, [values.possibleValues])

  const rules = VzForm.useCreateAsyncRules(validators)

  const typesOptions = React.useMemo(() => {
    return TYPES.map(({ value, title }) =>
      <Ant.Select.Option value={value} key={value}>
        {title}
      </Ant.Select.Option>
    )
  }, [])

  const entitiesOptions = React.useMemo(() => {
    let customPropertyEntitiesFiltered = dictionaries.customPropertyEntities;
    if (APP === 'producer') {
      customPropertyEntitiesFiltered = customPropertyEntitiesFiltered.filter(el => el.id !== 'order');
    }
    return customPropertyEntitiesFiltered.map(({ id, title }) =>
      <Ant.Select.Option value={id} key={id}>
        {title}
      </Ant.Select.Option>
    )
  }, [dictionaries.customPropertyEntities])

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (onSave) {
        onSave(form, possibleValues);
      }
    },
    [form, onSave, possibleValues],
  );

  const deleteRecord = React.useCallback((recordId) => {
    setPossibleValues([...possibleValues.filter(({ id }) => id !== recordId)])
  }, [possibleValues]);

  const editRecord = React.useCallback((record) => {
    setEditorModalVisible(record)
  }, [setEditorModalVisible, possibleValues]);

  const [possibleValuesColumns, width] = useColumns({ editRecord, deleteRecord })

  const [editorModalVisible, setEditorModalVisible] = React.useState(false)

  const handleSaveRecord = React.useCallback((id, title) => {
    if (!id || !title) {
      throw new Error('Заполните оба поля')
    }
    if (typeof editorModalVisible !== 'boolean') {
      setPossibleValues(possibleValues.map((val) => {
        if (val.id == id) {
          val.title = title
        }
        return val
      }))
    } else {
      if (possibleValues.find((val) => val.id == id) !== undefined) {
        throw new Error('Значение с таким идентификатором уже занято')
      }
      setPossibleValues(possibleValues.concat([{ id, title }]));
    }
    setEditorModalVisible(false)
  }, [setPossibleValues, possibleValues, editorModalVisible])

  if (loading) {
    return <LoaderFullScreen />
  }

  return (
    <Ant.Form className="custom-props-form" layout="vertical">
      <VzForm.Group title={'Основные параметры поля'}>
        <VzForm.Row>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Наименование поля на кириллице'} error={getFieldError(FIELDS.cyrillicName)}>
              {getFieldDecorator(FIELDS.cyrillicName, {
                rules: rules[FIELDS.cyrillicName]('d'),
                initialValue: values?.[FIELDS.cyrillicName],
              })(<Ant.Input placeholder={'Наименование поля на кириллице'} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={'Наименование поля на латинице'} error={getFieldError(FIELDS.latinName)}>
              {getFieldDecorator(FIELDS.latinName, {
                rules: rules[FIELDS.latinName]('d'),
                initialValue: values?.[FIELDS.latinName],
              })(<Ant.Input placeholder={'Наименование поля на латинице'} allowClear={true} />)}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Сущность в системе VEZUBR'} error={getFieldError(FIELDS.entityName)}>
              {getFieldDecorator(FIELDS.entityName, {
                rules: rules[FIELDS.entityName]('d'),
                initialValue: values?.[FIELDS.entityName],
              })(
                <Ant.Select
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                  disabled={disabled}
                  searchPlaceholder={'Выберите сущность'}
                >
                  {entitiesOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>

          <VzForm.Col span={12}>
            <VzForm.Item label={'Тип поля'} error={getFieldError(FIELDS.type)}>
              {getFieldDecorator(FIELDS.type, {
                rules: rules[FIELDS.type]('d'),
                initialValue: values?.[FIELDS.type],
              })(
                <Ant.Select
                  allowClear={true}
                  showSearch={true}
                  optionFilterProp={'children'}
                  disabled={disabled}
                  searchPlaceholder={'Выберите тип'}
                >
                  {typesOptions}
                </Ant.Select>,
              )}
            </VzForm.Item>
          </VzForm.Col>
          <VzForm.Col span={12}>
            <VzForm.Item label={'Обязательное поле'} disabled={disabled} error={getFieldError(FIELDS.isRequired)}>
              {getFieldDecorator(FIELDS.isRequired, {
                initialValue: typeof values?.[FIELDS.isRequired] !== 'undefined' ? values?.[FIELDS.isRequired] : true,
              })(
                <VzForm.FieldSwitch
                  disabled={disabled}
                  style={{ padding: '6px 7px' }}
                  checkedTitle={'Да'}
                  unCheckedTitle={'Нет'}
                  colorChecked={false}
                  checked={getFieldValue(FIELDS.isRequired) || false}
                />,
              )}
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
      </VzForm.Group>

      {getFieldValue(FIELDS.type) === 'multiple' ? (
        <VzForm.Group title={'Значения для выбора'}>
          <div className="flexbox justify-right margin-bottom-8">
            <Ant.Button type="primary" onClick={() => setEditorModalVisible(true)}>
              Добавить значение
            </Ant.Button>
          </div>
          <Ant.Table
            {...{
              dataSource: possibleValues,
              columns: possibleValuesColumns,
              rowKey: 'id',
              width,
              scroll: { x: width, y: 450 },
              pagination: false,
            }}
          />
          <PossibleValuesModal
            editorModalVisible={editorModalVisible}
            setEditorModalVisible={setEditorModalVisible}
            onSave={handleSaveRecord}
          />
        </VzForm.Group>
      ) : null}

      <VzForm.Actions className={'settings-form__actions'}>
        <Ant.Button className={'margin-right-16'} onClick={() => history.goBack()}>
          Отмена
        </Ant.Button>
        <Ant.Button type="primary" onClick={(e) => handleSave(e)}>
          Сохранить
        </Ant.Button>
      </VzForm.Actions>
    </Ant.Form>
  );
}

CustomPropsForm.propTypes = {
  dictionaries: PropTypes.object,
  values: PropTypes.object,
  form: PropTypes.object,
  onSave: PropTypes.func,
  disabled: PropTypes.bool,
  onPasswordChange: PropTypes.func,
  canChangePassword: PropTypes.bool
};

export default Ant.Form.create({})(CustomPropsForm);