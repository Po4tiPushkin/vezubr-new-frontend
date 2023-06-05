import compose from "@vezubr/common/hoc/compose";
import withRouteStore from "./hoc/withRouteStore";
import {observer} from "mobx-react";
import React, {useCallback, useEffect} from "react";
import {Ant, VzForm, WhiteBox} from "@vezubr/elements";
import {TariffTableConfigProps} from "@vezubr/tariff/form-components/tarif-table";
import PropTypes from "prop-types";
import RouteTable from "./routeTable";

function RouteForm(props) {
  const {
    store,
    onSave,
    onCancel,
    cargoPlaces,
  } = props;

  const veeroutePlanTypesOptions = React.useMemo(() => {
    return Object.values(store.veeroutePlanTypes).map((veeroutePlanType) => {
      const value = veeroutePlanType.id;
      const key = veeroutePlanType.id;
      const title = veeroutePlanType.title;
      return (
        <Ant.Select.Option key={key} value={value}>
          {title}
        </Ant.Select.Option>
      );
    });
  }, [store]);

  const formUpdateConfiguration = useCallback(() => {
    return (
      <VzForm.Item
        label={'Выберите алгоритм маршрутизации'}
        error={store.getError('configuration')}
      >
        <Ant.Select
          showSearch={true}
          value={store.configuration}
          onChange={configurationUpdate}
        >
          {veeroutePlanTypesOptions}
        </Ant.Select>
      </VzForm.Item>
    )
  }, []);

  const configurationUpdate = (value) => {
    store.setConfiguration(value);
  }

  useEffect(() => {
    store.setCargoPlaceIds(cargoPlaces.map(item => String(item.id)));
  }, []);

  const handleSave = useCallback(
    (e) => {
      e.preventDefault();
      if (props.onSave) {
        props.onSave(store);
      }
    },
    [onSave],
  );

  return (
    <>
      <WhiteBox.Header
        type={"h2"}
        hr={false}
      >
        Отправить на маршрутизацию:
      </WhiteBox.Header>

      <div className={"margin-top-20"}>
        {formUpdateConfiguration()}
      </div>

      <div className={"margin-top-20"}>
        <RouteTable />
      </div>

      <VzForm.Actions>
        <Ant.Button onClick={onCancel} className={'semi-wide margin-left-16'} theme={'primary'}>
          Отмена
        </Ant.Button>
        <Ant.Button type="primary" onClick={handleSave} className={'semi-wide margin-left-16'}>
          Отправить
        </Ant.Button>
      </VzForm.Actions>
    </>
  );
}

RouteForm.propTypes = {
  tableConfig: TariffTableConfigProps,
  saving: PropTypes.bool,
  deleting: PropTypes.bool,
  canceling: PropTypes.bool,
  loading: PropTypes.bool,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
  onDelete: PropTypes.func,
  cargoPlaces: PropTypes.arrayOf(PropTypes.object),
  store: PropTypes.object,
  dictionaries: PropTypes.object,
};

export default compose([withRouteStore, observer])(RouteForm);