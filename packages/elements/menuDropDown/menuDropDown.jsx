import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { ROLES } from '@vezubr/common/constants/constants';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import IconDeprecated from '../DEPRECATED/icon/icon';

const ClickStateItem = ({ menu, onClose, navigateTo }) => {
  const onClick = useCallback(
    (e) => {
      e.preventDefault();

      if (menu.disabled) {
        return;
      }

      if (menu.url) {
        navigateTo(menu.url);
      } else if (menu.onAction) {
        menu.onAction(e);
      }

      onClose(e)
    },
    [menu.disabled, menu.url, menu.onAction],
  );
  return (
    <>
      <li className={`pointer${menu.disabled ? ' disabled' : ''}`} onClick={onClick}>
        <span>{typeof menu.icon === 'string' ? <IconDeprecated name={menu.icon} /> : menu.icon}</span>
        <span className={'text-big'}>{menu.title || menu.name}</span>
      </li>
      {menu.component}
    </>
  );
};

const MenuDropDown = (props) => {
  const { options: optionsInput, onClose, byEmployees, contourTypes, onSwitchToAnotherLk, onBlur } = props;
  const [options, setOptions] = useState(optionsInput);
  const [defaultStates, setDefaultStates] = useState(['newOrder', 'orders']);

  const history = useHistory();

  const closeOnOutsideClick = React.useCallback(() => {
    document.addEventListener('click', onOutsideClick);
  }, [onOutsideClick]);

  const onOutsideClick = React.useCallback(
    (e) => {
      if (options.show && defaultStates.some((state) => state !== e.srcElement.id) && e.target.alt !== 'dotsBlue') {
        e.preventDefault();
        const options = { ...options };
        options['show'] = false;
        setOptions(options);
        onClose(options);
      }
      document.removeEventListener('click', onOutsideClick);
    },
    [options, defaultStates],
  );

  React.useEffect(() => {
    history.listen(() => {
      const options = { ...options };
      if (options['show']) {
        options['show'] = false;
        setOptions(options);
        onClose(options);
      }
    });
  }, []);

  React.useEffect(() => {
    if (optionsInput.show) closeOnOutsideClick();
    if (options !== optionsInput) {
      setOptions(optionsInput);
    }
  }, [optionsInput]);

  const navigateTo = (url) => {
    window.scrollTo(0, 0);
    history.push(url);
  };

  const { dropDownPosition = '', arrowPosition = 'right' } = options;
  let dropDown = null;
  let byEmployeesRender = null;

  if (options.nodes) {
    dropDown = options.list;
  } else {
    dropDown = options.list.map((menu, key) => <ClickStateItem key={key} menu={menu} onClose={onClose} navigateTo={navigateTo} />);
  }

  if (options.profile) {
    dropDown = options.list.map((menu, key) => {
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
    if (byEmployees?.length) {
      byEmployeesRender = byEmployees.map((el) => {
        return (
          <div className="flexbox byemployees__item" onClick={() => onSwitchToAnotherLk(el)}>
            <div className="byemployees__field--first byemployees__field">{ROLES[el.role]}</div>
            <div className="byemployees__field" title={el.title || el.inn || el.id || ''}>
              {el.title || el.inn || el.id || ''}
            </div>
          </div>
        );
      });
    }
  }

  return (
    <div
      className={cn('menu-dropdown flexbox', dropDownPosition, `for-${options.list.length}`, {
        'menu-dropdown--show': options.show,
      })}
      tabIndex="0"
      onChange={onBlur}
      onFocus={onBlur}
    >
      <ul className={'dropdown-list ' + arrowPosition + ' ' + `for-${options.list.length}`}>{dropDown}</ul>
      {byEmployeesRender && (
        <div className="byemployees">
          <div className="byemployees__title">Выберите ЛК для перехода</div>
          <div className="flexbox byemployees__item byemployees__item--header">
            <div className="byemployees__field--first byemployees__field">Роль</div>
            <div className="byemployees__field">Название</div>
          </div>
          {byEmployeesRender}
        </div>
      )}
    </div>
  );
};

MenuDropDown.propTypes = {
  options: PropTypes.object.isRequired,
  onClose: PropTypes.func,
};

MenuDropDown.contextTypes = {
  routes: PropTypes.object.isRequired,
  history: PropTypes.object,
};

export default MenuDropDown;
