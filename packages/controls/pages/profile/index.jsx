import React, { useState, useEffect, useMemo } from 'react';
import t from '@vezubr/common/localization';
import { FilterButton, IconDeprecated, showError } from '@vezubr/elements';
import { useSelector } from 'react-redux';
import { Route, Switch } from 'react-router';
import ProfileAdditional from './tabs/profile-additional';
import ProfileMain from './tabs/profile-main';
import ProfileUsers from './tabs/profile-users/list';
import ProfileUserAdd from './tabs/profile-users/user-add';
import ProfileUserEdit from './tabs/profile-users/user-edit/';
import ProfileGroups from './tabs/profile-groups/list';
import ProfileGroupAdd from './tabs/profile-groups/group-add';
import ProfileGroupEdit from './tabs/profile-groups/group-edit';
import ProfileUser from '../user';
import Tabs from '../../tabs';
import { createRouteWithParams, ROUTES } from '../../infrastructure/routing';
import { ROUTE_PARAMS } from '../../infrastructure';
import { useHistory } from 'react-router-dom';
import { Profile as ProfileService } from '@vezubr/services'
const STATE_TITLES = {
  default: t.profile('profile'),
  mainUser: t.profile('mainUser'),
  extraUser: t.profile('extraUser'),
  users: t.profile('users'),
  addingUser: t.profile('addingUser'),
  editingUser: t.profile('editingUser'),
};

const ROUTE_PROFILE_MAIN = createRouteWithParams(ROUTES.PROFILE, { [ROUTE_PARAMS.paramOptions]: 'main' });
const ROUTE_PROFILE_EXTRA = createRouteWithParams(ROUTES.PROFILE, { [ROUTE_PARAMS.paramOptions]: 'extra' });
const ROUTE_PROFILE_GROUPS = createRouteWithParams(ROUTES.PROFILE, { [ROUTE_PARAMS.paramOptions]: 'groups' });
const ROUTE_PROFILE_GROUPS_ADD = createRouteWithParams(ROUTES.PROFILE, { [ROUTE_PARAMS.paramOptions]: 'groups/add' });
const ROUTE_PROFILE_GROUPS_EDIT = createRouteWithParams(ROUTES.PROFILE, {
  [ROUTE_PARAMS.paramOptions]: 'groups/edit/:id',
});
const ROUTE_PROFILE_USERS = createRouteWithParams(ROUTES.PROFILE, { [ROUTE_PARAMS.paramOptions]: 'users' });
const ROUTE_PROFILE_USERS_ADD = createRouteWithParams(ROUTES.PROFILE, { [ROUTE_PARAMS.paramOptions]: 'users/add' });
const ROUTE_PROFILE_USERS_EDIT = createRouteWithParams(ROUTES.PROFILE, {
  [ROUTE_PARAMS.paramOptions]: 'users/:id/edit',
});
const ROUTE_PROFILE_USERS_USER = createRouteWithParams(ROUTES.PROFILE, { [ROUTE_PARAMS.paramOptions]: 'users/:id' })

function Profile(props) {
  const history = useHistory();
  const {
    location: { pathname },
  } = history;
  const dictionaries = useSelector((state) => state.dictionaries);
  const [users, setUsers] = useState([]);
  const contractor = useSelector((state) => state.user);
  const [disabledEditUser, setDisabledEditUser] = useState(false);
  const [showMenu, setShowMenu] = useState(false)

  const goToUsers = () => {
    history.push(`/profile/users`);
  };

  const goToGroups = () => {
    history.push(`/profile/groups`);
  };

  const goToEditUser = ({ id }, disabledEdit = false) => {
    if (disabledEdit) {
      setDisabledEditUser(true);
    } else {
      setDisabledEditUser(false);
    }
    history.push(`/profile/users/${id}/edit`);
  };

  const titles = useMemo(() => {
    if (pathname.includes('main')) {
      return STATE_TITLES.mainUser;
    } else if (pathname.includes('extra')) {
      return STATE_TITLES.extraUser;
    } else if (pathname.includes('users/add')) {
      return STATE_TITLES.addingUser;
    } else if (pathname.includes('users/edit')) {
      return STATE_TITLES.editingUser;
    } else if (pathname.includes('users')) {
      return STATE_TITLES.users;
    }

    return STATE_TITLES.default;
  }, [pathname]);

  const tabs = useMemo(() => {
    return {
      attrs: {
        className: 'profile-tabs',
      },
      items: [
        {
          title: t.profile('generalInfo'),
          route: ROUTE_PROFILE_MAIN,
        },
        {
          title: t.profile('additionalInfo'),
          route: ROUTE_PROFILE_EXTRA,
        },
        {
          title: t.profile('groups'),
          route: ROUTE_PROFILE_GROUPS,
          show: APP === 'dispatcher',
        },
        {
          title: t.profile('users'),
          route: ROUTE_PROFILE_USERS,
        },
      ],
    };
  }, []);

  return (
    <div className={'profile-view'}>
      <div className={'profile-title-block flexbox align-center space-between'}>
        <div className="flexbox align-center">
          <IconDeprecated className={'back-action'} name={'backArrowOrange'} onClick={() => history.goBack()} />
          <h2 className={'bold'}>{titles}</h2>
        </div>
        <div className="profile-view__menu-button">
          <FilterButton
            icon={'dotsBlue'}
            className={'circle'}
            withMenu={true}
            onClick={() => setShowMenu(prev => !prev)}
            menuOptions={{
              show: showMenu,
              list: [
                {
                  icon: 'repeatOrange',
                  onAction: async () => {
                    const { inn, kpp } = contractor
                    try {
                      await ProfileService.refreshOrganization({
                        inn,
                        kpp
                      })
                      window.location.reload();
                    } catch (e) {
                      showError(e)
                    } finally {
                      setShowMenu(false)
                    }
                  },
                  title: 'Обновить информацию по профилю',
                },
              ],
            }}
          />
        </div>
      </div>
      <div className={'flexbox center column'}>
        <div className={'profile-view__tabs-wrp'}>
          <Tabs {...tabs} adaptForMobile={495} menuOpts={{ dropDownPosition: 'rightCenter' }} />
        </div>
        <div className={'white-container flexbox margin-top-12 margin-bottom-20'}>
          <Switch>
            <Route
              {...ROUTE_PROFILE_MAIN}
              render={(props) => (
                <ProfileMain {...props} contractor={contractor} values={contractor} dictionaries={dictionaries} />
              )}
            />
            <Route {...ROUTE_PROFILE_EXTRA} render={(props) => <ProfileAdditional {...props} contractor={contractor} />} />
            <Route
              {...ROUTE_PROFILE_GROUPS}
              render={(props) => <ProfileGroups {...props} dictionaries={dictionaries} goToEditUser={goToEditUser} />}
            />
            <Route
              {...ROUTE_PROFILE_GROUPS_ADD}
              render={(props) => <ProfileGroupAdd {...props} dictionaries={dictionaries} goToGroups={goToGroups} />}
            />
            <Route
              {...ROUTE_PROFILE_GROUPS_EDIT}
              render={(props) => (
                <ProfileGroupEdit
                  {...props}
                  dictionaries={dictionaries}
                  disabledEditUser={disabledEditUser}
                  goToGroups={goToGroups}
                />
              )}
            />
            <Route
              {...ROUTE_PROFILE_USERS}
              render={(props) => <ProfileUsers {...props} dictionaries={dictionaries} goToEditUser={goToEditUser} />}
            />

            <Route
              {...ROUTE_PROFILE_USERS_EDIT}
              render={(props) => (
                <ProfileUserEdit
                  {...props}
                  dictionaries={dictionaries}
                  disabledEditUser={disabledEditUser}
                  goToUsers={goToUsers}
                />
              )}
            />
            <Route
              {...ROUTE_PROFILE_USERS_ADD}
              render={(props) => <ProfileUserAdd {...props} dictionaries={dictionaries} goToUsers={goToUsers} />}
            />
            <Route
              {...ROUTE_PROFILE_USERS_USER}
              render={(props) => <ProfileUser {...props} />}
            />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default Profile;
