import React, { useCallback, useEffect, useState } from "react";
import { useParams } from 'react-router';
import UserForm from '../../../forms/user-form';
import { Contragents } from '@vezubr/services/index.operator';
import { Page } from '@vezubr/elements';

const User = (props) => {
  const { contractorId, userId, setUserId } = props;
  const [user, setUser] = useState(null);
  const fetchUser = useCallback(async () => {
    try {
      const response = (await Contragents.user({ userId, contractorId })).data;
      setUser(response)
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    if (userId && contractorId) {
      fetchUser()
    }
    () => {
      setUserId(null);
    }
  }, [userId, contractorId])

  if (!user) {
    return null
  }

  return (
    <>
      <Page.Title onBack={() => setUserId(null)}>
        ID: {userId} / {`${user.surname} ${user.name} ${user.patronymic || ''}`}
      </Page.Title>
      <UserForm values={user} disabled={true} />

    </>
  )
}

export default User;