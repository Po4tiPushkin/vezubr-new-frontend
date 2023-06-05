import React, { useCallback, useState, useEffect, useMemo } from 'react';
import cn from 'classnames';
import { ROLES } from '@vezubr/common/constants/constants';
import PropTypes from 'prop-types';
import autobind from 'autobind-decorator';
import IconDeprecated from '../DEPRECATED/icon/icon';
import { Input } from '../antd';
import { useHistory } from 'react-router-dom';

const ClickStateItem = ({ menu, onClose, navigateTo }) => {
  const onClick = useCallback(
    (e) => {
      e.preventDefault();

      if (menu.disabled) {
        return;
      }

      if (menu.url) {
        if (menu.redirect) {
          window.open(menu.url, '_blank');
        } else {
          navigateTo(menu.url);
        }
      } else if (menu.onAction) {
        menu.onAction(e);
      }
      onClose(e);
    },
    [menu.disabled, menu.url, menu.onAction, onClose],
  );
  return (
    <>
      <li id={menu.id} className={`pointer ${menu.disabled ? 'disabled' : ''} close-menu`} onClick={onClick}>
        <span className='close-menu'>{typeof menu.icon === 'string' ? <IconDeprecated name={menu.icon} /> : menu.icon}</span>
        <span className={'text-big close-menu'}>{menu.title || menu.name}</span>
      </li>
      {menu.component}
    </>
  );
};

const MenuDropDown = (props) => {
  const { options, onClose, onSwitchToAnotherLk, byEmployees } = props;
  const history = useHistory();
  const wrapperRef = React.useRef(null);
  const [filterValue, setFilterValue] = useState('');

  const onOutsideClick = useCallback(
    (e) => {
      if (options?.show) {
        if (
          //Close menu if user clicked on "dots" button or any menu option or outside the dropdown
          e.target.alt == 'dotsBlue' ||
          e.target.classList.contains('close-menu') ||
          (wrapperRef.current && !wrapperRef?.current?.contains(e.target))
        ) {
          e.preventDefault();
          onClose();
        }
      }
      document.removeEventListener('click', onOutsideClick);
    },
    [options, wrapperRef],
  );

  const navigateTo = useCallback(
    (url) => {
      window.scrollTo(0, 0);
      history.push(url);
    },
    [history],
  );

  const closeOnOutsideClick = useCallback(() => {
    document.addEventListener('click', onOutsideClick);
  }, [options]);

  useEffect(() => {
    if (options?.show) {
      closeOnOutsideClick();
    }
  }, [options]);

  const renderDropdown = useMemo(() => {
    if (options.nodes) {
      return options.list;
    }

    if (options.profile) {
      return options.list.map((menu, key) => {
        return (
          <li
            key={key}
            className={'pointer profile-dropdown flexbox justify-right'}
            onClick={(e) => (menu.url ? navigateTo(menu.url) : menu.onAction ? menu.onAction(e) : e.preventDefault())}
          >
            <div>
              <h3 className={'text-big'}>
                {menu.user.companyShortName ||
                  menu.user.companyFullName ||
                  menu.user.name ||
                  menu.user.fullName ||
                  menu.user.inn ||
                  menu.user.phone}
              </h3>
              {menu.hasOwnProperty('balance') ? <h5 className={'balance'}>₽ {menu.balance}</h5> : null}
            </div>
          </li>
        );
      });
    }

    return options.list.map((menu, key) => (
      <ClickStateItem key={key} menu={menu} onClose={onClose} navigateTo={navigateTo} />
    ));
  }, [options, onClose]);

  const renderByEmployees = useMemo(() => {
    if (options.profile && byEmployees?.length) {
      return byEmployees
        .filter(
          (el) =>
            el?.title?.toLowerCase()?.includes(filterValue?.toLowerCase()) ||
            el?.inn?.toLowerCase()?.includes(filterValue?.toLowerCase()) ||
            el?.id?.toString()?.toLowerCase()?.includes(filterValue?.toLowerCase()),
        )
        .map((el) => {
          return (
            <div className="flexbox byemployees__item" onClick={() => onSwitchToAnotherLk(el)} key={el.id}>
              <div className="byemployees__field--first byemployees__field">{ROLES[el.role]}</div>
              <div className="byemployees__field" title={el.title || el.inn || el.id || ''}>
                {el.title || el.inn || el.id || ''}
              </div>
            </div>
          );
        });
    }
  }, [options, byEmployees, filterValue]);

  return (
    <div
      className={cn('menu-dropdown flexbox', options.dropDownPosition, `for-${options.list.length}`, {
        'menu-dropdown--show': options.show,
      })}
      tabIndex="0"
      ref={wrapperRef}
    >
      <ul className={'dropdown-list ' + options?.arrowPosition + ' ' + `for-${options.list.length}`}>
        {renderDropdown}
      </ul>
      {renderByEmployees && (
        <div className="byemployees">
          <div className="byemployees__title">Выберите ЛК для перехода</div>
          <div className="byemployees__filters"></div>
          <div className="byemployees__list">
            <div className="flexbox byemployees__item byemployees__item--header">
              <div className="byemployees__field--first byemployees__field">Роль</div>
              <div className="byemployees__field">
                <Input
                  placeholder="Название"
                  size="small"
                  style={{ backgroundColor: 'transparent' }}
                  value={filterValue}
                  onInput={(e) => setFilterValue(e.target.value.toString())}
                />
              </div>
            </div>
            <div className="byemployees__table">{renderByEmployees}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuDropDown;
