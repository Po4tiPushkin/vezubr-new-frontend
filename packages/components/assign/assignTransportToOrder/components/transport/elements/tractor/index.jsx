import React, { useMemo } from 'react';
import TractorsList from '../../lists/tractorsList';
import cn from 'classnames';
import { ButtonDeprecated, IconDeprecated } from '@vezubr/elements';
const Tractor = (props) => {
  const { tractors, data, showTractorsList, onTractorSelect, toggleTractorsList, tractor } = props;

  const renderTractorElement = useMemo(() => {
    const availibility = data?.availability;
    const isAvailableForTractor = data?.vehicleData?.vehicleConstructionType == 2;
    const filtredTractors = tractors?.filter((el) => {
      if (!el.tractorPlateNumber || el.tractorPlateNumber === plateNumber) {
        return el
      }
    })
    return (
      <div style={{ width: 250 }} className={'flexbox center empty-driver' + (!isAvailableForTractor ? ' no-tractor' : '')}>
        {isAvailableForTractor && <div className={cn('flexbox margin-left-10 flex-1 column')} style={{ width: '100%' }}>
          <span className={'flexbox narrow grey'}>
            {tractor?.id ? `${tractor?.plateNumber}` : 'Тягач'}
          </span>
          <span className='text-small'>
            {tractor?.id ? `${tractor?.vehicleTypeTitle}` : ''}
          </span>
        </div>}
        {(availibility !== 2 && isAvailableForTractor) ? (
          <span className={'flexbox'} onClick={() => toggleTractorsList()}>
            <IconDeprecated name={'chevronDownBlue'} />
          </span>
        ) : null}
        {showTractorsList ? (
          <TractorsList
            onSelect={onTractorSelect}
            onClose={() => toggleTractorsList()}
            tractors={filtredTractors}
          />
        ) : null}
      </div>
    );
  }, [data, tractors, tractor, showTractorsList])

  const renderTractors = useMemo(() => {
    return (
      <>
        {tractors ?
          <>
            {renderTractorElement}
          </>
          : null
        }
      </>
    );
  }, [data, tractors, showTractorsList, renderTractorElement]);
  return (
    <>
      {tractors && renderTractors}
    </>
  )
};

export default Tractor;