import React, { useMemo, useState, useCallback } from "react";
import { Ant, showConfirm } from '@vezubr/elements'

const EdmCargoPlaceAcceptForm = (props) => {
  const { cargoPlaces = [], signEdm } = props;
  const [selectedCargos, setSelectedCargos] = useState([]);
  const options = useMemo(() => cargoPlaces.map(el => { return { label: el.title, value: el.id } }), [cargoPlaces])
  const onConfirm = useCallback(() => {
    showConfirm({
      content: 'Подтвердить действие',
      onCancel: () => {
        return;
      },
      cancelText: 'Отмена',
      onOk: () => {
        signEdm(selectedCargos)
      }
    })
  }, [selectedCargos])
  return (
    <div className="edm__form">
      <div className="edm__info-title">Подтвердить грузоместа</div>
      <Ant.Checkbox.Group options={options} onChange={(e) => setSelectedCargos(e)} />
      <Ant.Button onClick={() => onConfirm()} className='edm__cargo-button'>
        Подписать документ
      </Ant.Button>
    </div>
  )
}

export default EdmCargoPlaceAcceptForm;