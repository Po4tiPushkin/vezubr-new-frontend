import React, { useState, useEffect, useMemo } from 'react';
import { Button } from 'antd';
import { Modal, VzForm } from '@vezubr/elements';
import FilterSaveEditor from './saveEditor';
import { uuid } from '@vezubr/common/utils';
import { getDBConfig, setDBConfig } from '../utils';
import { getDBConfig as getTableDbConfig } from '../../tableConfig/utils';
import { useSelector } from 'react-redux';

export default function FiltersSave(props) {
  const { params, filterSetName, tableKey } = props;
  const { id } = useSelector(state => state.user)
  const [visibleModal, setVisibleModal] = useState(false);

  const handleSave = async (form) => {
    const { values, errors } = await VzForm.Utils.validateFieldsFromAntForm(form);

    if (errors !== null) {
      return;
    }

    const oldFilter = await getDBConfig(`filters-${id}`);
    const uuidName = uuid();

    const configFilter = {
      [uuidName]: {
        params,
        name: values?.documentNumber,
      }
    }

    if (values.saveColumns) {
      const currentColumns = getTableDbConfig(tableKey);
      if (currentColumns?.columns || currentColumns?.defaultColumns) {
        configFilter[uuidName].columns = currentColumns?.columns || currentColumns?.defaultColumns;
      }
    }

    if (oldFilter === null) {
      setDBConfig(`filters-${id}`, {
        [filterSetName]: {
          ...configFilter
        }
      });
    } else {
      setDBConfig(`filters-${id}`, {
        ...oldFilter,
        ...{
          [filterSetName]: {
            ...oldFilter[filterSetName],
            ...configFilter,
          }
        }
      });
    }
    setVisibleModal(false);
  }

  const openModal = () => {
    setVisibleModal(true);
  }

  const closeModal = () => {
    setVisibleModal(false);
  }

  return (
    <>
      <Button type="primary" onClick={openModal} className={'semi-wide'}>
        Сохранить
      </Button>
      <Modal
        title={'Сохранить фильтр'}
        visible={visibleModal}
        centered={false}
        destroyOnClose={true}
        footer={null}
        width={500}
        onCancel={closeModal}
      >
        <FilterSaveEditor tableKey={tableKey} onSave={handleSave} />
      </Modal>
    </>
  )
}