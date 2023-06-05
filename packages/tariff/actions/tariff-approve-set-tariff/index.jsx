import React from 'react';
import TariffSetTariffButton from '../tariffSetTariffButton';
import { Ant } from '@vezubr/elements';
import PropTypes from 'prop-types';
import { CONTOUR_MAIN_ID } from '@vezubr/common/constants/contour';

function TariffApproveSetTariff(props) {
  const {
    contours,
    producerId,
    clientId,
    onUpdated,
    tariffsDynamicIds,
    countersHash,
    approveComponent,
    dictionaries,
    tariffList,
  } = props;

  const cellNodeRef = React.useRef(null);

  const ApproveComponent = approveComponent;

  const getPopupContainer = React.useCallback(() => {
    return cellNodeRef.current || document.body;
  }, [cellNodeRef.current]);

  const getContourName = (contourId) => countersHash?.[contourId]?.title || 'Имя контура';

  const { contoursTariff, contoursApprove } = React.useMemo(() => {
    let contoursTariff = [];
    let contoursApprove = [];
    for (const contour of contours) {
      const { status, contour: id } = contour;

      if (!countersHash?.[id] || id === CONTOUR_MAIN_ID) {
        continue;
      }

      if (status === 1) {
        contoursApprove.push(contour);
      } else if (status === 2) {
        // contoursTariff.push(contour);
      }
    }

    return {
      contoursTariff,
      contoursApprove,
    };
  }, [contours]);


  const renderDropDownMenuItems = (contoursFiltered) => {
    const dropDownItems = [];

    for (const contour of contoursFiltered) {
      const { status, contour: id } = contour;

      const contourTitle = getContourName(id);

      dropDownItems.push(
        status === 1 ? (
          <Ant.Menu.Item key={id}>
            <ApproveComponent
              textButton={contourTitle}
              icon={'check'}
              contourId={id}
              producerId={producerId}
              clientId={clientId}
              onUpdated={onUpdated}
              type={'link'}
            />
          </Ant.Menu.Item>
        ) : (
          <Ant.Menu.Item key={id}>
            <TariffSetTariffButton
              key={id}
              tariffList={tariffList}
              dictionaries={dictionaries}
              textButton={contourTitle}
              icon={'edit'}
              titleModal={`Назначить тариф в контуре «${contourTitle}»`}
              tariffs={tariffsDynamicIds}
              contourId={id}
              producerId={producerId}
              clientId={clientId}
              onUpdated={onUpdated}
              type={'link'}
            />
          </Ant.Menu.Item>
        ),
      );
    }

    return dropDownItems;
  };

  return (
    <div className="actions-set-approve-tariff" ref={cellNodeRef}>
      {contoursApprove.length > 1 && (
        <Ant.Dropdown
          getPopupContainer={getPopupContainer}
          overlay={<Ant.Menu>{renderDropDownMenuItems(contoursApprove)}</Ant.Menu>}
        >
          <Ant.Button size={'small'} type={'primary'}>
            Принять в <Ant.Icon type="down" />
          </Ant.Button>
        </Ant.Dropdown>
      )}

      {contoursApprove.length === 1 && (
        <ApproveComponent
          textButton="Принять"
          icon={'check'}
          contourId={contoursApprove[0].contour}
          clientId={clientId}
          producerId={producerId}
          onUpdated={onUpdated}
          title={`Принять в контур «${getContourName(contoursApprove[0].contour)}»`}
          type={'primary'}
        />
      )}

      {contoursTariff.length > 1 && (
        <Ant.Dropdown
          getPopupContainer={getPopupContainer}
          overlay={<Ant.Menu>{renderDropDownMenuItems(contoursTariff)}</Ant.Menu>}
        >
          <Ant.Button size={'small'}>
            Тариф <Ant.Icon type="down" />
          </Ant.Button>
        </Ant.Dropdown>
      )}

      {contoursTariff.length === 1 && (
        <TariffSetTariffButton
          key={contoursTariff[0].contour}
          dictionaries={dictionaries}
          textButton={'Тариф'}
          icon={'edit'}
          titleModal={`Назначить тариф в контуре «${getContourName(contoursTariff[0].contour)}»`}
          tariffs={tariffsDynamicIds}
          contourId={contoursTariff[0].contour}
          producerId={producerId}
          clientId={clientId}
          onUpdated={onUpdated}
          type={'default'}
        />
      )}
    </div>
  );
}

TariffApproveSetTariff.propTypes = {
  approveComponent: PropTypes.elementType,
  contours: PropTypes.arrayOf(PropTypes.object).isRequired,
  tariffList: PropTypes.arrayOf(PropTypes.object),
  producerId: PropTypes.number.isRequired,
  clientId: PropTypes.number.isRequired,
  onUpdated: PropTypes.func,
  tariffsDynamicIds: PropTypes.arrayOf(PropTypes.number),
  countersHash: PropTypes.object.isRequired,
  dictionaries: PropTypes.object.isRequired,
};

export default TariffApproveSetTariff;
