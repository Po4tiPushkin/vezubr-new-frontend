import React, { useMemo, useState, useEffect, useRef } from "react";
import validateAddressItem from '../../../../../validators/validateAddressItem'
import OrderSkipAddress from '../orderSkipAddress';
import { SkipAddressContext } from "../../context";
import { Documents as DocumentsService, Orders as OrderService } from '@vezubr/services';
import { Ant, VzForm, showError, showConfirm, Modal } from '@vezubr/elements';
import OrderFormFieldAddresses from '../../../../../components/order-form-field-addresses'
const disabledLoadingTypes = [2, 3];

const OrderGeneralAddress = (props) => {

  const { order, dictionaries, cargoPlace, reload } = props;

  const [showModal, setShowModal] = useState(false);
  const [addressesChanges, setAddressesChanges] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [skipAddress, setSkipAddress] = useState({});
  const positionsAddressesRef = useRef();

  useEffect(() => {

    if (order?.points) {
      setAddresses(
        order.points.map(item => {
          return {
            ...item,
            _position: item?.position,
            _startPosition: item?.position,
          }
        })
      )
    }

  }, [order]);

  const getExtraClassAddressItemFn = (address) => {
    return (address?.skipped || address?.completedAt) ? 'vz-address-modern-item--disabled' : '';
  };

  const canMoveAddress = (address) => {
    return address?.canChangePosition;
  };

  const canChangeAddress = () => {
    return false;
  };
  
  const savePositionAddresses = (addressesList)  => {
    let countChangesAddresses = 0;
    const positionsAddresses = addressesList.map((address, index) => {
      return {
        position: address?._startPosition,
        newPosition: index + 1,
      };
    });
    const newAddresses = addressesList.map((address, index) => {
      return {
        ...address,
        _position: index + 1,
      };
    });
    for (let i = 0; i < positionsAddresses.length; i++) {
      if (positionsAddresses[i].position !== positionsAddresses[i].newPosition) {
        countChangesAddresses++;
      }
    }

    positionsAddressesRef.current = positionsAddresses;
    if (countChangesAddresses > 0) {
      setAddressesChanges(true);
      setAddresses(newAddresses);
    } else {
      setAddressesChanges(false);
      setAddresses(newAddresses);
    }
  }

  const sendPositionAddresses = async() => {
    const data = {
      id: order?.id,
      points: positionsAddressesRef?.current,
    };
    const addressesList = addresses.map((address) => {
      return {
        ...address,
        _startPosition: address._position,
      };
    });
    try {
      await OrderService.updatePointsPositions(data);
      setAddressesChanges(false);
      setAddresses(addressesList);
      reload();
    } catch (error) {
      console.error(error);
    }
  }

  const onSkipAddress = ({ startPosition, position }) => {
    showConfirm({
      title: 'Вы уверены?',
      content: 'Адрес в маршруте восстановить невозможно. Вы действительно хотите пропустить посещение адреса?',
      okText: 'Пропустить',
      okType: 'danger',
      cancelText: 'Отмена',
      onOk: async () => {
        await handleSkipAddress({ startPosition, position });
      },
      onCancel() {
        handleCancelModal();
      },
    })
    setShowModal(true)
  };

  const handleSkipAddress = React.useCallback(async({ startPosition, position }) => {

    const addressesNew = [...addresses];
    addressesNew[position - 1].canChangePosition = false;
    addressesNew[position - 1].skipped = true;

    try {
      await OrderService.skipAddress({
        id: order?.id,
        pointNumber: startPosition,
      });
      setAddresses(addressesNew);
      reload();
    } catch (e) {
      showError(e);
    }
  }, [reload, addresses])

  const handleCancelModal = () => {
    setShowModal(false);
  }

  const renderAddresses = addresses && (
    <SkipAddressContext.Provider value={{ onSkipAddress: onSkipAddress, cargoPlace, order }}>
    <div className={'order-view__addresses-form'}>
      <VzForm.Col span={24}>
        <OrderFormFieldAddresses
          onChange={(e) => savePositionAddresses(e)}
          useMap={true}
          useFavorite={false}
          name={'addresses'}
          disabled={false}
          max={addresses.length}
          canMovePredicateFn={canMoveAddress}
          canChangePredicateFn={canChangeAddress}
          getExtraClassAddressItemFn={getExtraClassAddressItemFn}
          addresses={addresses}
          validatorAddressItem={validateAddressItem}
          loadingTypes={dictionaries?.loadingTypes}
          disabledLoadingTypes={disabledLoadingTypes}
          extraFieldComponent={OrderSkipAddress}
          viewRoute={false}
          polyLine={
            order?.map?.preliminaryPolyline ?
              { value: order?.map?.preliminaryPolyline, encoder: order?.map?.preliminaryEncoder }
              :
              null
          }
        />
      </VzForm.Col>
      {addressesChanges && (
        <Ant.Button className={'order-view__button'} type={'primary'} onClick={() => sendPositionAddresses()}>
          Сохранить
        </Ant.Button>
      )}
    </div>
    </SkipAddressContext.Provider>
  );

  return (
    <>
      {renderAddresses}
    </>
  )
}

export default OrderGeneralAddress;