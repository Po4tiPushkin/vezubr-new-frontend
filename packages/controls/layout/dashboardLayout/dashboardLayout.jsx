import React from 'react';
import PropTypes from 'prop-types';
import TopNav from '../topNav';
import Sidebar from '../sidebar';
import LogoBottom from '../logoBottom/logoBottom';
import { Alert, Confirm } from '@vezubr/components';
import NotificationFromCreateRoute from '@vezubr/components/notificationFromCreateRoute';
import Cookies from '@vezubr/common/common/cookies';
import { observer } from '../../infrastructure';
function DashboardLayout({ children, store, history, location }) {
  const splitArr = history.location.pathname.split('/');

  const classesArr = [splitArr[1] || '', splitArr[3] || ''].map((v) => {
    if (parseInt(v, 10)) {
      return `id-${v}`;
    }
    return v;
  });

  const fullPagePath = splitArr
    .filter((v) => v.trim())
    .map((v) => {
      const paramInt = parseInt(v, 10);
      if (typeof paramInt === 'number' && !isNaN(paramInt)) {
        return 'id';
      }
      return v;
    });

  const splitArrayFilters = splitArr.filter((v) => !!v && !parseInt(v, 10));

  const classPageDeep2 = `page-${splitArrayFilters.slice(0, 2).join('-')}`;

  const classPage = `page-${splitArrayFilters.join('-')}`;

  const fullPagePathClass = `path-${fullPagePath.join('-')}`;
  return (
    <div className={'dashboard'}>
      <Alert observer={observer} />
      <Confirm observer={observer} />
      <TopNav />
      <div className={'dashboard-content margin-top-60'}>
        <Sidebar />
        <div className={`${classesArr.join(' ').trim()} ${classPageDeep2} ${classPage} ${fullPagePathClass} container`}>
          {children}
        </div>
      </div>
      {
        APP !== 'operator'
        &&
        <NotificationFromCreateRoute />
      }
    </div>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
  store: PropTypes.object,
};

export default DashboardLayout;
