import React, { useCallback, useMemo, useState } from 'react';
import { Ant, Loader } from '@vezubr/elements';
const LoaderChooseAddress = (props) => {
  const { addresses = [], onSave, loading } = props;
  const [value, setValue] = useState(null);
  const onChoose = useCallback(() => {
    if (onSave) {
      onSave([(addresses || []).find(el => el.id === +value)])
    }
  }, [value]);

  const options = useMemo(() => {
    return (addresses || []).map(el => (
      <Ant.Radio className='margin-bottom-15' value={el.id}>
        {`${el.id} / ${el.addressString}`}
      </Ant.Radio>
    ))
  }, [addresses])

  if (loading) {
    return (
      <Loader />
    )
  }
  return (
    <div className=''>
      <Ant.Radio.Group onChange={(e) => setValue(e.target.value)} name={'chooseAddress'}>
        {options}
      </Ant.Radio.Group>
      <div className='flexbox' style={{ 'justifyContent': 'right' }}>
        <Ant.Button type='primary' disabled={!value} onClick={() => onChoose()} >Выбрать адрес</Ant.Button>
      </div>
    </div>
  )
}

export default LoaderChooseAddress;