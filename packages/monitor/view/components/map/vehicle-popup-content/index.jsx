import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import * as Monitor from '../../../..';
import { useObserver } from 'mobx-react';
import { Ant } from '@vezubr/elements';
import { history } from '@vezubr/controls/infrastructure';
const { useVehicleInfo, useDriverNamePhoneInfo, useVehicleLastUpdatedInfo } = Monitor.AlteringData;

const { useGetNavWithBackByItem } = Monitor;

function Footer(props) {
  const { item: vehicle } = props;

  const footerList = {
    ...useVehicleLastUpdatedInfo(vehicle),
  };

  return <Monitor.Layout.AlteringList alteringData={footerList} />;
}

Footer.propTypes = {
  item: PropTypes.object,
};

function PopupVehicleContent(props) {
  const { item: vehicle } = props;

  const { plateNumber, markAndModel, driver } = useObserver(() => {
    const { plateNumber, driver, markAndModel } = vehicle.data;
    return { plateNumber, driver, markAndModel };
  });

  vehicle.data.vehicleType = vehicle.data.vehicleTypeId

  const bodyList = {
    ...useVehicleInfo(vehicle?.data),
    ...useDriverNamePhoneInfo(driver),
  };

  const viewAction = useGetNavWithBackByItem(useCallback((vehicle) => `/transports/${vehicle?.id}`, []), null, history);

  return (
    <Monitor.Layout.PopupInfo
      header={
        <Monitor.Element.Link item={vehicle} onAction={viewAction} suffix={<Ant.Icon type={'right'} />}>
          {plateNumber} {markAndModel}
        </Monitor.Element.Link>
      }
      body={<Monitor.Layout.AlteringList alteringData={bodyList} />}
      footer={<Footer {...props} />}
    />
  );
}

PopupVehicleContent.propTypes = {
  viewAction: PropTypes.func,
  item: PropTypes.object,
};

export default PopupVehicleContent;
