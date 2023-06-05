import { Ant } from '@vezubr/elements';
import PropTypes from 'prop-types';
import React from 'react';
import Approve from './approve';

function ApproveList(props) {
  const { record, contractorId, clientId, onUpdated, countersHash, contoursApprove } = props;

  const cellNodeRef = React.useRef(null);

  const getPopupContainer = React.useCallback(() => {
    return cellNodeRef.current || document.body;
  }, [cellNodeRef.current]);

  const getContourName = (contourId) => countersHash?.[contourId]?.title || 'Имя контура';

  const submenuNeeded = React.useMemo(() => record.switchAllowed || [2, 4].includes(record?.contours?.[0]?.status), [
    record,
  ]);

  const renderDropDownMenuItems = (contoursFiltered) => {
    const dropDownItems = [];

    for (const contour of contoursFiltered) {
      const { status, contour: contourId } = contour;

      const contourTitle = getContourName(contourId);

      dropDownItems.push(
        status === 1 ? (
          <Ant.Menu.Item key={contourId}>
            <Approve
              textButton={contourTitle}
              icon={'check'}
              contourId={contourId}
              contractorId={contractorId}
              clientId={clientId}
              onUpdated={onUpdated}
              type={'link'}
            />
          </Ant.Menu.Item>
        ) : null,
      );
    }

    return dropDownItems;
  };

  const renderDropdown = React.useMemo(() => {
    if (submenuNeeded) {
      return (
        <Ant.Menu.SubMenu
          title={
            <Ant.Button size={'small'} type={'primary'}>
              Принять в <Ant.Icon type="down" />
            </Ant.Button>
          }
        >
          {renderDropDownMenuItems(contoursApprove)}
        </Ant.Menu.SubMenu>
      );
    } else {
      return (
        <Ant.Dropdown
          getPopupContainer={getPopupContainer}
          overlay={<Ant.Menu>{renderDropDownMenuItems(contoursApprove)}</Ant.Menu>}
        >
          <Ant.Button size={'small'} type={'primary'}>
            Принять в <Ant.Icon type="down" />
          </Ant.Button>
        </Ant.Dropdown>
      );
    }
  }, [submenuNeeded]);

  return (
    <div className="actions-set-approve-tariff" ref={cellNodeRef}>
      {contoursApprove.length > 1 && renderDropdown()}

      {contoursApprove.length === 1 && (
        <Approve
          textButton="Принять"
          icon={'check'}
          contourId={contoursApprove[0].contour}
          contractorId={contractorId}
          onUpdated={onUpdated}
          title={`Принять в контур «${getContourName(contoursApprove[0].contour)}»`}
          type={'primary'}
        />
      )}
    </div>
  );
}

ApproveList.propTypes = {
  contours: PropTypes.arrayOf(PropTypes.object),
  tariffList: PropTypes.arrayOf(PropTypes.object),
  contractorId: PropTypes.number,
  clientId: PropTypes.number,
  onUpdated: PropTypes.func,
  tariffsDynamicIds: PropTypes.arrayOf(PropTypes.number),
  countersHash: PropTypes.object,
  dictionaries: PropTypes.object,
};

export default ApproveList;
