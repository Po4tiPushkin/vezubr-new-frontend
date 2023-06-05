import { Ant, VzForm } from '@vezubr/elements';
import PropTypes from 'prop-types';
import React from 'react';

function PossibleValuesModal(props) {
  const { editorModalVisible, setEditorModalVisible, onSave } = props;
  const [editorId, setEditorId] = React.useState(editorModalVisible.id)
  const [editorTitle, setEditorTitle] = React.useState(editorModalVisible.title)

  React.useEffect(() => {
    if (typeof editorModalVisible === 'object') {
      setEditorId(editorModalVisible.id)
      setEditorTitle(editorModalVisible.title)
    } else {
      setEditorId('')
      setEditorTitle('')
    }
  }, [editorModalVisible])

  const handleSaveRecord = React.useCallback(() => {
    if (onSave) {
      try {
        onSave(editorId, editorTitle)
        setEditorId('')
        setEditorTitle('')
      } catch (e) {
        Ant.message.error(e.message)
      }
    }
  }, [onSave, editorId, editorTitle])
  return (
    <Ant.Modal
      visible={!!editorModalVisible}
      title={'Создание поля'}
      width={600}
      bodyNoPadding={true}
      centered={false}
      destroyOnClose={true}
      className={'custom-props-form__modal'}
      onCancel={() => setEditorModalVisible(false)}
      footer={null}
    >
      <VzForm.Row>
        <VzForm.Col span={12}>
          <VzForm.Item label={'Уникальный номер значения'} disabled={editorModalVisible.id}>
            <Ant.Input
              placeholder={'Уникальный номер значения'}
              allowClear={true}
              disabled={!!editorModalVisible.id}
              onChange={(e) => setEditorId(e.target.value)}
              value={editorId}
            />
          </VzForm.Item>
        </VzForm.Col>
        <VzForm.Col span={12}>
          <VzForm.Item label={'Наименование значения'}>
            <Ant.Input
              placeholder={'Наименование значения'}
              allowClear={true}
              onChange={(e) => setEditorTitle(e.target.value)}
              value={editorTitle}
            />
          </VzForm.Item>
        </VzForm.Col>
      </VzForm.Row>
      <VzForm.Actions>
        <Ant.Button type="primary" onClick={handleSaveRecord}>
          Сохранить
        </Ant.Button>
      </VzForm.Actions>
    </Ant.Modal>
  );
}

PossibleValuesModal.propTypes = {
  dictionaries: PropTypes.object,
  values: PropTypes.object,
  form: PropTypes.object,
  onSave: PropTypes.func,
  disabled: PropTypes.bool,
  onPasswordChange: PropTypes.func,
  canChangePassword: PropTypes.bool,
};

export default Ant.Form.create({})(PossibleValuesModal);
