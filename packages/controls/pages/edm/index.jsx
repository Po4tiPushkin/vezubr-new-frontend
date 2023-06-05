import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { ROUTE_PARAMS } from '../../infrastructure';
import { Orders as OrderService } from '@vezubr/services';
import { EdmMap, EdmInfo } from './components';
import { showError, Ant, showAlert } from '@vezubr/elements';
import Form from './components/cargoPlaceAccept/form'
import './styles.scss';

const cargoTempData = [
  {
    title: 'Грузоместо 1',
    id: 0,
  },
  {
    title: 'Грузоместо 2',
    id: 1,
  },
  {
    title: 'Грузоместо 3',
    id: 2,
  },
  {
    title: 'Грузоместо 4',
    id: 3,
  }
]

const EdmView = (props) => {
  const { location, history, match } = props;

  const [order, setOrder] = useState(null)
  const [mapFull, setMapFull] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const orderId = useMemo(() => match.params[ROUTE_PARAMS.paramId], [match]);
  const fetchOrder = useCallback(async () => {
    try {
      const response = await OrderService.detailsShort(orderId);
      const orderData = { ...response, ...response.transportOrder };
      setOrder(orderData);
      setMapFull(false);
    } catch (e) {
      console.error(e);
      showError(e)
    }
  }, [orderId]);

  useEffect(() => {
    fetchOrder();
  }, [])

  const signEdm = useCallback((selectedCargos) => {
    showAlert(`выбранные грузоместа ${selectedCargos}`);
    setOpenForm(false);
  }, [])

  return (
    <div className="edm">
      <div className="edm__header">
        <span className="edm__header-icon">

        </span>
        <span className='edm__header-title'>vezubr</span>
      </div>
      <div className='edm__body'>
        {order && (
          <div className='edm__main'>
            {openForm ? <Form signEdm={signEdm} cargoPlaces={cargoTempData} /> :
              <>
                <EdmMap setMapFull={setMapFull} order={order} />
                <div className='edm__wrapper' style={{ 'zIndex': mapFull ? '0' : '500' }}>
                  <EdmInfo order={order} />
                  <Ant.Button onClick={() => setOpenForm(true)} className='edm__cargo-button'>
                    Сдать/Принять груз
                  </Ant.Button>
                </div>
              </>
            }
          </div>
        )}
      </div>
    </div>

  )
}

export default EdmView