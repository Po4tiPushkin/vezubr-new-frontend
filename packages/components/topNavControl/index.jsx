import React, { useMemo, useState, useCallback } from 'react';
import * as CONSTANTS from './constants';
import { connect } from 'react-redux';
import { Modal, showError, showAlert, Ant } from '@vezubr/elements';
import EditTopNav from './elements/editTopNav';
import { setLocalStorageItem } from '@vezubr/common/common/utils';
const list = CONSTANTS[`TOP_NAV_${APP.toUpperCase()}`];

const TopNavControl = (props) => {
  const { topNav = [], store } = props;
  const oldTopNav = useMemo(() => {
    return localStorage.getItem(`topNav${APP}`)?.split(',').filter(el => el) || topNav
  }, [topNav, localStorage.getItem(`topNav${APP}`)]);

  const changeTopNav = useCallback((navOptions) => {
    setLocalStorageItem(`topNav${APP}`, navOptions);
    props.dispatch({ type: 'UPDATE_NAV_STATE' , topNavState: navOptions});
  }, [])

  return (
    <>
      <EditTopNav oldTopNav={oldTopNav} changeTopNav={changeTopNav} list={list} />
    </>
  )
}

const mapStateToProps = (state) => {
  const { topNav } = state;
  return { topNav };
};

export default connect(mapStateToProps)(TopNavControl);


