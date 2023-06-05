import React, { useEffect, useCallback, useMemo, useState } from 'react';
import { Profile as ProfileService } from '@vezubr/services';
import { showError, Ant, VzForm } from '@vezubr/elements';
const UserFormGroups = (props) => {
  const { groups, setGroups, disabled } = props;
  const [groupList, setGroupList] = useState([]);
  const [loading, setLoading] = useState(false);
  const groupsOptions = useMemo(() => {
    return groupList.map(el => (
      <Ant.Select.Option value={el.id} key={+el.id}>
        {el.title}
      </Ant.Select.Option>
    ))
  }, [groupList])
  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true)
      const response = await ProfileService.contractorGroupsList({ itemsPerPage: 100 });
      const dataSource = response.requestGroups;
      let page = 2;
      const totalPages = Math.ceil(response.itemsCount / 100);
      while (page <= totalPages) {
        const newResponse =
          await ProfileService.contractorGroupsList({ itemsPerPage: 100, page });
        page += 1;
        dataSource.push(...newResponse.requestGroups);
      }
      setGroupList(dataSource);
    } catch (e) {
      showError(e);
      console.error(e);
    }
    finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGroups();
  }, [])

  return (
    <VzForm.Col span={12}>
      <VzForm.Item disabled={disabled} label={'Группы'}>
        <Ant.Select disabled={disabled} loading={loading} value={groups} mode={'multiple'} onChange={(e) => setGroups(e)} >
          {groupsOptions}
        </Ant.Select>
      </VzForm.Item>
    </VzForm.Col>
  )
}

export default UserFormGroups;