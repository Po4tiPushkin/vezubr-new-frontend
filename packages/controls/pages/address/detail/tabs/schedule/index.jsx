import React, { useCallback, useContext, useEffect, useState } from 'react';
import { VzTableFiltered } from '@vezubr/components';
import useParams from '@vezubr/common/hooks/useParams';
import AddressContext from '../../context';
import useColumns from './hooks/useColumns';
import { history } from '../../../../../infrastructure';
import { Address as AddressService } from '@vezubr/services';
import PropTypes from 'prop-types';
import AddressScheduleForm from '../../../../../forms/address/address-schedule-form';
import AverageOperationTimeForm from '../../../../../forms/address/address-average-operation-time-from';
import { ButtonDeprecated, showAlert, showError, VzForm } from '@vezubr/elements';
import t from '@vezubr/common/localization';
import { undecorateAddress } from '../../utils';
import moment from 'moment';


const paramKeys = {
  page: 'page',
  orderBy: 'orderBy',
  orderDirection: 'orderDirection',
};

const defaultOpeningHours = [
  {
    day: "Понедельник",
    key: "monday",
    workTime: [],
  },
  {
    day: "Вторник",
    key: "tuesday",
    workTime: [],
  },
  {
    day: "Среда",
    key: "wednesday",
    workTime: [],
  },
  {
    day: "Четверг",
    key: "thursday",
    workTime: [],
  },
  {
    day: "Пятница",
    key: "friday",
    workTime: [],
  },
  {
    day: "Суббота",
    key: "saturday",
    workTime: [],
  },
  {
    day: "Воскресенье",
    key: "sunday",
    workTime: [],
  },
];


const AddressSchedule = () => {
  const { addressInfo, setAddressInfo, reload } = useContext(AddressContext);
  const { id } = useContext(AddressContext); // id address
  const [address, setAddress] = useState(defaultOpeningHours);
  const [averageOperationTime, setAverageOperationTime] = useState({});
  const [isUpdated, setIsUpdated] = useState();
  const [mode, setMode] = useState('view');

  useEffect(() => {
    const fetch = async () => {
      const openingHours = await AddressService.openingHours(id)

      const workTime = defaultOpeningHours.map(el => {
        el.workTime = openingHours.days?.find(day => day.day === el.key)?.workTime || []
        return el
      })

      setAddress(workTime)

      const info = await AddressService.info(id)

      const { averageOperationTime } = info

      Object.entries(averageOperationTime).forEach((el) => {
        averageOperationTime[el[0]] = Math.floor(averageOperationTime[el[0]] / 60)
      });

      setAverageOperationTime(averageOperationTime);

      setIsUpdated(false);

    }
    fetch()
  }, [id, isUpdated]);

  const handleEdit = useCallback(() => {
    setMode('edit');
  }, []);

  const handleCancel = useCallback((form) => {
    form.resetFields();
    setMode('view');
  }, []);

  const handleSave = useCallback(
    async (form) => {
      const { values } = await VzForm.Utils.validateFieldsFromAntForm(form);

      const workTime = {};
      const operationTime = {};

      for (let i = 0; i < 7; i++) {
        workTime[i] = [];
      }

      Object.keys(values).forEach((item) => {
        if (item.includes('workTime')) {
          const [name, index] = item.split('/');
          const intoMinutes = values[item].split('-').map((el) => moment.duration(el.trim()).asMinutes());

          if (values[item] !== '' && intoMinutes[0] < intoMinutes[1]) {
            const position = name[name.length - 1];

            if (workTime[position]) {
              let bool = true;
              workTime[position].forEach((el) => { // check time areas
                const elInMin = el.split('-').map((el) => moment.duration(el.trim()).asMinutes());
                if ((elInMin[0] < intoMinutes[0] && elInMin[1] > intoMinutes[0]) ||
                  (elInMin[0] > intoMinutes[1] && elInMin[1] < intoMinutes[1])) {
                  bool = false;
                }
              });
              if (bool === true) {
                workTime[position].push(values[item]);
              }
            } else {
              workTime[position] = new Array(values[item]);
            }
          }
        } else {
          operationTime[item] = values[item] * 60;
        }
      });

      const days = address.map((item, index) => ({ // compilig data before send to api 'Понедельник' 
        day: item.key,
        workTime: workTime[index],
      }));

      const allUpdatedValuesDate = undecorateAddress({
        ...addressInfo,
        averageOperationTime: operationTime,
        id
      });

      try {
        await AddressService.update(allUpdatedValuesDate);
        await AddressService.updateOpeningHours(id, { days });
        setIsUpdated(true);
        showAlert({
          content: t.common('Адрес был успешно обновлен'),
          onOk: () => {
            setMode('view');
            reload();
          },
        });
      } catch (e) {
        console.error(e);
        showError(e.message);
      }
    },
    [address, addressInfo],
  );

  const [columns, width] = useColumns();
  const [params, pushParams] = useParams({ history, location });

  return mode === 'view' ? (
    <div className="address-schedule">
      <h3 className={'content-title'}>Окна доставки</h3>
      <VzTableFiltered.TableFiltered
        {...{
          params,
          pushParams,
          columns,
          dataSource: address,
          rowKey: 'key',
          scroll: { x: width, y: 550 },
          paramKeys,
          responsive: false,
        }}
      />
      <AverageOperationTimeForm
        averageOperationTime={averageOperationTime}
        setAverageOperationTime={setAverageOperationTime}
        mode={mode}
        disabled={mode === 'view'}
        checkOnInit={true}
      />
      <VzForm.Actions>
        <ButtonDeprecated
          disabled={APP === 'dispatcher' ? !addressInfo?.contractorOwner?.delegated : false}
          onClick={handleEdit}
          className={'semi-wide margin-left-16'}
          theme={'primary'}
        >
          Редактировать
        </ButtonDeprecated>
      </VzForm.Actions>
    </div>
  ) : (
    <div className="address-schedule">
      <AddressScheduleForm
        values={address}
        averageOperationTime={averageOperationTime}
        mode={mode}
        disabled={mode === 'view'}
        onSave={handleSave}
        onEdit={handleEdit}
        onCancel={handleCancel}
        delegated={APP === 'dispatcher' ? addressInfo?.contractorOwner?.delegated : false}
      />
    </div>
  );
};

AddressSchedule.propTypes = {
  id: PropTypes.number,
};

export default AddressSchedule;
