import React, { useState, useEffect, useMemo } from 'react';
import { Ant } from '@vezubr/elements/';
import { IconDeprecated } from '@vezubr/elements';
const TractorsList = (props) => {
  const { onSelect, tractors = [], onClose } = props;
  const [filteredList, setFilteredList] = useState(tractors);
  const [search, setSearch] = useState('');
  const [id, setId] = useState(Date.now());
  useEffect(() => {

    const id = `df_${Date.now()}`;
    setId(id);
    document.body.addEventListener('click', (e) => {
      const item = document.getElementById(id);
      //!e.target.parentNode.classList.contains(isTimePicker ? "timePicker" : 'vz-dd')
      if (item && !item.contains(e.target)) {
        onClose();
      }
    });

    if (!search) {
      setFilteredList(tractors);
    }
    else {
      const newList = tractors.filter( value => {
        return (
          value?.plateNumber.toLowerCase().includes(search.toLowerCase()) ||
          value?.markAndModel.toLowerCase().includes(search.toLowerCase())
        )
      })
      setFilteredList(newList);
    }

  }, [search]);

  const renderTractors = useMemo(() => {
    const tractorsElement = filteredList.map((tractor, key) => {
      return (
        <div className={'element'} key={key} onClick={() => onSelect(tractor)}>
          <div className={'flexbox column driver-info'}>
            <div className={'bold driver-name'}>
              {tractor.plateNumber}
            </div>
            <div>
              {tractor.markAndModel}
            </div>
            <span className='text-small'>
              {tractor.vehicleTypeTitle}
            </span>
          </div>
        </div>
      );
    })
    return <div className={'drivers-elements'}>{tractorsElement}</div>
  }, [filteredList])

  return (
    <div className="drivers-filter" id={id}>
      <Ant.Input
        placeholder={'Поиск по всем полуприцепам'}
        className={'margin-left-8 drivers-filter__search'}
        suffix={<IconDeprecated name={'searchBlue'} />}
        onChange={(e) => setSearch(e.target.value)} 
      />
      {renderTractors}
    </div>
  )
}

export default TractorsList;