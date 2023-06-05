import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Profile as ProfileService,
  Contractor as ContractorService,
  Vehicle as VehicleService,
  Common as CommonServices,
  Insurers as InsurersService,
} from '@vezubr/services';
import { showError, showAlert, VzTable, Ant, VzForm } from '@vezubr/elements';
import useColumns from './hooks/useColumns';
import { connect } from 'react-redux';
import { Filters, TableFiltered } from '@vezubr/components/tableFiltered';
import useParams from '@vezubr/common/hooks/useParams';
import useFiltersActions from './hooks/useFilterActions';
import { filterData } from './components/filters';
import { useHistory } from 'react-router-dom';
import VehicleTypes from '../../../../lists/vehicle-types';
import cn from 'classnames';
import t from '@vezubr/common/localization';
import moment from 'moment';
import { Utils } from '@vezubr/common/common';
const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};
const MESSAGE_KEY = '__SettingsDeligateForClients__';

const getDefaultDelegationValue = (info) => {
  if (info.delegateManagement && !info.delegateManageDriverAndVehicle) {
    return 'yes';
  } else if (!info.delegateManagement && info.delegateManageDriverAndVehicle) {
    return 'partly';
  } else if (!info.delegateManagement && !info.delegateManageDriverAndVehicle) {
    return 'no';
  }
};

const DELEGATE_FOR_CLIENTS = [
  {
    key: 0,
    value: 'no',
    text: 'Нет',
  },
  {
    key: 1,
    value: 'partly',
    text: 'Делегировать только управление подбором ТС и водителей',
  },
  {
    key: 2,
    value: 'yes',
    text: 'Да, полное делегирование',
  },
];

const Settings = (props) => {
  const history = useHistory();
  const { location } = history;

  const { dictionaries, id, user, info } = props;

  const [data, setData] = useState([]);
  const [delegatedList, setdelegatedList] = useState([]);
  const [counterpartyVehicleTypes, setCounterpartyVehicleTypes] = React.useState([]);
  const [columns, width] = useColumns({ dictionaries });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [params, pushParams] = useParams({ history, location });
  const [filteredData, setFilteredData] = useState([]);
  const filtersActions = useFiltersActions();
  const [update, setUpdate] = useState(Date.now());
  const appIsDispatcher = APP == 'dispatcher';

  const [delegateManagement, setDelegateManagement] = React.useState(getDefaultDelegationValue(info));
  const [insurers, setInsurers] = useState([]);
  const [insurersContracts, setInsurersContracts] = useState([]);
  const [loadingContracts, setLoadingContracts] = useState(false);
  const [{ insurer, insurerContract }, setInsuranceInfo] = useState({
    insurer: info?.insurerContract?.insurer?.id || null,
    insurerContract: info?.insurerContract?.id || null,
  });

  const onChangeInsurer = React.useCallback((value) => {
    setInsuranceInfo({
      insurer: value || null,
      insurerContract: null,
    });
  }, []);

  React.useEffect(() => {
    setInsuranceInfo({
      insurer: info?.insurerContract?.insurer?.id || null,
      insurerContract: info?.insurerContract?.id || null,
    });
  }, [info]);

  const saveInsuranceInfo = React.useCallback(async () => {
    try {
      const data = {
        insurerContractId: insurerContract,
        customProperties: info?.customProperties
          ? info.customProperties.map((el) => {
              return {
                latinName: el?.customProperty?.latinName,
                values: el.values,
              };
            })
          : [],
        internalResponsibleEmployees: info?.internalResponsibleEmployees.map((el) => el.id),
        publicResponsibleEmployees: info?.publicResponsibleEmployees.map((el) => el.id),
        comment: info?.comment,
        publicComment: info?.publicComment,
      };
      await ProfileService.contractorEdit({ id, data });

      showAlert({
        title: '',
        content: insurerContract
          ? `Страховая компания и Договор страхования были успешно назначены для Контрагента ${info.fullName}`
          : `Для Контрагента ${info.fullName} успешно удалены Страховая компания и Договор Страхования`,
      });
      if (!insurerContract) {
        setInsuranceInfo({
          insurerContract,
          insurer: null
        })
      }
    } catch (e) {
      console.error(e);
      showError(e);
    }
    return;
  }, [insurer, insurerContract]);

  const rowSelection = useMemo(
    () => ({
      selectedRowKeys,
      onChange: (selectedRowKeys) => {
        setSelectedRowKeys(selectedRowKeys);
      },
      getCheckboxProps: (record) => ({
        disabled: false,
      }),
      selections: [
        {
          key: 'clear-all',
          text: 'Очистить',
          onSelect: () => {
            setSelectedRowKeys([]);
          },
        },
      ],
    }),
    [selectedRowKeys],
  );

  const changed = useMemo(() => {
    let ch = true;
    const prevDelegated = delegatedList.filter((el) => el.isDelegated !== false);
    if (prevDelegated.length) {
      prevDelegated.forEach((item) => {
        if (!selectedRowKeys.find((el) => el === item.id)) {
          ch = false;
          return;
        }
      });
    }
    if (ch) {
      ch = prevDelegated.length === selectedRowKeys.length;
    }
    return ch;
  }, [selectedRowKeys, delegatedList]);

  React.useEffect(() => {
    const fetchContracts = async () => {
      if (insurer) {
        try {
          setLoadingContracts(true);
          const insurerContracts = await InsurersService.contracts(insurer);
          setInsurersContracts(insurerContracts);
        } catch (e) {
          console.error(e);
          showError(e);
        } finally {
          setLoadingContracts(false);
        }
      }
    };
    fetchContracts();
  }, [insurer]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (appIsDispatcher) {
          const response = await Utils.fetchAllEmployees();
          const list = await ContractorService.delegatedList(id);
          const dataSource = response || [];
          setData(dataSource);

          setdelegatedList(list.employees || []);
          setSelectedRowKeys(list.employees.filter((el) => el.isDelegated === true).map((el) => el.id) || []);
          setFilteredData(dataSource);
        } else {
          const delegateResponse = await CommonServices.getConfigDeligate(id);
          setDelegateManagement(getDefaultDelegationValue(delegateResponse));
        }
      } catch (e) {
        if (e.data?.message) {
          showError(e.data?.message);
        } else if (e.code === 403) {
          showError('У вашего пользователя нет доступа к этому разделу');
        } else {
          showError(e);
        }
      }
    };
    const fetchInsurers = async () => {
      try {
        const insurersResp = await InsurersService.list();
        setInsurers(insurersResp);
      } catch (e) {
        showError(e);
      }
    };
    fetchData();
    fetchInsurers();
  }, [update]);

  useEffect(() => {
    if (data) {
      setFilteredData(filterData(data, params));
    }
  }, [params]);

  const getVehicleTypes = useCallback(async (paramsQuery) => {
    try {
      const counterpartyVehicleTypes = await VehicleService.counterpartyTypes(id, paramsQuery);
      if (counterpartyVehicleTypes.length <= 0) {
        showAlert({
          title: 'Нет доступных типов ТС для добавления',
        });
      }
      setCounterpartyVehicleTypes(counterpartyVehicleTypes);
    } catch (e) {
      console.error(e);
    }
  }, []);

  const onSave = async () => {
    try {
      let delegatedUpdated = selectedRowKeys.map((el) => {
        return { isDelegated: true, id: el };
      });
      const prevDelegated = delegatedList.filter((el) => el.isDelegated !== false);
      if (prevDelegated.length) {
        prevDelegated.forEach((item) => {
          if (!delegatedUpdated.find((el) => el.id === item.id)) {
            item.isDelegated = false;
            delegatedUpdated.push(item);
          } else {
            delegatedUpdated = delegatedUpdated.filter((el) => el.id !== item.id);
          }
        });
      }
      await ContractorService.delegatedUpdate(id, { employees: delegatedUpdated });
      showAlert({
        content: 'Изменения сохранены',
        onOk: setUpdate(Date.now()),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const onSaveDelegation = async () => {
    let delegationSettings = {};

    if (delegateManagement == 'yes') {
      delegationSettings.delegateManagement = true;
      delegationSettings.delegateManageDriverAndVehicle = false;
    } else if (delegateManagement == 'partly') {
      delegationSettings.delegateManagement = false;
      delegationSettings.delegateManageDriverAndVehicle = true;
    } else if (delegateManagement == 'no') {
      delegationSettings.delegateManagement = false;
      delegationSettings.delegateManageDriverAndVehicle = false;
    }

    const dataForSend = { ...delegationSettings };

    try {
      Ant.message.loading({
        content: 'Сохраняем',
        key: MESSAGE_KEY,
      });
      await CommonServices.setConfigDeligate(id, dataForSend);
      Ant.message.success({
        content: 'Данные обновлены',
        key: MESSAGE_KEY,
      });
    } catch (e) {
      console.error(e);
      showError(e);
    }
  };

  const delegateForClientsOptions = useMemo(
    () =>
      DELEGATE_FOR_CLIENTS.map((item) => (
        <Ant.Select.Option style={{ whiteSpace: 'normal' }} key={item.key} value={item.value}>
          {item.text}
        </Ant.Select.Option>
      )),
    [DELEGATE_FOR_CLIENTS],
  );

  return (
    <>
      <Ant.Collapse defaultActiveKey={'delegation'}>
        {info?.role == 2 ? (
          <Ant.Collapse.Panel header="Настройка страхования грузов заказчика">
            <VzForm.Row>
              <VzForm.Col span={12}>
                <VzForm.Item label="Страховая компания">
                  <Ant.Select value={insurer} onChange={onChangeInsurer}>
                    {insurers.map(({ id, title }) => (
                      <Ant.Select.Option key={id} value={id}>
                        {title}
                      </Ant.Select.Option>
                    ))}
                  </Ant.Select>
                </VzForm.Item>
              </VzForm.Col>
              <VzForm.Col span={12}>
                <VzForm.Item label="Страховой договор" disabled={!insurer}>
                  <Ant.Select
                    value={insurerContract}
                    disabled={!insurer}
                    allowClear
                    loading={loadingContracts}
                    onChange={(value) =>
                      setInsuranceInfo((prev) => ({
                        ...prev,
                        insurerContract: value,
                      }))
                    }
                  >
                    {insurersContracts.map(({ id, number, startsAt, title }) => (
                      <Ant.Select.Option key={id} value={id}>
                        {`Договор №${number} «${title}»  от ${moment(startsAt).format('DD.MM.YYYY')}`}
                      </Ant.Select.Option>
                    ))}
                  </Ant.Select>
                </VzForm.Item>
              </VzForm.Col>
            </VzForm.Row>
            <div className="flexbox justify-right margin-top-12">
              <Ant.Button type={'primary'} onClick={saveInsuranceInfo}>
                Сохранить
              </Ant.Button>
            </div>
          </Ant.Collapse.Panel>
        ) : null}
        {info.contours?.[0]?.isManager ? (
          <Ant.Collapse.Panel header="Настройка типов ТС" key="vehicleTypes">
            <VehicleTypes
              dataSource={counterpartyVehicleTypes}
              getVehicleTypes={getVehicleTypes}
              filtersVisible={false}
              title={'Типы ТС контрагента'}
              hint={t.transports('vehicleTypesCounterpartyHint')}
            />
          </Ant.Collapse.Panel>
        ) : null}
        {(appIsDispatcher || info?.role == 4) && (
          <Ant.Collapse.Panel header="Настройка делегирования" key="delegation">
            {appIsDispatcher ? (
              <>
                <Filters
                  {...{
                    params,
                    pushParams,
                    paramKeys,
                    showArrow: false,
                    filtersActions,
                    title: 'Делегирование пользователям',
                  }}
                />
                <VzTable.Table
                  columns={columns}
                  dataSource={filteredData}
                  rowKey="id"
                  disabled={true}
                  rowSelection={rowSelection}
                />
                <div className="counterparty-page-settings-actions">
                  <Ant.Button className={'settings-btn ant-btn-primary'} disabled={changed} onClick={() => onSave()}>
                    Сохранить делегирование
                  </Ant.Button>
                </div>
              </>
            ) : (
              <>
                <VzForm.Group title={<h2 className="bold">Делегировать управление Личным кабинетом</h2>}>
                  <VzForm.Row>
                    <VzForm.Col span={8}>
                      <VzForm.Item label={'Делегировать управление ЛК'}>
                        <Ant.Select onChange={(value) => setDelegateManagement(value)} value={delegateManagement}>
                          {delegateForClientsOptions}
                        </Ant.Select>
                      </VzForm.Item>
                    </VzForm.Col>
                  </VzForm.Row>
                </VzForm.Group>
                <VzForm.Actions>
                  <Ant.Button
                    type="primary"
                    onClick={onSaveDelegation}
                    className={cn('semi-wide margin-left-16', {
                      disabled: delegateManagement == info?.delegateManagement,
                    })}
                  >
                    Сохранить
                  </Ant.Button>
                </VzForm.Actions>
              </>
            )}
          </Ant.Collapse.Panel>
        )}
      </Ant.Collapse>
    </>
  );
};

const mapStateToProps = (state) => {
  let { dictionaries, user } = state;

  return {
    dictionaries,
    user,
  };
};

export default connect(mapStateToProps)(Settings);
