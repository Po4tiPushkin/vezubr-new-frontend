import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Ant, VzForm } from '@vezubr/elements';
import './styles.scss';
const ResponsibleEmployees = (props) => {

  const { 
    onSave, 
    data = [], 
    values = {}, 
    hasCommentField = false, 
    titleText = 'Ответственный Пользователь', 
    onChange, 
    isForm = false, 
    edit = true,
    align = null,
    colSpan = 12,
    groupTitle = null,
    id,
    optionId
  } = props;
  const { Select, Form, Input } = Ant;
  const { Option } = Select;
  const { TextArea } = Input;
  const dictionaries = useSelector((state) => state.dictionaries);

  const [inputValues, setInputValues] = useState(values);
  const [showEdit, setShowEdit] = useState(false);

  const handleSave = useCallback((e) => {
    e.preventDefault();
    setShowEdit(false);
    if (onSave) {
      onSave(inputValues);
    }
    return;
  }, [inputValues]);

  const hanldeChange = useCallback((input) => {
    setInputValues(prev => {
      return {
        ...prev,
        ...input
      }
    });
    if (onChange) {
      onChange({ ...inputValues, ...input })
    }
  }, [inputValues]);

  useEffect(() => {
    setInputValues(values);
    if (!isForm && edit) {
      setShowEdit(true);
    };
  }, [values]);

  const employeeName = useCallback((employee) => {
    let rolesString = ' - ';
    if (Array.isArray(employee?.employeeRoles)) {
      employee?.employeeRoles.forEach((el, index) => {
        rolesString += dictionaries?.employeeRoles?.find(item => item?.id === el)?.title + (index + 1 !== employee.employeeRoles.length ? `, ` : '');
      })
    }

    return `${employee?.fullName}${rolesString}`
  }, [dictionaries, data]);

  const filterValues = useCallback((inputValue, option) => {
    const { value } = option?.props;
    if (!value || !inputValue) {
      return true;
    }
    const employee = data.find(el => el.id === value);
    if (!employee) {
      return true
    }
    const { fullName } = employee;
    if (fullName.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase())) {
      return true;
    }
    return false;
  }, [data]);

  return (
    <Form className='responsible-employees' layout={"vertical"} onSubmit={handleSave}>
      <VzForm.Group title={groupTitle}>
        <VzForm.Row>
          <VzForm.Col span={colSpan}>
            <div className="responsible-employees__select-label">{titleText}</div>
            <VzForm.Item className={"responsible-employees__select"} disabled={!showEdit}>
              <Select
                disabled={!showEdit}
                mode={'multiple'}
                id={id}
                placeholder={'Выберите пользователя'}
                value={inputValues?.responsibleEmployees}
                filterOption={(inputValue, option) => filterValues(inputValue, option)}
                onChange={(e) => { const input = {}; input.responsibleEmployees = e; hanldeChange(input) }}
              >
                {data && data.map(el => { return <Option id={`${optionId}-${el.id}`} key={el.id} value={el.id}>{employeeName(el)}</Option> })}
              </Select>
            </VzForm.Item>
          </VzForm.Col>
        </VzForm.Row>
        {
          hasCommentField && (
            <VzForm.Row style={{ 'marginTop': '30px' }}>
              <div className="responsible-employees__select-label">Комментарий</div>
              <VzForm.Item disabled={!showEdit}>
                <TextArea disabled={!showEdit} placeholder={'Комментарий'} value={inputValues?.comment} onChange={e => { const input = {}; input.comment = e.target.value; hanldeChange(input) }} rows={4} />
              </VzForm.Item>
            </VzForm.Row>
          )
        }
        {
          isForm && (
            <VzForm.Actions align={align}>
              {showEdit
                ?
                <>
                  <Ant.Button onClick={() => { setInputValues(values); setShowEdit(false) }} type={'dashed'}>
                    Отмена
                  </Ant.Button>
                  <Ant.Button onClick={handleSave} type={'primary'}>
                    Сохранить
                  </Ant.Button>
                </>
                :
                <>
                  <Ant.Button onClick={() => setShowEdit(true)} type={'primary'}>
                    Редактировать
                  </Ant.Button>
                </>
              }
            </VzForm.Actions>
          )
        }
      </VzForm.Group>
    </Form>
  )
}

export default ResponsibleEmployees;