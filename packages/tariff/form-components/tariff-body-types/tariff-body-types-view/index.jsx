import React from 'react';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import { Icons } from '@vezubr/elements';

function TariffBodyTypesView(props) {
  const { vehicle } = props;

  return (
    <div className={'tariff-body-types-view'}>
      {vehicle.bodyTypesList.map(({ title, id }) => (
        <Icons.Truck.BodyTypeIcon key={id} bodyTypeId={id} title={title} />
      ))}
    </div>
  );
}

TariffBodyTypesView.propTypes = {
  vehicle: PropTypes.object.isRequired,
};

export default observer(TariffBodyTypesView);
