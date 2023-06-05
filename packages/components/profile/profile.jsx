import React from 'react';
import autobind from 'autobind-decorator';
import { ButtonIconDeprecated, MenuDropDown, showError, showConfirm, IconDeprecated } from '@vezubr/elements';
import defaultProfile from '@vezubr/common/assets/img/default_profile.png';
import Utils from '@vezubr/common/common/utils';
import { bindActionCreators } from 'redux';
import connect from 'react-redux/es/connect/connect';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import NotificationsMenu from '../notificationsMenu';

const Profile = () => {
  const [open, setOpen] = React.useState(false);
  const { user, contractor, dictionaries } = useSelector((state) => state);
  const onDropdownClose = React.useCallback(() => {
    setOpen(false);
  }, []);

  const onSwitchToAnotherLk = React.useCallback(async (id) => {
    try {
      await Utils.switchToDelegated(id, true);
    } catch (e) {
      console.error(e);
      showError(e);
    }
  }, []);

  const openOnSwitchPopup = React.useCallback((contractor) => {
    showConfirm({
      title: `Перейти в ЛК ${contractor?.title || contractor?.inn || contractor?.id}?`,
      onOk: () => {
        onSwitchToAnotherLk(contractor?.id);
      },
      cancelText: 'Отмена',
      onCancel: () => {},
    });
  }, []);

  const renderProfileInfo = React.useMemo(() => {
    return (
      <div>
        <h4 className={'title'} onClick={() => setOpen(prev => !prev)}>
          {user.companyShortName || user.companyFullName || user.name || user.fullName || user.inn || user.phone}
        </h4>
      </div>
    );
  }, [user, setOpen]);

  const dropdownList = React.useMemo(
    () => ({
      user,
      url: `/profile${APP === 'operator' ? '/account/main' : '/main'}`,
    }),
    [user],
  );

  return (
    <div className={'profile flexbox justify-right align-center padding-left-25'}>
      <NotificationsMenu />
      {renderProfileInfo}
      <div className={'relative'}>
        {APP === 'operator' ? null : (
          <ButtonIconDeprecated onClick={() => setOpen(prev => !prev)} default={true} className={'border'} svgIcon={'chevronDownOrange'} />
        )}
        <MenuDropDown
          options={{
            profile: true,
            list: [dropdownList],
            show: open,
            arrowPosition: 'center',
          }}
          onSwitchToAnotherLk={openOnSwitchPopup}
          contourTypes={dictionaries?.contourTypes}
          byEmployees={contractor?.byEmployees.filter((el) => el.id !== user?.id)}
          onClose={onDropdownClose}
        />
      </div>
    </div>
  );
};

export default Profile;
