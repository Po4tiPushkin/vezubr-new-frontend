import React, { useState, useEffect, useCallback } from 'react';
import { Ant, showAlert, VzForm, showError, Loader, WhiteBox, IconDeprecated } from "@vezubr/elements";
import { Profile as ProfileService, Contractor as ContractorService } from '@vezubr/services';
import { Utils } from '@vezubr/common/common';

import { useSelector } from 'react-redux';
import t from "@vezubr/common/localization"
import ProfileUserForm from '../../forms/profile-form/user-form';
import ProfilePasswordForm from '../../forms/profile-form/password-form';
import ProfileUserContractors from './components/contractors-list';
import jwtDecode from 'jwt-decode';
import Cookies from '@vezubr/common/common/cookies';
import { useHistory } from "react-router-dom";
const ProfileUserDetail = (props) => {
  const user = useSelector((state) => state.user);
  const dictionaries = useSelector((state) => state.dictionaries);
  const { match } = props;
  const history = useHistory();
  const id = +match.params.id;
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const fetchUser = async () => {
    try {
      setLoading(true);
      const responseUser = await ProfileService.contractorGetUser(id);
      const { data, itemsCount } = await ContractorService.listByResponsibleEmployee({ employeeId: id, itemsPerPage: 99999 })
      responseUser.contractors = { data: Utils.getIncrementingId(data, 1), itemsCount: itemsCount };
      setUserData(responseUser);
    } catch (e) {
      console.error(e);
      showError(e);
    }
    finally {
      setLoading(false);
    }
  }

  const onRemoveContractors = async (contractorIds) => {
    try {
      setLoading(true);
      await ContractorService.removeResponsible({ employeeIds: [+id], contractorIds });
      await fetchUser();
    } catch (e) {
      showError(e);
      console.error(e);
      setLoading(false);
    }

  };

  const goToEdit = () => {
    history.push(`/profile/users/${id}/edit`)
  }

  const onAssignContractors = async (contractorIds) => {
    try {
      setLoading(true)
      await ContractorService.assignResponsible({ employeeIds: [+id], contractorIds });
      await fetchUser();
    } catch (e) {
      showError(e);
      console.error(e);
      setLoading(false);
    }
  };

  const onDelegateContractors = async (employeeIds, contractorIds) => {
    try {
      setLoading(true);
      await ContractorService.assignResponsible({ employeeIds, contractorIds });
      await fetchUser();
    } catch (e) {
      setLoading(false);
      showError(e);
      console.error(e);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {!userData && loading && <Loader />}
      {userData &&
        (
          <div className='user'>
            <div className='margin-left-24 margin-right-24'>
              <WhiteBox.Header
                type={'h1'}
                icon={<IconDeprecated name={'orderTypeLoad'} />}
                iconStyles={{ color: '#F57B23' }}
              >
                {`${userData.surname} ${userData.name} ${userData?.patronymic ? userData?.patronymic : ''}`}
              </WhiteBox.Header>
            </div>
            <ProfileUserForm
              dictionaries={dictionaries}
              values={userData}
              disabled={true}
              goToEdit={goToEdit}
            />
            {jwtDecode(Cookies.get(`${APP}Token`))?.userId === id && <ProfilePasswordForm
              dictionaries={dictionaries}
              values={userData}
              disabled={true}
            />}
            <ProfileUserContractors
              contractors={userData.contractors}
              onRemove={(e) => onRemoveContractors(e)}
              onAssign={(e) => onAssignContractors(e)}
              onDelegate={(e, id) => onDelegateContractors(e, id)}
              loading={loading}
            />
          </div>
        )
      }
    </>
  )
}

export default ProfileUserDetail;