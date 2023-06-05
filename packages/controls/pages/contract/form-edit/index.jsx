import React from 'react';
import Form from '../../../forms/contract-form';
import Margin from '../margin';
import { Route, Switch } from 'react-router';
import { NavLink } from 'react-router-dom';
import AdditionalInfo from '../additionalInfo';
import Agreements from '../agreements';
import Tabs from '../../../tabs';
import { createRouteWithParams, ROUTE_PARAMS, ROUTES } from '../../../infrastructure';
const ROUTE_CONTRACT_EDIT_AGREEMENTS = createRouteWithParams(ROUTES.CONTRACT_EDIT, { [ROUTE_PARAMS.paramOptions]: 'agreements' });
const ROUTE_CONTRACT_EDIT_ADDITIONAL = createRouteWithParams(ROUTES.CONTRACT_EDIT, { [ROUTE_PARAMS.paramOptions]: 'additional' });
const ROUTE_CONTRACT_EDIT_MARGIN = createRouteWithParams(ROUTES.CONTRACT_EDIT, { [ROUTE_PARAMS.paramOptions]: 'margin' });

const getTabs = (id) => {
  const props = {
    params: { [ROUTE_PARAMS.paramId]: id },
  };

  return {
    attrs: {
      className: 'contract-tabs',
    },
    items: [
      {
        title: 'Основное',
        route: ROUTES.CONTRACT_EDIT,
        ...props,
      },
      {
        title: 'ДУ тарификации',
        route: ROUTE_CONTRACT_EDIT_AGREEMENTS,
        ...props,
      },
      {
        title: 'Дополнительное',
        route: ROUTE_CONTRACT_EDIT_ADDITIONAL,
        ...props,
      },
      {
        title: 'Маржинальность',
        route: ROUTE_CONTRACT_EDIT_MARGIN,
        show: APP === 'dispatcher',
        ...props,
      },

    ],
  };
};

const ContractForm = (props) => {
  const { location, match, type, disabled, role, notActive = false } = props;

  return (
    <>
      <div className={'contract-page__tabs'}>
        <Tabs {...getTabs(match.params.id)} adaptForMobile={390} menuOpts={{ dropDownPosition: 'rightCenter' }} />
      </div>
      <Switch>
        <Route path={`/contract/:${match.params.id}/edit/margin`}>
          <Margin {...props} />
        </Route>
        <Route path={`/contract/:${match.params.id}/edit/additional`}>
          <AdditionalInfo {...props} />
        </Route>
        <Route path={`/contract/:${match.params.id}/edit`}>
          <Form {...props} />
        </Route>
      </Switch>
    </>
  );
};

export default ContractForm;
