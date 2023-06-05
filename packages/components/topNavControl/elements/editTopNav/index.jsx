import React, { useMemo, useState, useCallback } from 'react';
import { Ant, VzForm } from '@vezubr/elements';
import t from '@vezubr/common/localization';

const maxOptions = APP === 'producer' ? 5 : 4;

const EditTopNav = (props) => {
  const { list = [], oldTopNav = [], changeTopNav } = props;

  const [selectedOptions, setSelectedOptions] = useState(oldTopNav.filter(el => el !== 'newOrder'));

  const options = useMemo(() => {
    return list.map((el, index) => {
      return <Ant.Select.Option disabled={selectedOptions.length === maxOptions && !selectedOptions.find(item => el === item)} key={index} value={el}>{t.nav(el)}</Ant.Select.Option>
    })
  }, [list, selectedOptions]);

  const onChange = useCallback((e = []) => {
    let sorted = [];
    list.forEach(el => {
      if (e.includes(el)) {
        sorted.push(el)
      }
    })
    setSelectedOptions(sorted);
    if (changeTopNav) {
      changeTopNav(sorted);
    }
  }, []);

  return (
    <div className="topNavControl__select-wrapper">
      <VzForm.Item label={"Редактирование верхнего меню"}>
        <Ant.Select
          mode="multiple"
          onChange={onChange}
          placeholder={''}
          value={selectedOptions}
          className={"topNavControl__select"}
        >
          {options}
        </Ant.Select>
      </VzForm.Item>
    </div>
  )
}

export default EditTopNav;