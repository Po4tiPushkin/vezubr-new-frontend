import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './styles.scss';
import { Profile as ProfileService } from '@vezubr/services';
import { showError, showAlert, Ant } from '@vezubr/elements';
import { sortBy } from 'lodash';
import t from '@vezubr/common/localization';
import { ResponsibleEmployees } from '@vezubr/components';
import { Utils } from '@vezubr/common/common';
const Service = (props) => {
  const { id, info, setInfo } = props;
  const [userList, setUserList] = useState([]);
  const [data, setData] = useState({});
  const [initialData, setInitialData] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await Utils.fetchAllEmployees();
        const dataSource = response || [];
        setUserList(_.sortBy(dataSource, 'fullName'));
      } catch (e) {
        showError(e);
      }

    }
    fetchData();
  }, [])

  useEffect(() => {
    setData(prev => {
      return {
        ...prev,
        publicResponsibleEmployees: info?.publicResponsibleEmployees ? info?.publicResponsibleEmployees.map(el => el.id) : [],
        internalResponsibleEmployees: info?.internalResponsibleEmployees ? info?.internalResponsibleEmployees.map(el => el.id) : [],
        comment: info?.comment || '',
        publicComment: info?.publicComment || ''
      }
    })
    setInitialData(prev => {
      return {
        ...prev,
        publicResponsibleEmployees: info?.publicResponsibleEmployees ? info?.publicResponsibleEmployees.map(el => el.id) : [],
        internalResponsibleEmployees: info?.internalResponsibleEmployees ? info?.internalResponsibleEmployees.map(el => el.id) : [],
        comment: info?.comment || '',
        publicComment: info?.publicComment || ''
      }
    })

  }, [info])

  const changed = useMemo(() => {
    return _.isEqual(initialData, data);
  }, [data, initialData])

  const onSave = useCallback(async (inputs) => {
    try {
      const dataForSend = {
        ...data,
        customProperties: info?.customProperties ?
          info.customProperties.map(el => {
            return {
              latinName: el?.customProperty?.latinName,
              values: el.values
            }
          })
          : [],
        insurerContractId: info?.insurerContract?.id
      }
      const response = await ProfileService.contractorEdit({ id: id, data: dataForSend });
      showAlert({
        content: 'Настройки были сохранены',
        title: 'ОК',
      });
      setInfo({
        id,
        ...response,
      }
      );
    } catch (e) {
      showError(e);
      console.error(e);
    }
  }, [data, info]);

  const onChangeCounterparty = useCallback((newValues) => {
    setData(prev => { return { ...prev, publicResponsibleEmployees: newValues?.responsibleEmployees, publicComment: newValues?.comment } })
  }, []);

  const onChangeCompany = useCallback((newValues) => {
    setData(prev => { return { ...prev, internalResponsibleEmployees: newValues?.responsibleEmployees, comment: newValues?.comment } })
  }, []);

  return (
    <div className="counterparty-service">
      {
        id && (
          <div className="counterparty-service__main">
            <div className='counterparty-service__item' >

              <ResponsibleEmployees
                groupTitle={
                  <Ant.Tooltip placement="right" title={t.settings('hint.employeesCounterParty')}>
                    <h2 className={`counterparty-service__hint-title`}>
                      Ответственные за взаимодействие с контрагентом сотрудники (Менеджеры) {<Ant.Icon type={'info-circle'} />}
                    </h2>
                  </Ant.Tooltip>
                }
                hasCommentField={true}
                isForm={false}
                onChange={onChangeCounterparty}
                values={{ ...data, responsibleEmployees: data?.publicResponsibleEmployees, comment: data?.publicComment }}
                data={userList}
                colSpan={24}
              />
            </div>
            {/* <div className='counterparty-service__item margin-top-15'>
              <ResponsibleEmployees
                groupTitle={
                  <Ant.Tooltip placement="right" title={t.settings('hint.employeesCompany')}>
                    <h2 className={`counterparty-service__hint-title`}>
                      Ответственные за исполнение заказа внутри компании (Логисты) {<Ant.Icon type={'info-circle'} />}
                    </h2>
                  </Ant.Tooltip>
                }
                hasCommentField={true}
                isForm={false}
                onChange={onChangeCompany}
                values={{ ...data, responsibleEmployees: data?.internalResponsibleEmployees, comment: data?.comment }}
                data={userList}
                colSpan={24}
              />
            </div> */}
            <div className='flexbox margin-top-15' style={{ 'justifyContent': 'flex-end' }}>
              <Ant.Button type={'primary'} disabled={changed} onClick={onSave}>
                Сохранить
              </Ant.Button>
            </div>
          </div>
        )
      }

    </div>
  )
}

export default Service;